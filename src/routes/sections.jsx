import axios from 'axios';
import { lazy, Suspense, useState, useEffect } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

export const IndexPage = lazy(() => import('src/pages/app'));
export const UserPage = lazy(() => import('src/pages/user'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

export default function Router() {
  const [tokenVerified, setTokenVerified] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token')
    const validateToken = async () => {
      try {
        const response = await axios.post('http://localhost:3002/tokenverify', null, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        console.log('response', response)
        if (response.status === 200) {
          return setTokenVerified(true)
        }
        return setTokenVerified(false)
      } catch (error) {
        console.log('error ', error)
        return setTokenVerified(false)
      }
    }
    validateToken()
  }, [])

  const routes = useRoutes([
    {
      element: tokenVerified ? (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ) : (
        <LoginPage />
      ),
      children: [
        { element: <IndexPage />, index: true },
        { path: 'user', element: <UserPage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
