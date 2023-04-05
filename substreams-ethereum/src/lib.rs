load_dotenv!();

mod abi;
mod pb;
mod util;
mod whitelists;

use load_dotenv::load_dotenv;
use pb::txns::{Txns, TxnData};
use substreams::errors::Error;

use substreams::pb::substreams::Clock;
use substreams_ethereum::pb::eth::v2::{Block};
use util::{parse_tx, address_pretty};
use whitelists::{should_index};
use substreams::log;

pub struct ParsedTx {
    from: String,
    to: String,
    hash: String,
    value: String,
}

substreams_ethereum::init!();

#[substreams::handlers::map]
fn txns_out(blk: Block, clk: Clock) -> Result<Txns, Error> {
    substreams::register_panic_hook();

    let mut txns: Txns = Txns { txns_data: vec![] };

    let timestamp = clk.timestamp.as_ref().unwrap().seconds as u64;

    for tx in blk.transactions() {
        for call in tx.calls.iter() {
            if call.state_reverted {
                continue;
            }

            let contract = address_pretty(&call.address);
            let parsed_tx = parse_tx(&tx);

            if !should_index(call) {
                continue;
            }   

            txns.txns_data.push(TxnData {
                input_data: call.input.clone(),
                from: parsed_tx.from,
                to: parsed_tx.to,
                hash: parsed_tx.hash,
                value: parsed_tx.value,
                contract,
                timestamp,
            });
        }
    }

    Ok(txns)
}
