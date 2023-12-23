import axios from "axios";
/**
 * @description: Tạo store lưu trữ các giá trị liên quan đến hàng hóa
 * Author: tttuan 5/3/2023
 */
const inventory = {
  state: {
    listInventorySelected: [], // danh sách hàng hóa được chọn
  },
  mutations: {
    /**
     * @description: Thêm hàng hóa vào danh sách hàng hóa được chọn
     * @param: {state} state của store
     * @param: {inventoryList} danh sách hàng hóa được chọn
     * Author: tttuan 5/3/2023
     */
    setInventorySelected(state, inventoryList) {
      state.listInventorySelected = inventoryList;
    },
  },
  actions: {
    /**
     * @description: Xóa hàng hóa khỏi danh sách hàng hóa được chọn
     * @param: {any}
     * Author: tttuan 06/10/2022
     */
    async deleteMultipleInventory({ commit, getters }) {
      try {
        const res = await axios.post(
          `${process.env.VUE_APP_API_URL}inventorys/deleteBatch`, {
            "iDs": getters.getListEmployeeSelected.toString(),
          }
        );
        if (res) {
          commit("setInventorySelected", []);
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
     * @example: this.$store.getters.getListInventorySelected;
     * @return: danh sách hàng hóa được chọn
     * Author: tttuan 5/3/2023
     */
    getListInventorySelected(state) {
      return state.listInventorySelected;
    },

    /**
     * @description: Xem trong danh sách hàng hóa được chọn có hàng hóa nào không
     * @param: {state} state của store
     * Author: tttuan 5/3/2023
     * @example: this.$store.getters.isInventorySelected;
     * @return: true nếu có hàng hóa được chọn, false nếu không có hàng hóa nào được chọn
     * Author: tttuan 5/3/2023
     */
    isInventorySelected(state) {
      return state.listInventorySelected.length > 0;
    },
  },
};

export default inventory;
