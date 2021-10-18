import React from 'react';
import { withKnobs, boolean } from '@storybook/addon-knobs';
import { BrowserRouter } from 'react-router-dom';
import WithTimeMachine from '#testHelpers/withTimeMachine';

import StoryPage from './StoryPage';
import mundoPageData from './fixtureData/mundo';
import persianPageData from './fixtureData/persian';
import russianPageData from './fixtureData/russian';
import { STORY_PAGE } from '#app/routes/utils/pageTypes';

import { ServiceContextProvider } from '#contexts/ServiceContext';
import { ToggleContext } from '#contexts/ToggleContext';
import { RequestContextProvider } from '#contexts/RequestContext';
import { UserContextProvider } from '#contexts/UserContext';
import withPageWrapper from '#containers/PageHandlers/withPageWrapper';

const Page = withPageWrapper(StoryPage);

const withSecondaryColumnsKnob = pageData => storyFn => {
  const showTopStories = boolean('Show Top Stories', true);
  const showFeaturedStories = boolean('Show Featured Stories', true);

  const secondaryColumn = {
    ...(showTopStories && {
      topStories: pageData.secondaryColumn.features,
    }),
    ...(showFeaturedStories && {
      features: pageData.secondaryColumn.features,
    }),
  };

  const storyProps = {
    pageData: {
      ...pageData,
      secondaryColumn,
    },
  };
  return storyFn(storyProps);
};

const toggleState = {
  podcastPromo: {
    enabled: true,
  },
};

// eslint-disable-next-line react/prop-types
const Component = ({ pageData, service }) => (
  <BrowserRouter>
    <ToggleContext.Provider value={{ toggleState, toggleDispatch: () => {} }}>
      <ServiceContextProvider service={service}>
        <UserContextProvider>
          <RequestContextProvider
            isAmp={false}
            service={service}
            pageType="STY"
            bbcOrigin="https://www.test.bbc.com"
          >
            <Page
              pageType={STORY_PAGE}
              isAmp={false}
              pathname="/path"
              status={200}
              pageData={pageData}
              service={service}
              mostReadEndpointOverride="./data/mundo/mostRead/index.json"
            />
          </RequestContextProvider>
        </UserContextProvider>
      </ServiceContextProvider>
    </ToggleContext.Provider>
  </BrowserRouter>
);

export default {
  Component,
  title: 'Pages/Story Page',
  decorators: [
    withKnobs,
    story => <WithTimeMachine>{story()}</WithTimeMachine>,
  ],
};

export const Mundo = props => (
  <Component service="mundo" pageData={mundoPageData} {...props} />
);

Mundo.decorators = [withSecondaryColumnsKnob(mundoPageData)];

export const Persian = props => (
  <Component service="persian" pageData={persianPageData} {...props} />
);

Persian.decorators = [withSecondaryColumnsKnob(persianPageData)];

export const Russian = props => (
  <Component service="russian" pageData={russianPageData} {...props} />
);

Russian.decorators = [withSecondaryColumnsKnob(russianPageData)];
