// axiosInstance.js
import axios from "axios";

let accessToken: string | null = null;
export const setAccessToken = (token: string | null) => {
  accessToken = token;
};
export const getAccessToken = () => {
  return accessToken;
};

// Create an Axios instance
const userAxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// Request interceptor: Attach access token if available
userAxiosInstance.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

userAxiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // If 401 error and no retry attempt, try refreshing the token
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/user/userTokenRegen`,
          {},
          { withCredentials: true }
        );

        // Save the new access token to memory
        const { accessToken: newAccessToken } = response.data;
        setAccessToken(newAccessToken);

        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return userAxiosInstance(originalRequest);
      } catch {
        console.error("Token refresh failed, logging out...");
        setAccessToken(null);
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default userAxiosInstance;
