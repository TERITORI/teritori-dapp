use rs_merkle::Hasher;
use sha3::{digest::FixedOutput, Digest, Keccak256};

#[derive(Clone)]
pub struct TrKeccak256 {}

impl Hasher for TrKeccak256 {
    type Hash = [u8; 32];

    fn hash(data: &[u8]) -> [u8; 32] {
        let mut hasher = Keccak256::new();

        hasher.update(data);
        <[u8; 32]>::from(hasher.finalize_fixed())
    }
}
