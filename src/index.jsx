import React from 'react';
import ReactDOM from 'react-dom/client';

// scroll bar
import 'simplebar-react/dist/simplebar.min.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// google-fonts
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/700.css';

import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';

import '@fontsource/public-sans/400.css';
import '@fontsource/public-sans/500.css';
import '@fontsource/public-sans/600.css';
import '@fontsource/public-sans/700.css';

// project import
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Auth0Provider } from '@auth0/auth0-react';
// import history from 'utils/history';
const root = ReactDOM.createRoot(document.getElementById('root'));



// ==============================|| MAIN - REACT DOM RENDER ||============================== //

const onRedirectCallback = (appState) => {
    // history.push(
    //     appState && appState.returnTo ? appState.returnTo : window.location.pathname
    // );

};
const providerConfig = {
    domain: "dev-matcher.us.auth0.com",
    clientId: "ElYbgNgv8swQ0cKUCv0QuFFWAA8uh4VK",
    onRedirectCallback,
    authorizationParams: {
        redirect_uri: window.location.origin,
        audience: "matcher",
        scope: "openid profile email"
    },
};

root.render(
    <Auth0Provider
        {...providerConfig}>
        <App />
    </Auth0Provider>


);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
