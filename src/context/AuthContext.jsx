import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAdminByIdApi } from '../apis/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {

    const savedUser = localStorage.getItem('_mountview_user_');
    const [user, setUser] = useState(null);
    const [localUser, setLocalUser] = useState(savedUser ? JSON.parse(savedUser) : null);
    const [isUpdated, setIsUpdated] = useState(false);

    const getAdminById = async (userId) => {
        try {
            const response = await getAdminByIdApi(userId);
            const userData = response.data.adminDetail;
            setUser(userData);
        } catch (error) {
            console.error('Failed to fetch user:', error);
        }
    };

    useEffect(() => {
        if (localUser?._id) {
            getAdminById(localUser._id);
        }
    }, [localUser, isUpdated]);

    return (
        <AuthContext.Provider value={{ user, setUser, setLocalUser, setIsUpdated, isUpdated }}>
            {children}
        </AuthContext.Provider>
    );
};
