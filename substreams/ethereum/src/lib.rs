load_dotenv!();

mod abi;
mod activities;
mod ids;
mod macros;
mod pb;
mod process_squad_staking;
mod util;

use load_dotenv::load_dotenv;
use pb::txns::Txns;
use substreams::errors::Error;

use substreams::pb::substreams::Clock;
use substreams_ethereum::pb::eth::v2::Block;

const ZERO_ADDRESS: &str = "0x0000000000000000000000000000000000000000";
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

    let mut txns: Txns = Txns { data: vec![] };

    let timestamp = clk.timestamp.as_ref().unwrap().seconds as u64;

    for tx in blk.transactions() {
        for call in tx.calls.iter() {
            if call.state_reverted {
                continue;
            }

            process_squad_staking::call_stake(&mut txns, tx, call,timestamp);
        }
    }

    Ok(txns)
}
