/**
 * @description: Tạo store lưu trữ các mode của dialog (thêm, sửa, xóa)
 * Author: tttuan 5/3/2023
 */
const dialogMode = {
  state: {
    mode: null, // mode của dialog (thêm, sửa, xóa)
    action: null, // action của dialog (thêm, sửa, xóa)
    employeeId: null, // id của nhân viên
    inventoryId: null, // id của hàng hóa
    invoiceId: null, // id của hóa đơn
    informationId: null, // id thông tin cá nhân
  },
  mutations: {
    /**
     * @description: Thay đổi mode của dialog (Thêm, sửa, xóa)
     * Author: tttuan 5/3/2023
     */
    setMode(state, mode) {
      state.mode = mode;
    },
    /**
     * @description: Thay đổi id của nhân viên
     * Author: tttuan 5/3/2023
     */
    setEmployeeId(state, employeeId) {
      state.employeeId = employeeId;
    },
    /**
     * @description: Thay đổi id của hàng hía
     * Author: tttuan 5/3/2023
     */
    setInventoryId(state, inventoryId) {
      state.inventoryId = inventoryId;
    },
    /**
     * @description: Thay đổi id của hàng hía
     * Author: tttuan 5/3/2023
     */
    setInvoiceId(state, invoiceId) {
      state.invoiceId = invoiceId;
    },
        /**
     * @description: Thay đổi id của hàng hía
     * Author: tttuan 5/3/2023
     */
    setInformationId(state, informationId) {
      state.informationId = informationId;
    },
    /**
     * @description: TThay đổi action trong dialog (Cất, Cất và tiếp tục, Hủy)
     * Author: tttuan 5/3/2023
     */
    setAction(state, action) {
      state.action = action;
    },
  },
  actions: {
    /**
     * @description: Thay đổi mode của dialog (Thêm, sửa, xóa)
     * Author: tttuan 5/3/2023
     */
    setMode({ commit }, mode) {
      commit("setMode", mode);
    },
    /**
     * @description: Thay đổi id của nhân viên
     * Author: tttuan 5/3/2023
     */
    setEmployeeId({ commit }, employeeId) {
      commit("setEmployeeId", employeeId);
    },
    /**
     * @description: Thay đổi id của hàng hóa
     * Author: tttuan 5/3/2023
     */
    setInventoryId({ commit }, inventoryId) {
      commit("setInventoryId", inventoryId);
    },
    /**
     * @description: Thay đổi id của hàng hóa
     * Author: tttuan 5/3/2023
     */
    setInvoiceId({ commit }, invoiceId) {
      commit("setInvoiceId", invoiceId);
    },
    /**
     * @description: Thay đổi id của hàng hóa
     * Author: tttuan 5/3/2023
     */
    setInformationId({ commit }, informationId) {
      commit("setInformationId", informationId);
    },
    /**
     * @description: Thay đổi action trong dialog (Cất, Cất và tiếp tục, Hủy)
     * Author: tttuan 5/3/2023
     */
    setAction({ commit }, action) {
      commit("setAction", action);
    },
  },
  getters: {
    /**
     * @description: Lấy mode của dialog (Thêm, sửa, xóa)
     * Author: tttuan 5/3/2023
     */
    getMode(state) {
      return state.mode;
    },
    /**
     * @description: Lấy id của nhân viên trong dialog
     * Author: tttuan 5/3/2023
     */
    getEmployeeId(state) {
      return state.employeeId;
    },
    /**
     * @description: Lấy id của hàng hóa trong dialog
     * Author: tttuan 5/3/2023
     */
    getInventoryId(state) {
      return state.inventoryId;
    },
    /**
     * @description: Lấy id của hàng hóa trong dialog
     * Author: tttuan 5/3/2023
     */
    getInvoiceId(state) {
      return state.invoiceId;
    },
    /**
     * @description: Lấy id của hàng hóa trong dialog
     * Author: tttuan 5/3/2023
     */
    getInformationId(state) {
      return state.informationId;
    },
    /**
     * @description: Lấy action trong dialog (Cất, Cất và tiếp tục, Hủy)
     * Author: tttuan 5/3/2023
     */
    getAction(state) {
      return state.action;
    },
  },
};

export default dialogMode;
