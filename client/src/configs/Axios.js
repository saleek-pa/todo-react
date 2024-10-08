import AXIOS from 'axios';

const Axios = AXIOS.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const makeApiRequest = async (method, url, data = {}) => {
  try {
    return await Axios({ method, url, data });
  } catch (err) {
    return err;
  }
};

const makeGetRequest = (URL) => {
  return makeApiRequest('get', URL);
};

const makePostRequest = (URL, DATA) => {
  return makeApiRequest('post', URL, DATA);
};

const makePutRequest = (URL, DATA) => {
  return makeApiRequest('put', URL, DATA);
};

const makePatchRequest = (URL) => {
  return makeApiRequest('patch', URL);
};

const makeDeleteRequest = (URL) => {
  return makeApiRequest('delete', URL);
};

export {
  makeApiRequest,
  makeGetRequest,
  makePostRequest,
  makePutRequest,
  makePatchRequest,
  makeDeleteRequest,
};
