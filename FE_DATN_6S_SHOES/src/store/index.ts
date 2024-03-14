import { configureStore, ThunkAction, Action, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import cartApi, { CartReducer } from "../api/cart";

import colorApi, { colorReducer } from "../api/color";
import reviewApi, { reviewReducer } from "../api/review";
import sizeApi, { sizeReducer } from "../api/size";
import brandApi, { brandReducer } from "../api/brand";
import productApi, { productReducer } from "../api/product";
import categoryApi, { categoryReducer } from "../api/category";
import imageApi, { imageReducer } from "../api/upload";
import newApi, { newReducer } from "../api/new";

import userApi, { userReducer } from "../api/user";
import couponApi, { couponReducer } from "../api/coupon";
import authApi, { authReducer } from "../api/auth";

import favoriteApi, { favoriteReducer } from "../api/favorite";
import roleApi, { roleReducer } from "../api/role";
import paymentMethodApi, { paymentMethodReducer } from "../api/paymentMethod";
import billApi, { billReducer } from "../api/bill";
import dstatusApi, { DstatusReducer } from "../api/deliveryStatus";
import paymentApi, { paymentReducer } from "../api/payment";
import bannerApi, { bannerReducer } from "../api/banner";
import statisticApi, { statisticReducer } from "../api/statistic";

const persistConfig = {
  key: "root",
  storage,
  whitelist: [""],
};

const rootReducer = combineReducers({
  carts: CartReducer,
  colors: colorReducer,
  news: newReducer,
  sizes: sizeReducer,
  brands: brandReducer,
  categories: categoryReducer,
  products: productReducer,
  images: imageReducer,
  users: userReducer,
  coupons: couponReducer,
  auths: authReducer,
  favorites: favoriteReducer,
  roles: roleReducer,
  paymentMethods: paymentMethodReducer,
  bills: billReducer,
  reviews: reviewReducer,
  DStatuss: DstatusReducer,
  payments: paymentReducer,
  banners: bannerReducer,
  new: newReducer,
  statistics: statisticReducer,
});

const attinalMiddleware = [
  cartApi.middleware,
  colorApi.middleware,
  reviewApi.middleware,
  sizeApi.middleware,
  brandApi.middleware,
  productApi.middleware,
  categoryApi.middleware,
  imageApi.middleware,
  userApi.middleware,
  couponApi.middleware,
  authApi.middleware,
  favoriteApi.middleware,
  newApi.middleware,
  roleApi.middleware,
  paymentMethodApi.middleware,
  billApi.middleware,
  dstatusApi.middleware,
  paymentApi.middleware,
  bannerApi.middleware,
  newApi.middleware,
  statisticApi.middleware,
];

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(...attinalMiddleware),
});
const persistor = persistStore(store);
export default persistor;

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
