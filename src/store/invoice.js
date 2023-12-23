import axios from "axios";
/**
 * @description: Tạo store lưu trữ các giá trị liên quan đến hàng hóa
 * Author: tttuan 5/3/2023
 */
const invoice = {
  state: {
    listInvoiceSelected: [], // danh sách hàng hóa được chọn
  },
  mutations: {
    /**
     * @description: Thêm hàng hóa vào danh sách hàng hóa được chọn
     * @param: {state} state của store
     * @param: {invoiceList} danh sách hàng hóa được chọn
     * Author: tttuan 5/3/2023
     */
    setInvoiceSelected(state, invoiceList) {
      state.listInvoiceSelected = invoiceList;
    },
  },
  actions: {
    /**
     * @description: Xóa hàng hóa khỏi danh sách hàng hóa được chọn
     * @param: {any}
     * Author: tttuan 06/10/2022
     */
    async deleteMultipleInvoice({ commit, getters }) {
      try {
        const res = await axios.post(
          `${process.env.VUE_APP_API_URL}invoices/delete-multiple`,
          getters.getListInvoiceSelected
        );
        if (res) {
          commit("setInvoiceSelected", []);
          return res.data;
        }
      } catch (error) {
        console.log(error);
        return error;
      }
    },
  },
  getters: {
    /**
     * @description: Lấy danh sách hàng hóa được chọn
     * @param: {state} state của store
     * Author: tttuan 5/3/2023
     * @example: this.$store.getters.getListInvoiceSelected;
     * @return: danh sách hàng hóa được chọn
     * Author: tttuan 5/3/2023
     */
    getListInvoiceSelected(state) {
      return state.listInvoiceSelected;
    },

    /**
     * @description: Xem trong danh sách hàng hóa được chọn có hàng hóa nào không
     * @param: {state} state của store
     * Author: tttuan 5/3/2023
     * @example: this.$store.getters.isInvoiceSelected;
     * @return: true nếu có hàng hóa được chọn, false nếu không có hàng hóa nào được chọn
     * Author: tttuan 5/3/2023
     */
    isInvoiceSelected(state) {
      return state.listInvoiceSelected.length > 0;
    },
  },
};

export default invoice;
