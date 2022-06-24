import { useState, useEffect } from "react";
import axios from "axios";

const backendURL = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_DEV_BACKEND_URL : process.env.REACT_APP_PROD_BACKEND_URL;

const API = axios.create({ baseURL: backendURL });

const useAxios = (initialEndPoint, initialOptions={}) => {
  const [endPoint, updateEndpoint] = useState(initialEndPoint)
  const [options, updateOptions] = useState(initialOptions)
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [refetchCount, setRefectCount] = useState(0)

  const refetch = () => {
    setRefectCount(oldCount => oldCount + 1);
  };

  useEffect(() => {
    setIsLoading(true);
    try {
      API(endPoint, options).then(res => {
        if (res.statusText === "OK") {
          setData(res.data)
        } else {
          setIsError(true)
          setErrorMsg(res.data)
        }
        setIsLoading(false)
      });
    } catch (err) {
      setIsError(true);
      setErrorMsg(err.message);
      setIsLoading(false)
    }
  }, [endPoint, options, refetchCount]);

  return { data, isLoading, isError, errorMsg, refetch, updateEndpoint, updateOptions }
};

export default useAxios;