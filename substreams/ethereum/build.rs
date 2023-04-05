use anyhow::{Ok, Result};
use substreams_ethereum::Abigen;

// NOTE: delete mintWithMetadata and all tuple types in TeritoriNFT.json ABI which cause the error:
// thread 'main' panicked at 'not implemented: Tuples are not supported.
fn main() -> Result<(), anyhow::Error> {
    Abigen::new("teritori_nft", "abis/teritori_nft.json")?
        .generate()?
        .write_to_file("src/abi/teritori_nft.rs")?;

    Abigen::new("teritori_minter", "abis/teritori_minter.json")?
        .generate()?
        .write_to_file("src/abi/teritori_minter.rs")?;

    Abigen::new("teritori_vault", "abis/teritori_vault.json")?
        .generate()?
        .write_to_file("src/abi/teritori_vault.rs")?;

    Abigen::new("squad_staking", "abis/squad_staking.json")?
        .generate()?
        .write_to_file("src/abi/squad_staking.rs")?;

    Ok(())
}
