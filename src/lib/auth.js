import Cookies from 'js-cookie';

const TOKEN_KEY = 'fabp_token'; // Or pick your preferred cookie name

export const setToken = (token) => {
    // Expires in 7 days
    Cookies.set(TOKEN_KEY, token, { expires: 7 });
};

export const getToken = () => {
    return Cookies.get(TOKEN_KEY);
};

export const removeToken = () => {
    Cookies.remove(TOKEN_KEY);
};

export const isAuthenticated = () => {
    return !!getToken();
};