const PREFIX_EMPLOYEE = "Employees";
export default (axios) => ({
  /**
   * @description: Lấy mã nhân viên mới
   * @return {Promise} Promise
   * Author: tttuan 1/3/2023
   */
  getNewEmployeeCode() {
    return axios.get(`${PREFIX_EMPLOYEE}/newCode`);
  },

  /**
   * @description: Lấy chi tiết nhân viên
   * @param {String} employeeId Id nhân viên
   * @return {Promise} Promise
   * Author: tttuan 1/3/2023
   */
  getEmployeeById(employeeId) {
    return axios.get(`${PREFIX_EMPLOYEE}/${employeeId}`);
  },

    /**
   * @description: Lấy chi tiết nhân viên
   * @param {String} employeeId Id nhân viên
   * @return {Promise} Promise
   * Author: tttuan 1/3/2023
   */
    getInformationById(employeeId) {
      return axios.get(`${PREFIX_EMPLOYEE}/login/${employeeId}`);
    },
  /**
   * @description: Lấy danh sách nhân viên theo filter
   * @param {Object} filter Đối tượng filter
   * @return {Promise} Promise
   * Author: tttuan 1/3/2023
   */
  getEmployeesFilter(object) {
    var defaultObject = {
      pageNumber: 1,
      pageSize: 10,
      keyword: "",
      filter: 2,
    };
    object = Object.assign(defaultObject, object);
    return axios.get(`${PREFIX_EMPLOYEE}/filter?keyword=${object.keyword}&filter=${object.filter}&pageSize=${object.pageSize}&pageNumber=${object.pageNumber}`, {
    });
  },

  /**
   * @description: Xóa nhân viên
   * @param {String} employeeId Id nhân viên
   * @return {Promise} Promise
   * Author: tttuan 1/3/2023
   */
  deleteEmployee(employeeId) {
    return axios.delete(`${PREFIX_EMPLOYEE}/${employeeId}`);
  },

  /**
   * @description: Thêm mới nhân viên
   * @param {Object} employee Đối tượng nhân viên
   * @return {Promise} Promise
   * Author: tttuan 1/3/2023
   */
  insertEmployee(object) {
    return axios.post(`${PREFIX_EMPLOYEE}`, object);
  },

  /**
   * @description: Cập nhật nhân viên
   * @param {Object} employee Đối tượng nhân viên
   * @return {Promise} Promise
   * Author: tttuan 1/3/2023
   */
  updateEmployee(object) {
    return axios.put(`${PREFIX_EMPLOYEE}/${object.employeeID}`, object);
  },

  /**
   * @description: Cập nhật nhân viên
   * @param {Object} employee Đối tượng nhân viên
   * @return {Promise} Promise
   * Author: tttuan 1/3/2023
   */
  updateEmployeeLogin(object) {
    return axios.put(`${PREFIX_EMPLOYEE}/login/${object.employeeID}`, object);
  },
  /**
   * @description: Export danh sách nhân viên
   * Author: tttuan 5/3/2023
   */
  exportEmployees(object) {
    return axios.get(`${PREFIX_EMPLOYEE}/export?keyword=${object.keyword}`, {
      responseType: "blob",
    });
  },

  forgotPassword(email) {
    return axios.post(`${PREFIX_EMPLOYEE}/sendMail/${email}`);
  }
});
