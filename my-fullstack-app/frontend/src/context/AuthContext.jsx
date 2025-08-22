import React, { createContext } from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    let serverUrl = "http://localhost:8000";

    let value = {
        serverUrl
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
