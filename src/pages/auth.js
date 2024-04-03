import React from 'react';

const clientId = 'Ca12dd0aae966e5384919e2489ff628259b54ed0760c6a6257af561c7a20bd462';
const redirectUri = 'http://localhost:3000/oauth2/callback';
const oauthUrl = `https://webexapis.com/v1/authorize?client_id=${{clientId}}&response_type=code&redirect_uri=${{redirectUri}}&scope=cloud-contact-center%3Apod_conv%20spark%3Akms%20cjp%3Auser%20spark%3Apeople_read%20cjp%3Aconfig_write%20cjp%3Aconfig%20cjp%3Aconfig_read%20cjds%3Aadmin_org_read%20cjds%3Aadmin_org_write&state=set_state_here`;

const OAuthLogin = () => {
  return (
    <div>
      <a href={oauthUrl}>Login with WXCC</a>
    </div>
  );
};

export default OAuthLogin;
