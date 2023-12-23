import department from "./department";
import employee from "./employee";
import inventory from "./inventory";
import invoice from "./invoice";
import authen from "./authen";
import ax from "axios";
import baseApi from "./base/base-api";

const axios = ax.create({
  // Khởi tạo cấu hình cho axios
  baseURL: process.env.VUE_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
const api = {
  // Khởi tạo các api
  department: department(axios),
  employee: employee(axios),
  inventory: inventory(axios),
  invoice: invoice(axios),
  authen: authen(axios),
  unit: baseApi(axios, "units"),
  stock: baseApi(axios, "stocks"),
  inventoryGroup: baseApi(axios, "inventorygroups"),
  inventoryItem: baseApi(axios, "inventoryitems"),
};

export default api;
