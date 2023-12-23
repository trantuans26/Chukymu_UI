/**
 * @description: Tạo store lưu trữ các permission dùng chung của toàn bộ trang
 * Author: tttuan 5/3/2023
 */
const permission = {
    state: {
      permission: null, // key của permission
    },
    mutations: {
      /**
       * @description: Thay đổi permission thực hiện
       * Author: tttuan 5/3/2023
       * @param {*} state
       * @param {*} permission
       * @returns
       */
      setPermission(state, permission) {
        state.permission = permission;
      },
    },
    getters: {
      /**
       * @description: Lấy permission thực hiện
       * Author: tttuan 5/3/2023
       * @param {*} state
       * @returns
       */
      getPermission(state) {
        return state.permission;
      },
    },
  };
  
  export default permission;
  