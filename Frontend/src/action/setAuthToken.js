import axios from "axios";

const setAuthToken = (token) => {
  axios.defaults.headers.common["Authorization"] = token;
};

export default setAuthToken;
