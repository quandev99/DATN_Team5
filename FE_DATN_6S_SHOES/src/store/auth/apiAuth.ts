// // authAPI.js
// import axios from "axios";
// import { IAuth } from "../../interface/auth";

// const API_URL = "http://localhost:8080/api";

// export const login = async (credentials: IAuth) => {
//   try {
//     const response = await axios.post(`${API_URL}/auth/signin`, credentials);
//     return response.data; // Assuming your API returns user data on successful login
//   } catch (error) {
//     console.log("error", error);
//     throw error?.response?.data; // Assuming your API returns an error message
//   }
// };
// export const register = async (registrationData: IAuth) => {
//   try {
//     const response = await axios.post(`${API_URL}/auth/signup`, registrationData);
//     return response.data;
//   } catch (error) {
//     console.error("Lỗi đăng ký:", error);
//     throw error?.response?.data;
//   }
// }
