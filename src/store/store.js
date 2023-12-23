import { createStore } from "vuex";
import dialogMode from "./dialogMode";
import employee from "./employee";
import inventory from "./inventory";
import invoice from "./invoice";
import action from "./action";
import permission from "./permission";
import filter from "./filter";
import table from "./table";

/**
 * @description: Tạo store lưu trữ các state
 * note: actions khác với mutations là actions hỗ trợ async/await và chỉ lên state bằng gọi mutations
 * Author: tttuan 24/09/2022
 */
const store = createStore({
  modules: {
    dialogMode,
    employee,
    inventory,
    invoice,
    action,
    filter,
    table,
    permission,
  },
});

export default store;
