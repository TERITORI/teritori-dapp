import { BrandText } from "@/components/BrandText";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { ScreenContainer } from "@/components/ScreenContainer";
import { useWallets } from "@/context/WalletsProvider";
import { CwAtomicSwapClient } from "@/contracts-clients/cw-atomic-swap";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { NetworkKind } from "@/networks";
import { gnoDevNetwork } from "@/networks/gno-dev";
import { getKeplrSigningCosmWasmClient } from "@/networks/signer";
import { teritoriTestnetNetwork } from "@/networks/teritori-testnet";
import { adenaVMCall, extractGnoNumber, extractGnoString } from "@/utils/gno";
import { ScreenFC } from "@/utils/navigation";
import { fontNormal15 } from "@/utils/style/fonts";
import { sha256 } from "@cosmjs/crypto";
import { toHex } from "@cosmjs/encoding";
import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { useState } from "react";

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const srcNetwork = teritoriTestnetNetwork
const srcDenom = "utori"
const dstSymbol = "WTORI"
const dstNetwork = gnoDevNetwork
const cosmosBridgeAddress = "tori1mahnhl3qmtjg5j8csufsttaxn6vac86ph3ad8k"
const gnoBridgeAddress = "g18pepv9zu8mr26rc7d3y8uvm5ngqzd53tlpamy2"
const cosmwasmContractAddress = "tori19uugrh26v6g9cdsh7uc09ypcd5e5s30vnahdf0uez2s96q6dyz7s64hjwf"
const gnoSwapPkgPath = "gno.land/r/demo/atomicswap"
// const cosmwasmCodeId = 85

export const AtomicBridgeScreen: ScreenFC<"AtomicBridge"> = () => {
  const selectedWallet = useSelectedWallet()
  const { wallets } = useWallets()

  const [state, setState] = useState("")

  const bridge = async (amount: BigInt) => {
    try {
      if (!selectedWallet || selectedWallet.networkId !== srcNetwork.id) {
        throw new Error("invalid wallet")
      }

      // params
      // gen secret: TODO
      const secret = "__this_is_unsecure__"
      const hashlock = toHex(sha256(new TextEncoder().encode(secret)))
      const networkId = selectedWallet.networkId
      const timelock = Math.ceil(Date.now() / 1000) + (60 * 60) // 1 hour

      // find gno wallet
      const gnoWallet = wallets.find((w) => w.connected && w.networkKind === NetworkKind.Gno)
      if (!gnoWallet) {
        throw new Error("no connected gno wallet found")
      }

      setState(`Creating proposal ${hashlock}...`)

      // create proposal
      // TODO: pass redeem address in contract
      const cosmwasmSigningClient = await getKeplrSigningCosmWasmClient(networkId)
      const client = new CwAtomicSwapClient(cosmwasmSigningClient, selectedWallet.address, cosmwasmContractAddress)
      await client.create({ hashlock, timelock, destination: cosmosBridgeAddress, hint: gnoWallet.address }, "auto", undefined,
        [{ denom: srcDenom, amount: amount.toString() }],
      )

      setState("Finding counterpart...")

      // scan gno chain for counterpart
      const amountStr = `${amount.toString()}${dstSymbol}`
      const gnoClient = new GnoJSONRPCProvider(dstNetwork.endpoint)
      let id
      while (true) {
        const afterSec = Math.ceil(Date.now() / 1000) + (60 * 30) // timelock must expire after 30 minutes
        const expr = `findSwap("${hashlock}", "${gnoBridgeAddress}", "${gnoWallet.address}", "${amountStr}", ${afterSec})`
        console.log(expr)
        id = extractGnoString(await gnoClient.evaluateExpression(gnoSwapPkgPath, expr))
        if (id != "") {
          break
        }
        await sleep(2000)
      }

      setState(`Claiming counterpart ${id}...`)

      // redeem on gno
      await adenaVMCall(dstNetwork.id, {
        caller: gnoWallet.address,
        pkg_path: gnoSwapPkgPath,
        func: "Claim",
        args: [id.toString(), secret],
        send: "",
      })

      setState("Done")
    } catch (err) {
      setState(`${err}`)
    }
  }

  return (
    <ScreenContainer fullWidth>
      <BrandText>AtomicBridge</BrandText>
      <PrimaryButton text="Run" onPress={() => bridge(BigInt(42))}></PrimaryButton>
      <BrandText style={fontNormal15}>{state}</BrandText>
    </ScreenContainer>
  );
};
