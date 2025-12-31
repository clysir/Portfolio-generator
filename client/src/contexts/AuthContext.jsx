import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api';

/**
 * 认证上下文
 * 管理用户登录状态
 */
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(() => Boolean(localStorage.getItem('token')));

    // 初始化时检查 token
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        authAPI.getMe()
            .then(res => setUser(res.data))
            .catch(() => localStorage.removeItem('token'))
            .finally(() => setLoading(false));
    }, []);

    // 登录
    const login = async (email, password) => {
        const res = await authAPI.login({ email, password });
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        return res;
    };

    // 注册
    const register = async (username, email, password) => {
        const res = await authAPI.register({ username, email, password });
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        return res;
    };

    // 登出
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
