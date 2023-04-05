use crate::pb::txns::{Txns, TxnData};
use crate::util::{address_pretty, is_match_method_sig, parse_tx, read_uint32};

use substreams::log;
use substreams_ethereum::pb::eth::v2::{Call, TransactionTrace};

pub fn call_stake(
    txns: &mut Txns,
    tx: &TransactionTrace,
    call: &Call,
    timestamp: u64,
) {
    let contract = address_pretty(&call.address);
    const STAKE_SIG: &'static str = "801c5236";

    if contract != env!("SQUAD_STAKING_ADDRESS") || !is_match_method_sig(&call, STAKE_SIG) {
        return;
    }

    txns.data.push(TxnData { calldata: call.input.clone() });

}
