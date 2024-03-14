// // authSlice.js
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { login,register } from "./apISignin";
// import { ISignin } from "../../interface/auth";

// const initialState = {
//   auth: null,
//   loading: false,
//   error: null,
// };

// // Define an async thunk for login
// export const loginAsync = createAsyncThunk(
//   "auth/login",
//   async (credentials:ISignin, { rejectWithValue }) => {
//     try {
//       const response = await login(credentials);
//       return response; // Assuming the API returns auth data on a successful login
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );
// export const registerAsync = createAsyncThunk(
//   "auth/register",
//   async (credentials: ISignin, { rejectWithValue }) => {
//     try {
//       const response = await register(credentials); // Gọi hàm đăng ký từ apISignin
//       return response; // Giả sử API trả về dữ liệu người dùng sau khi đăng ký thành công
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );
// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//    reducers: {
//       authLogout: (state) => {
//         state.auth = null;
//         state.error = null;
//       },
//     },
//   extraReducers: (builder) => {
//     builder
//       .addCase(loginAsync.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(loginAsync.fulfilled, (state, action) => {
//         state.auth = action.payload;
//         state.loading = false;
//         state.error = null;
//       })
//       .addCase(loginAsync.rejected, (state, action) => {
//         state.auth = null;
//         state.loading = false;
//         state.error = action.payload; // Set the error message from the rejected action
//       })
//       .addCase(registerAsync.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(registerAsync.fulfilled, (state, action) => {
//         state.auth = action.payload;
//         state.loading = false;
//         state.error = null;
//       })
//       .addCase(registerAsync.rejected, (state, action) => {
//         state.auth = null;
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });
// export  const {authLogout} = authSlice.actions
// export default authSlice.reducer;
