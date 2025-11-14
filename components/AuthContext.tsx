
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (password: string, adminToken?: string) => boolean;
    logout: () => void;
    adminToken: string | null;
    setAdminToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_TOKEN_KEY = 'adminToken';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [adminToken, setAdminTokenState] = useState<string | null>(() => {
        try {
            return localStorage.getItem(ADMIN_TOKEN_KEY);
        } catch (e) {
            return null;
        }
    });

    useEffect(() => {
        try {
            if (adminToken) localStorage.setItem(ADMIN_TOKEN_KEY, adminToken);
            else localStorage.removeItem(ADMIN_TOKEN_KEY);
        } catch (e) {
            // ignore
        }
    }, [adminToken]);

    const setAdminToken = (token: string | null) => {
        setAdminTokenState(token);
    };

    // In a real app, you'd have more complex logic, maybe involving a backend API
    const login = (password: string, token?: string) => {
        // Mock authentication: password is '1234'
        if (password === '1234') {
            setIsAuthenticated(true);
            if (token) setAdminToken(token);
            return true;
        }
        return false;
    };

    const logout = () => {
        setIsAuthenticated(false);
        setAdminToken(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, adminToken, setAdminToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
