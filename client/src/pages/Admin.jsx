import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useAdminAuth } from '../context/AdminAuthContext';
import AdminLogin from '../components/admin/AdminLogin';
import AdminDashboard from '../components/admin/AdminDashboard';

export default function Admin() {
  const { isAuthenticated } = useAdminAuth();

  return (
    <>
      <Helmet>
        <title>Atelier Administration // QUIET BATTLES™</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      {isAuthenticated ? <AdminDashboard /> : <AdminLogin />}
    </>
  );
}

