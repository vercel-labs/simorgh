import fetchData from '../utils/fetchData';
import getBaseUrl from '../utils/getBaseUrl';
import onClient from '../../../lib/utilities/onClient';

const getMediaPageInitialData = props => {
  const { service, serviceId, mediaId } = props;

  const baseUrl = onClient()
    ? getBaseUrl(window.location.origin)
    : process.env.SIMORGH_BASE_URL;

  const url = `${baseUrl}/${service}/${serviceId}/${mediaId}.json`;

  return fetchData({ url });
};

export default getMediaPageInitialData;
