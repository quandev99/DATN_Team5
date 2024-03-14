import { jwtDecode } from "jwt-decode";

export const getDecodedAccessToken = () => {
    const storedData = localStorage.getItem('accessToken');
    if (storedData) {
        const accessToken = JSON.parse(storedData);
        if (accessToken) {
            return jwtDecode(accessToken);
        }
    }
    return null;
};