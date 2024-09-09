import {
  configureStore,
  createAsyncThunk,
  createSlice,
  CreateSliceOptions,
  SliceCaseReducers,
  SliceSelectors,
} from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { persistReducer, persistStore } from 'redux-persist';
import { PersistPartial } from 'redux-persist/es/persistReducer';
import storage from 'redux-persist/lib/storage';

import rootReducer from './slices';


export type RootState = ReturnType<typeof rootReducer>;

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  blacklist: ['ui', 'walletObj', 'walletInstance'],
};

export const store = configureStore<RootState & PersistPartial>({
  reducer: persistReducer(persistConfig, rootReducer),
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware({
      // serializableCheck: {
      //   ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      // },
      serializableCheck: false,
    });
  },
  devTools: process.env.NEXT_PUBLIC_ENV !== 'production',
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;

export function createAppThunk<E>() {
  return createAsyncThunk.withTypes<{
    state: RootState;
    dispatch: AppDispatch;
    rejectValue: E;
    extra?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
  }>();
}

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const getPersistSlice = (state: RootState) => state.persist;
export const getExampleState = (state: RootState) => state.example;
export const getUISlice = (state: RootState) => state.ui;
export const getWalletSlice = (state: RootState) => state.wallet;
export const getWalletObjSlice = (state: RootState) => state.walletObj;
export const getWalletInstanceSlice = (state: RootState) =>
  state.walletInstance;
