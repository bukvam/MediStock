import React, { createContext, useContext, useState } from 'react';

export const AuthContext = createContext<{
    isLoggedIn: boolean;
    logIn: () => void;
    logOut: () => void;
}>({
    isLoggedIn: false,
    logIn: () => {},
    logOut: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const logIn = () => setIsLoggedIn(true);
    const logOut = () => setIsLoggedIn(false);

    return (
        <AuthContext.Provider value={{ isLoggedIn, logIn, logOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
