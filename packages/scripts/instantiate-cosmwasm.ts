import { program } from "commander";
import { DeployOpts, instantiateContract, storeWASM } from "./network-setup/deployLib"
import { getCosmosNetwork } from "@/networks";
import process from "process"
import { safeParseJSON } from "@/utils/sanitize";

const main = async () => {
    program.argument("<network-id>", "ID of network to store the contract on");
    program.argument("<wallet-name>", "Name of the wallet to use");
    program.argument("<code-id>", "Code ID of the WASM to instantiate");
    program.argument("<admin>", "Admin address");
    program.argument("<label>", "Label");
    program.argument("<msg>", "JSON message");
    program.parse();
    const [networkId, walletName, codeId, admin, label, msg] = program.args as [string, string, string, string, string, string];
    const network = getCosmosNetwork(networkId)
    if (!network) {
        console.error("Invalid network id")
        process.exit(1)
    }
    const opts: DeployOpts = {
        home: "~/.teritorid",
        binaryPath: "teritorid"
    }
    const contractAddress = await instantiateContract(opts, walletName, network, parseInt(codeId, 10), admin, label, safeParseJSON(msg))
    console.log(contractAddress)
}

main()