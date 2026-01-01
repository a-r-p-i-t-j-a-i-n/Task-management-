import api from './api';

const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.user) {
        // localStorage.setItem('token', response.data.token); // Usually register doesn't auto-login or it does?
        // Based on backend: register returns { message, user }, NO token.
        // So user must login after register.
    }
    return response.data;
};

const login = async (userData) => {
    const response = await api.post('/auth/login', userData);
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
    }
    return response.data;
};

const getMe = async () => {
    const response = await api.get('/auth/me');
    return response.data.user;
}

const logout = () => {
    localStorage.removeItem('token');
};

const authService = {
    register,
    login,
    logout,
    getMe
};

export default authService;
