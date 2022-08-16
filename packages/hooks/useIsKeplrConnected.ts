import { WalletProvider } from "../utils/walletProvider";
import {useWallets} from "../context/WalletsProvider"

// Check if the user's wallets contain a Keplr wallet
export const useIsKeplrConnected = (): boolean => {
		const { wallets } = useWallets();
		return !!wallets.find(wallet => wallet.provider === WalletProvider.Keplr && wallet.connected)
}