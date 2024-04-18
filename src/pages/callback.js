import React, { useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const OAuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Updated to useNavigate
  const clientId = 'Ca12dd0aae966e5384919e2489ff628259b54ed0760c6a6257af561c7a20bd462';
  const clientSecret = 'a7aabff245890df3dbf7368968bd35f3aa553b6b3c9283ddb028cb05e0c43e35';
  const redirectUri = 'http://localhost:3000/oauth2/callback';

  useEffect(() => {
    // Define exchangeCodeForToken inside useEffect if it doesn't depend on props or state outside useEffect's scope
    const exchangeCodeForToken = async (code) => {
      try {
        // eslint-disable-next-line no-unused-vars
        const response = await axios.post('https://webexapis.com/v1/access_token', {
          grant_type: 'authorization_code',
          client_id: clientId,
          client_secret: clientSecret,
          code: code,
          redirect_uri: redirectUri,
        });

        
        // Store the access token in local storage / context / state
        // Redirect user to another part of your application
        navigate('/dashboard'); // Updated to use navigate
      } catch (error) {
        console.error('Error exchanging code for token', error);
        // Handle error
      }
    };

    const code = new URLSearchParams(location.search).get('code');
    if (code) {
      exchangeCodeForToken(code);
    }
  }, [location, navigate, clientId, clientSecret, redirectUri]); // Updated dependencies

  return <div>OAuth callback page...</div>;
};

export default OAuthCallback;
