import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { handleRequest } from '@/helpers/asyncHandlers';
import exampleService from '@/services/exampleService';

// state type
export type ExampleState = {
  keyName: string;
};

// payload type
export type UpdateExampleSlice = {
  newValue: string;
};

// init state
const initialState: ExampleState = {
  keyName: 'example',
};

// thunk action
const asyncExample = createAsyncThunk(
  'example/asyncAction',
  async (arg: any) => {
    const [res, error] = await handleRequest(
      exampleService.getTradingHistory({ name: 'hello' })
    );
    if (error) return 'error';
    return 'success';
  }
);

// slice create
export const ExampleSlice = createSlice({
  name: 'example',
  initialState,
  reducers: {
    updateExampleSlice: (
      state: ExampleState,
      action: PayloadAction<UpdateExampleSlice>
    ) => {
      state.keyName = action.payload.newValue;
    },
  },
  extraReducers(builder) {
    builder.addCase(asyncExample.fulfilled, (state, action) => {
      state.keyName = action.payload;
    });
  },
});

// normal flow action
export const exampleSliceActions = { ...ExampleSlice.actions, asyncExample };

// export
export default ExampleSlice.reducer;
