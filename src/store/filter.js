/**
 * @description: Tạo store lưu trữ danh sách filter
 * Author: tttuan 5/3/2023
 */
const filter = {
  state: {
    listFilter: [],
  },
  mutations: {
    /**
     * @description: Thay đổi danh sách filter
     * Author: tttuan 5/3/2023
     * @param {*} state
     * @param {*} listFilter
     * @returns
     */
    setListFilter(state, listFilter) {
      state.listFilter = listFilter;
    },
    /**
     * @description: Xóa một item trong danh sách filter
     * @param: {any}
     * Author: tttuan 10/11/2022
     */
    removeItemFilter(state, removeKey) {
      state.listFilter = state.listFilter.filter((item) => item.key !== removeKey);
    },

    /**
     * @description: Xóa tất cả item trong danh sách filter
     * @param: {any}
     * Author: tttuan 10/11/2022
     */
    removeAllFilter(state) {
      state.listFilter = [];
    },

    /**
     * @description: Thêm một item vào danh sách filter
     * @param: {any}
     * Author: tttuan 10/11/2022
     * @param {*} state
     * @param {*} item
     * @returns
     */
    addItemFilter(state, item) {
      let index = state.listFilter.findIndex((x) => x.key === item.key);
      if (index === -1) {
        state.listFilter.push(item);
      } else {
        state.listFilter[index] = item;
      }
    },
    /**
     * @description: Hàm này dùng để thêm duplicate item vào danh sách filter
     * @param: {any}
     * Author: tttuan 10/11/2022
     */
    addDuplicateItemFilter(state, item) {
      state.listFilter.push(item);
    },
  },
  getters: {
    /**
     * @description: Lấy danh sách filter
     * @param: {any}
     * Author: tttuan 10/11/2022
     */
    getListFilter(state) {
      return state.listFilter;
    },
    /**
     * @description: Lấy ra một item trong danh sách filter theo key
     * @param: {any}
     * Author: tttuan 10/11/2022
     */
    getItemFilterByKey: (state) => (key) => {
      return state.listFilter.find((item) => item.key === key);
    },
    /**
     * @description: Lấy danh sách filter theo key và condition
     * @param: {any}
     * Author: tttuan 10/11/2022
     */
    getListFilterByKeyAndCondition(state) {
      return state.listFilter.map((item) => {
        return {
          fieldName: item.key,
          value: item.value,
          filterCondition: item.condition,
        };
      });
    },
  },
};

export default filter;
