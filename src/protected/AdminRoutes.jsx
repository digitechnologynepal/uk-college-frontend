import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const AdminRoutes = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('_mountview_user_'));

    useEffect(() => {
        if (user === null || user.role === 'user') {
            navigate('/login');
        }
    }, [user, navigate]);

    if (user === null || user.role === 'user') {
        return null;
    }

    return <Outlet />;
};

export default AdminRoutes;
