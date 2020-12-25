import axios from "axios";

export const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://heroku-care.herokuapp.com/"
    : "http://localhost:3000/";

const api = axios.create({
  baseURL: baseUrl,
});

export default api;
