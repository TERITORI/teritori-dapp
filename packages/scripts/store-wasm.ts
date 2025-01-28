import { program } from "commander";
import { DeployOpts, storeWASM } from "./network-setup/deployLib"
import { getCosmosNetwork } from "@/networks";
import process from "process"

const main = async () => {
    program.argument("<network-id>", "ID of network to store the contract on");
    program.argument("<wallet-name>", "Name of the wallet to use");
    program.argument("<wasm-path>", "Path to the WASM file")
    program.parse();
    const [networkId, walletName, wasmPath] = program.args as [string, string, string];
    const network = getCosmosNetwork(networkId)
    if (!network) {
        console.error("Invalid network id")
        process.exit(1)
    }
    const opts: DeployOpts = {
        home: "~/.teritorid",
        binaryPath: "teritorid"
    }
    const codeId = await storeWASM(opts, walletName, network, wasmPath)
    console.log(codeId)
}

main()