import axios from "axios";

const API = axios.create({
  baseURL: "http://192.168.0.132:8000/api",
});

export default API;