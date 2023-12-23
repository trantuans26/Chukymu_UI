import axios from "axios";
/**
 * @description: Tạo store lưu trữ các giá trị liên quan đến nhân viên
 * Author: tttuan 5/3/2023
 */
const employee = {
  state: {
    listEmployeeSelected: [], // danh sách nhân viên được chọn
  },
  mutations: {
    /**
     * @description: Thêm nhân viên vào danh sách nhân viên được chọn
     * @param: {state} state của store
     * @param: {employeeList} danh sách nhân viên được chọn
     * Author: tttuan 5/3/2023
     */
    setEmployeeSelected(state, employeeList) {
      state.listEmployeeSelected = employeeList;
    },
  },
  actions: {
    /**
     * @description: Xóa nhân viên khỏi danh sách nhân viên được chọn
     * @param: {any}
     * Author: tttuan 06/10/2022
     */
    async deleteMultipleEmployee({ commit, getters }) {
      try {
        const res = await axios.post(
          `${process.env.VUE_APP_API_URL}employees/deleteBatch`, {
            "iDs": getters.getListEmployeeSelected.toString(),
          }
        );
        if (res) {
          commit("setEmployeeSelected", []);
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
     * @description: Lấy danh sách nhân viên được chọn
     * @param: {state} state của store
     * Author: tttuan 5/3/2023
     * @example: this.$store.getters.getListEmployeeSelected;
     * @return: danh sách nhân viên được chọn
     * Author: tttuan 5/3/2023
     */
    getListEmployeeSelected(state) {
      return state.listEmployeeSelected;
    },

    /**
     * @description: Xem trong danh sách nhân viên được chọn có nhân viên nào không
     * @param: {state} state của store
     * Author: tttuan 5/3/2023
     * @example: this.$store.getters.isEmployeeSelected;
     * @return: true nếu có nhân viên được chọn, false nếu không có nhân viên nào được chọn
     * Author: tttuan 5/3/2023
     */
    isEmployeeSelected(state) {
      return state.listEmployeeSelected.length > 1;
    },
  },
};

export default employee;
