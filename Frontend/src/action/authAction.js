import axios from 'axios';
import { toast } from 'react-toastify';
import { LOGIN_SUCCESS, USER_LOADED, LOG_OUT, AUTH_LOADING } from './types';
import setAuthToken from "./setAuthToken"

export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  try {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/`);
    if (res.status === 200) {
      dispatch({
        type: USER_LOADED,
        payload: res.data.user,
      });
    }
  } catch (err) {
    dispatch(logout());
  }
  dispatch({
    type: AUTH_LOADING,
    payload: false
  });
};

export async function getGoogleUserToken(codeResponse) {
  console.log(codeResponse)
  var response = await fetch(`${process.env.REACT_APP_API_URL}/auth/google_login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code: codeResponse.code }),
  });

  return await response.json();
}

export const login = (userData, navigate) => async (dispatch) => {
  try {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/signin/`, userData);
    if (res.status === 200) {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });
      dispatch(loadUser());
      toast.success("User logged in successfully");
      navigate("/dashboard");
    }
  } catch (err) {
    toast.error(err.response.data.message || "Something went wrong");
  }
};

export const register = (userData, navigate) => async (dispatch) => {
  console.log(userData)
  try {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/signup/`, userData);
    if (res.status === 200) {
      toast.success("User registered successfully");
      navigate("/auth/signin");
    }
  } catch (err) {
    toast.error(err.response.data.message || "Something went wrong");
  }
};

export const logout = () => (dispatch) => {
  dispatch({ type: LOG_OUT });
};
