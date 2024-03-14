
export const checkAndRemoveExpiredData = () => {
    const storedData = localStorage.getItem('accessToken');
    if (storedData) {
        const parsedData = JSON.parse(storedData);
        const expirationTime = parsedData.expirationTime;
        const currentTime = new Date().getTime();
        if (currentTime >= expirationTime) {
            console.log('Dữ liệu đã hết hạn');
            localStorage.removeItem('accessToken');
            window.location.reload();
        }
    }
};