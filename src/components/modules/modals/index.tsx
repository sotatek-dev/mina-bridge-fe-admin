import ModalConnectWallet from './components/modalConnectWallet';
import ModalConnectWalletError from './components/modalConnectWalletError';
import ModalLoading from './components/modalLoading';
import ModalLoadingDeploy from './components/modalLoadingDeploy';
import ModalSelectNetwork from './components/modalSelectNetwork';
import ModalSuccessAction from './components/modalSuccessAction';

type Props = {};

export default function Modals({}: Props) {
  return (
    <>
      <ModalConnectWallet />
      <ModalConnectWalletError />
      <ModalSelectNetwork />
      <ModalSuccessAction />
      <ModalLoading />
      <ModalLoadingDeploy />
    </>
  );
}
