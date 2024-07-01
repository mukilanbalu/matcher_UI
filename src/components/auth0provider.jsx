import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';


const AuthProvider = ({ childern }) => {
    <Auth0Provider
        domain="dev-matcher.us.auth0.com"
        clientId="ElYbgNgv8swQ0cKUCv0QuFFWAA8uh4VK"
        authorizationParams={{
            redirect_uri: "http://localhost:3000/login"
        }}
    >
        {childern}

    </Auth0Provider>
}

export default AuthProvider;
