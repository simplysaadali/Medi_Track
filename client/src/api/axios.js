import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

/**
 * TASK 7.4 (BONUS) - handle every 401 in one place instead of in 40 components.
 * Never import the store here (circular import) - register a handler instead.
 * Exclude /auth/me: a 401 there is the normal "not logged in" answer.
 */
let onUnauthorised = () => {};
export const setUnauthorisedHandler = (fn) => {
  onUnauthorised = fn;
};

// TODO (Task 7.4): api.interceptors.response.use(...) and always re-reject the error

export default api;
