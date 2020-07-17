import * as actionTypes from '../actions/actionTypes';

const initialState = {
  token: null,
  userId: null,
  error: null,
  loading: false,
  redirectPath: "/"
};

const authStart = (state) => {
  return {
    ...state,
    error: null,
    loading: true,
  }
}

const authSuccess = (state, action) => {
  const { token, userId } = action;
  return {
    ...state,
    token,
    userId,
    loading: false
  }
}

const authFail = (state, action) => {
  return {
    ...state,
    loading: false,
    error: action.error
  }
}

const authLogout = (state) => {
  return {
    ...state,
    token: null,
    userId: null
  }
}

const setAuthRedirectPath = (state,action) => {
  return {
    ...state,
    redirectPath: action.path
  }
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START:
      return authStart(state,action);
    case actionTypes.AUTH_SUCCESS:
      return authSuccess(state,action);
    case actionTypes.AUTH_FAIL:
      return authFail(state,action);
    case actionTypes.AUTH_LOGOUT:
      return authLogout(state,action);
    case actionTypes.SET_AUTH_REDIRECT_PATH:
      return setAuthRedirectPath(state,action);
    default:
      return state;
  }
};

export default reducer;
