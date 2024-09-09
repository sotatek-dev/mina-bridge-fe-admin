import { combineReducers } from '@reduxjs/toolkit';

import exampleSliceReducer from './exampleSlice';
import persistSlice from './persistSlice';
import uiSlice from './uiSlice';
import walletInstanceSlice from './walletInstanceSlice';
import walletObjSlice from './walletObjSlice';
import walletSlice from './walletSlice';

const rootReducer = combineReducers({
  persist: persistSlice,
  example: exampleSliceReducer,
  ui: uiSlice,
  wallet: walletSlice,
  walletObj: walletObjSlice,
  walletInstance: walletInstanceSlice,
});

export default rootReducer;
