import { WALLET_NAME } from "./wallet.abstract";
import WalletAuro from "./wallet.auro";
import WalletMetamask from "./wallet.metamask";

import { IsServer } from "@/constants";

export type Wallet = WalletMetamask | WalletAuro;

const WALLETS: Record<WALLET_NAME, Wallet | undefined> = {
  [WALLET_NAME.METAMASK]: !IsServer ? new WalletMetamask() : undefined,
  [WALLET_NAME.AURO]: !IsServer ? new WalletAuro() : undefined,
};

export { WALLET_NAME } from './wallet.abstract';
export { default as WalletAuro } from './wallet.auro';
export { default as WalletMetamask } from './wallet.metamask';
export default WALLETS;
