// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://192.168.0.132:8000/api",
// });

// export default API;

import axios from "axios";

/* ---------------- BASE CONFIG ---------------- */
const API = axios.create({
  baseURL: "http://192.168.0.132:8000/api",
  timeout: 15000, // prevents infinite hanging requests
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/* ---------------- REQUEST INTERCEPTOR ---------------- */
API.interceptors.request.use(
  (config) => {
    // you can later attach Firebase token here if needed
    // const token = await auth.currentUser?.getIdToken();
    // if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/* ---------------- RESPONSE INTERCEPTOR ---------------- */
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Better debugging
    if (error.response) {
      console.log("API ERROR RESPONSE:", error.response.data);
    } else if (error.request) {
      console.log("NO RESPONSE FROM SERVER (NETWORK ISSUE)");
    } else {
      console.log("API ERROR:", error.message);
    }

    return Promise.reject(error);
  }
);

export default API;