import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { setJwt } from '../Utils/Requests';
import { User } from '../Models/User';

interface AuthContextType {
    authenticated: boolean;
    user: User | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    setUser: (user: User | null) => void;
    loading: boolean;
}

interface Props {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<Props> = ({ children }) => {
    const [authenticated, setAuthenticated] = useState<boolean>(() => {
        return !!localStorage.getItem('token');
    });

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setAuthenticated(!!token);
        setJwt(token);

        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        setLoading(false);
    }, []);


    const login = (token: string, user: User) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setAuthenticated(true);
        setUser(user);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setAuthenticated(false);
        setUser(null);    
    };

    return (
        <AuthContext.Provider value={{ authenticated, user, login, logout, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};