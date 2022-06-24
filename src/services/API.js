import axios from "axios";

const backendURL = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_DEV_BACKEND_URL : process.env.REACT_APP_PROD_BACKEND_URL;

export default axios.create({
  baseURL: backendURL
});