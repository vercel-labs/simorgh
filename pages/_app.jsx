import { SWRConfig } from 'swr';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { ToggleContextProvider } from '#contexts/ToggleContext';
import { ServiceContextProvider } from '#contexts/ServiceContext';
import getToggles from '#lib/config/toggles';

const cache = createCache({ key: 'next' });

const App = props => {
  const { Component, pageProps, router } = props;
  const { route } = router;
  const service = route.split('/')?.[1];
  const language =
    pageProps?.fallback?.['/api/news']?.metadata?.language || 'en-gb';

  // Purposely not using `getToggles` from `#lib/utilities/getToggles`
  // because it does a bunch of async logging, which means we'd need to use
  // `useEffect` or `getInitialProps` and that would disable SSR. The benefit
  // is not *that* important to warrant turning that off.
  //
  // import getToggles from '#lib/utilities/getToggles';
  // const toggles = await getToggles(service);

  const environment = process.env.SIMORGH_APP_ENV || 'local';
  const toggles = getToggles[environment];

  return (
    <CacheProvider value={cache}>
      <SWRConfig
        value={{
          fetcher: (resource, init) =>
            fetch(resource, init).then(res => res.json()),
        }}
      >
        <Head>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta charSet="utf-8" />
          <meta
            name="robots"
            content="noodp, noydir, max-image-preview:large"
          />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, minimum-scale=1"
          />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="twitter:card" content="summary_large_image" />
          <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        </Head>
        <ToggleContextProvider toggles={toggles}>
          <ServiceContextProvider service={service} pageLang={language}>
            <Component {...pageProps} />
          </ServiceContextProvider>
        </ToggleContextProvider>
      </SWRConfig>
    </CacheProvider>
  );
};

App.propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.oneOfType([PropTypes.object]),
};

App.defaultProps = {
  pageProps: {},
};

export default App;
