import React from 'react';
import App from 'next/app';
// import Head from 'next/head';
import Router from 'next/router';
import { Auth0Provider } from '@auth0/auth0-react';
// import { Nav } from '../components/Nav';

// import '../components/App.css';

const onRedirectCallback = (appState) => {
  Router.replace(appState?.returnTo || '/');
};

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <Auth0Provider
        // domain={process.env.NEXT_PUBLIC_DOMAIN}
        // clientId={process.env.NEXT_PUBLIC_CLIENT_ID}
        // audience={process.env.NEXT_PUBLIC_AUDIENCE}
        domain="confettilabs.eu.auth0.com"
        clientId="6v1inCnsiBF596O4wC6OI20J3QGeIqi6"
        // scope="read:users"
        redirectUri={typeof window !== 'undefined' && window.location.origin}
        onRedirectCallback={onRedirectCallback}
      >
        {/* <Head>
        </Head> */}
        {/* <Nav /> */}
        <Component {...pageProps} />
      </Auth0Provider>
    );
  }
}

export default MyApp;
