import axios from "axios";

const api = axios.create({
  //where you backend lives
  baseURL: "http://localhost:5000/api", 
  withCredentials: true,
});

let onUnauthorised = () => {};

// this means when ever axios receives 401, run this function, i.e dispatch(logout());
export const setUnauthorisedHandler = (fn) => { 
  onUnauthorised = fn;
};

//the interceptor actually goes through the response to check for 401
//  backend res -> axios interceptor -> check res -> return res
// interceptor is checkpoint for axios res
api.interceptors.response.use(
  (response) => response, //if succeeds it returns the response
  (error) => {
    const requestUrl = error.config?.url?.split(/[?#]/)[0]; //gets the url of failed req
    const isAuthMeRequest = requestUrl === "/auth/me" || requestUrl?.endsWith("/auth/me");

    if (error.response?.status === 401 && !isAuthMeRequest) {
      onUnauthorised();
      /* GET /appoinmetns
      backend rpotects this
      no valid token found
      401
      axios interceptor called
      onunauthorized()
      logout /redirects to login page*/
    }

    return Promise.reject(error);
  }
);

export default api;
