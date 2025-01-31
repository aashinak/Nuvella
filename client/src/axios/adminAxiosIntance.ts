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
const adminAxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Base API URL
  withCredentials: true, // Send cookies with requests
});

// Request interceptor: Attach access token if available
adminAxiosInstance.interceptors.request.use(
  (config) => {
    console.log(accessToken);

    // Use the `accessToken` stored in memory
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle 401 Unauthorized (token expiration)
adminAxiosInstance.interceptors.response.use(
  (response) => response, // Return the response if everything is fine

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
          `${process.env.NEXT_PUBLIC_API_URL}/admin/adminTokenRegen`,
          {}, // No body needed, refresh token sent via cookie
          { withCredentials: true } // Ensure cookies are sent
        );

        // Save the new access token to memory
        const { accessToken: newAccessToken } = response.data;
        setAccessToken(newAccessToken);

        // Retry the original request with the new access token
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return adminAxiosInstance(originalRequest);
      } catch (err) {
        // If refreshing fails, redirect to login page
        console.error("Token refresh failed, logging out...");
        setAccessToken(null);
        // Redirect to login page or trigger logout flow
        window.location.href = "/";
      }
    }

    // If it's another error (not 401), just reject the promise
    return Promise.reject(error);
  }
);

export default adminAxiosInstance;
