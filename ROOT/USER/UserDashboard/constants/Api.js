import Constants from 'expo-constants';

const PORT = '8080';

const getBaseUrl = () => {
  if (typeof window !== 'undefined' && window.location?.hostname) {
    return `http://${window.location.hostname}:${PORT}/api`;
  }
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    return `http://${ip}:${PORT}/api`;
  }
  return `http://localhost:${PORT}/api`;
};

export const API_BASE_URL = getBaseUrl();

export default { API_BASE_URL };
