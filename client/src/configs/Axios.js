import AXIOS from 'axios';

const Axios = AXIOS.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

Axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const makeApiRequest = async (method, url, data = {}) => {
  try {
    const isFormData = data instanceof FormData;
    const response = await Axios({
      method,
      url,
      data,
      headers: {
        'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
      },
    });
    return response;
  } catch (error) {
    return error.response;
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
