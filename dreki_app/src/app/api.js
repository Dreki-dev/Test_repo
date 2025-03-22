import axios from "axios";

const api = axios.create({
  baseURL: "https://testv2.ravu8538.odns.fr", // URL de ton backend Symfony
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
