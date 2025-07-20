import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const UserRoutes = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (user === null || user.isAdmin) {
            navigate('/login');
        }
    }, [user, navigate]);

    if (user === null || user.isAdmin) {
        return null;
    }

    return <Outlet />;
};

export default UserRoutes;
