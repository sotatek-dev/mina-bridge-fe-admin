import { UseToastOptions } from '@chakra-ui/react';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { TokenType } from './persistSlice';
import { NETWORK_KEY } from './walletSlice';

import { MODAL_NAME } from '@/configs/modal';
import { WALLET_NAME } from '@/models/wallet';

//  Modal controller
export enum TITLE {
  CONNECT_WALLET_SUCCESS = 'Wallet connected successfully',
  TRANSACTION_SUBMITTED = 'Transaction Submitted',
}

export type ModalCWErrorPayload = {
  walletName: WALLET_NAME;
};

export type ModalSNPayload = {
  networkKey: NETWORK_KEY;
  isValidate?: boolean;
};

export type ModalSuccessActionPayload = {
  title: TITLE;
  message?: string;
  isCloseBtn?: boolean;
};

export type ModalLoadingPayload = {
  titleLoading: string;
  message?: string;
};

export type ModalConfirmBridgePayload = {
  asset: TokenType;
  destAddr: string;
  amount: string;
  isNativeCurrency?: boolean;
  fee?: string;
  balance: string;
  onFinish: () => void;
  onError: () => void;
};

type PayloadModal =
  | ModalCWErrorPayload
  | ModalSNPayload
  | ModalSuccessActionPayload
  | ModalConfirmBridgePayload
  | ModalLoadingPayload;

export type ModalController = {
  isOpen: boolean;
  modalName: MODAL_NAME;
  reason?: string;
  payload?: PayloadModal;
};

//  Toast controller
export type ToastType = 'warning' | 'error' | 'info' | 'success';

export type ToastController = {
  id: number;
  isDisplay: boolean;
} & UseToastOptions;

// Banner controller

export enum BANNER_NAME {
  UNMATCHED_CHAIN_ID,
}

type BannerUnmatchedChainPayload = {
  chainId: string;
};

type BannerPayload = BannerUnmatchedChainPayload;

export type BannerController = {
  bannerName: BANNER_NAME;
  isDisplay: boolean;
  payload?: BannerPayload;
};

// state type
export type UIState = {
  isLoading: boolean;
  modals: Record<MODAL_NAME, ModalController>;
  toast: Record<ToastType, ToastController[]>;
  banners: Record<BANNER_NAME, BannerController>;
};

// payload type
export type OpenModalPayload = Omit<ModalController, 'isOpen'>;
export type CloseModalPayload = Omit<ModalController, 'isOpen' | 'reason'>;
export type SendNotificationPayload = {
  toastType: ToastType;
  options: UseToastOptions;
};
export type DisableNotificationPayload = Record<ToastType, number[]>;
export type OpenBannerPayload = Omit<BannerController, 'isDisplay'>;
export type CloseBannerPayload = Omit<
  BannerController,
  'isDisplay' | 'payload'
>;

// init state
export const initialToastState: UIState['toast'] = {
  warning: [],
  error: [],
  info: [],
  success: [],
};
const initialState: UIState = {
  isLoading: false,
  modals: {
    [MODAL_NAME.CONNECT_WALLET]: {
      isOpen: false,
      modalName: MODAL_NAME.CONNECT_WALLET,
    },
    [MODAL_NAME.CONNECT_WALLET_ERROR]: {
      isOpen: false,
      modalName: MODAL_NAME.CONNECT_WALLET_ERROR,
    },
    [MODAL_NAME.SELECT_NETWORK]: {
      isOpen: false,
      modalName: MODAL_NAME.SELECT_NETWORK,
    },
    [MODAL_NAME.SUCCESS_ACTION]: {
      isOpen: false,
      modalName: MODAL_NAME.SUCCESS_ACTION,
    },
    [MODAL_NAME.SELECT_TOKEN]: {
      isOpen: false,
      modalName: MODAL_NAME.SELECT_TOKEN,
    },
    [MODAL_NAME.CONFIRM_BRIDGE]: {
      isOpen: false,
      modalName: MODAL_NAME.CONFIRM_BRIDGE,
    },
    [MODAL_NAME.LOADING]: {
      isOpen: false,
      modalName: MODAL_NAME.LOADING,
    },
    [MODAL_NAME.LOADING_DEPLOY]: {
      isOpen: false,
      modalName: MODAL_NAME.LOADING_DEPLOY,
    },
  },
  toast: initialToastState,
  banners: {
    [BANNER_NAME.UNMATCHED_CHAIN_ID]: {
      isDisplay: false,
      bannerName: BANNER_NAME.UNMATCHED_CHAIN_ID,
    },
  },
};

// slice create
export const UISlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    startLoading: (state: UIState) => {
      state.isLoading = true;
    },
    endLoading: (state: UIState) => {
      state.isLoading = false;
    },
    openModal: (state: UIState, action: PayloadAction<OpenModalPayload>) => {
      state.modals[action.payload.modalName] = {
        isOpen: true,
        ...action.payload,
      };
    },
    closeModal: (state: UIState, action: PayloadAction<CloseModalPayload>) => {
      state.modals[action.payload.modalName].isOpen = false;
      state.modals[action.payload.modalName].payload = action.payload.payload;
    },
    sendNotification: (
      state: UIState,
      action: PayloadAction<SendNotificationPayload>
    ) => {
      const category = action.payload.toastType;
      const lastToast = state.toast[category][state.toast[category].length - 1];

      const newToast: ToastController = {
        ...action.payload.options,
        isDisplay: true,
        id: lastToast ? lastToast.id + 1 : 1,
      };

      state.toast[category] = [
        ...state.toast[action.payload.toastType],
        newToast,
      ];
    },
    disableNotification: (
      state: UIState,
      action: PayloadAction<DisableNotificationPayload>
    ) => {
      Object.entries(action.payload).forEach(([category, items]) => {
        const cate = category as ToastType;
        state.toast[cate].forEach((toast, index) => {
          if (items.includes(toast.id)) {
            state.toast[cate][index] = {
              ...state.toast[cate][index],
              isDisplay: false,
            };
          }
        });
      });
    },
    openBanner: (state: UIState, action: PayloadAction<OpenBannerPayload>) => {
      state.banners[action.payload.bannerName] = {
        ...action.payload,
        isDisplay: true,
      };
    },
    closeBanner: (
      state: UIState,
      action: PayloadAction<CloseBannerPayload>
    ) => {
      state.banners[action.payload.bannerName].isDisplay = false;
    },
  },
});

// normal flow action
export const uiSliceActions = { ...UISlice.actions };

// export
export default UISlice.reducer;
