/**
 * @description: Tạo store lưu trữ các giá trị trong table
 * Author: tttuan 10/11/2022
 */
const table = {
  state: {
    listIdSelected: [], // danh sách id được chọn
  },
  mutations: {
    /**
     * @description: gán danh sách id được chọn
     * @param: {state} state của store
     * @param: {id} id được chọn
     * Author: tttuan 10/11/2022
     */
    setListIdSelected(state, id) {
      state.listIdSelected = id;
    },
  },

  getters: {
    /**
     * @description: Lấy danh sách id được chọn
     * @param: {state} state của store
     * Author: tttuan 10/11/2022
     * @example: this.$store.getters.getListIdSelected;
     * @return: danh sách id được chọn
     */
    getListIdSelected(state) {
      return state.listIdSelected;
    },
  },
};

export default table;
