import { LOGIN_SUCCESS, LOG_OUT, USER_LOADED, AUTH_LOADING } from "../action/types";

export const initialState = {
  isAuthenticated: false,
  isAuthLoading: true,
  user: null
}

const authReducer = function (state = initialState, action) {
  switch (action.type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
      };
    case LOGIN_SUCCESS:
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        isAuthenticated: true,
      };
    case LOG_OUT:
      localStorage.removeItem("token");
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    case AUTH_LOADING:
      return{
        ...state,
        isAuthLoading: action.payload
      };
    default:
      return state;
  }

}

export default authReducer;