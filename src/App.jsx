import { RouterProvider, Routes, Route, Router, BrowserRouter, Navigate } from 'react-router-dom';

// project import
import ThemeCustomization from 'themes';

import ScrollTop from 'components/ScrollTop';
import MinimalLayout from 'layout/MinimalLayout';
import Login from 'pages/authentication/login';
import DashboardLayout from 'layout/Dashboard';

import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';
import { lazy, createContext, useContext, useState, useEffect, Suspense } from 'react';
import Register from 'pages/authentication/register';
import DashboardMatcher from 'pages/matcher-dashboard';
import AuthProvider from 'components/auth0provider';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import { Button } from '@mui/material';


const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const ProfileDetails = Loadable(lazy(() => import('pages/profiles/profile-details')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));

// render - login
const AuthLogin = Loadable(lazy(() => import('pages/authentication/login')));
const AuthRegister = Loadable(lazy(() => import('pages/authentication/register')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));


// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

export default function App() {


  const { isLoading, error, isAuthenticated, user, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    getToken();
  }, [isLoading, isAuthenticated])

  const getToken = async () => {
    const token = await getAccessTokenSilently();
    localStorage.setItem('token', token)
  }


  return (
    <>
      {isLoading ? <div>Loading...</div>
        :
        <ThemeCustomization>
          <ScrollTop>
            {/* <RouterProvider router={router} /> */}
            <Suspense fallback={<div className="center">Loading</div>}>
              <BrowserRouter>
                <Routes>
                  <Route element={<MinimalLayout />}>
                    <Route path='/login' element={(!isLoading && isAuthenticated) ? <Navigate to="/" /> : <Login />} />
                    <Route path='/register' element={< Register />} />
                    <Route path='*' element={<SamplePage />} />
                  </Route>

                  {/* <Route element={(!isLoading && isAuthenticated) ? <DashboardLayout /> : <Navigate to="/login" />}> */}
                  <Route element={<DashboardLayout />}>
                    <Route path='/' element={(!isLoading && isAuthenticated) ? <DashboardMatcher /> : <Navigate to="/login" />} />
                    <Route path='/my_profile' element={<ProfileDetails currentUser={user} />} />
                    <Route path='/profile/details' element={<ProfileDetails />} />
                  </Route>
                </Routes>
              </BrowserRouter >
            </Suspense>
          </ScrollTop >
        </ThemeCustomization >
      }
    </>
  );
}