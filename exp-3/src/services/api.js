import axios from "axios";

const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    console.log(
      "Axios Request Interceptor:"
    );

    console.log(
      "Authorization Token:",
      token
    );

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(
      "Axios Response Interceptor:",
      response.status
    );

    return response;
  },

  async (error) => {
    if (error.response?.status === 401) {
      console.log(
        "Unauthorized request detected"
      );

      localStorage.removeItem("token");

      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default api;