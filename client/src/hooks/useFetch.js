import { useState, useEffect } from 'react';
import { makeGetRequest } from '../configs/Axios';

const useFetch = (URL, FLAG) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await makeGetRequest(URL);
        setData(response.data.data);
      } catch (err) {
        setError(err);
      }
    };

    fetchData();
  }, [URL, FLAG]);

  return { data, error };
};

export default useFetch;
