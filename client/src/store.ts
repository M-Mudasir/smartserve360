import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import loginReducer from './slices/loginSlice'
import { persistStore, persistReducer } from 'redux-persist';
// import thunk from 'redux-thunk';
import storage from 'redux-persist/lib/storage'; 


const persistConfig = {
  key: 'root',
  storage,
};
const persistedReducer = persistReducer(persistConfig, loginReducer);
export const store = configureStore({

  reducer: {
    login:   persistedReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
})

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default store;