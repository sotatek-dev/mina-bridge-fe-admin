import { Button, Center, Container, Flex, Text } from '@chakra-ui/react';

import useNotifier from '@/hooks/useNotifier';
import {
  getUISlice,
  getWalletInstanceSlice,
  useAppDispatch,
  useAppSelector,
} from '@/store';
import { BANNER_NAME, uiSliceActions } from '@/store/slices/uiSlice';

export default function UnmatchedChain() {
  const dispatch = useAppDispatch();
  const { banners } = useAppSelector(getUISlice);
  const { networkInstance, walletInstance } = useAppSelector(
    getWalletInstanceSlice
  );
  const { sendNotification } = useNotifier();

  const curBanner = banners[BANNER_NAME.UNMATCHED_CHAIN_ID];

  async function changeNetwork() {
    if (!walletInstance || !networkInstance.src) return;
    dispatch(uiSliceActions.startLoading());
    const res = await walletInstance.switchNetwork(networkInstance.src);
    dispatch(uiSliceActions.endLoading());
    if (!res)
      sendNotification({
        toastType: 'error',
        options: {
          title: 'User rejected',
        },
      });
  }

  return walletInstance && curBanner.isDisplay && curBanner.payload ? (
    <Flex
      bg={'red.500'}
      minH={'50px'}
      py={'5px'}
      alignItems={'center'}
      position={'fixed'}
      top={'75px'}
      left={0}
      right={0}
      zIndex={100}
    >
      <Container
        maxW={{
          sm: 'container.sm',
          xl: 'container.xl',
        }}
      >
        <Center>
          <Text variant={'lg'} color={'white'}>
            {'dApp network doesn\'t match with network selected in wallet.'}
            <Button
              display={'inline-block'}
              verticalAlign={'baseline'}
              variant={'_blank'}
              onClick={changeNetwork}
              textDecoration={'underline'}
              color={'white'}
              fontWeight={'600'}
              ml={'4px'}
            >
              Change network
            </Button>
          </Text>
        </Center>
      </Container>
    </Flex>
  ) : null;
}
