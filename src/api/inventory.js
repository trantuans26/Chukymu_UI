const PREFIX_INVENTORY = "Inventories";
export default (axios) => ({
  /**
   * @description: Lấy mã hàng hóa mới
   * @return {Promise} Promise
   * Author: tttuan 1/3/2023
   */
  getNewInventoryCode() {
    return axios.get(`${PREFIX_INVENTORY}/newCode`);
  },

  /**
   * @description: Lấy chi tiết hàng hóa
   * @param {String} inventoryId Id hàng hóa
   * @return {Promise} Promise
   * Author: tttuan 1/3/2023
   */
  getInventoryById(inventoryId) {
    return axios.get(`${PREFIX_INVENTORY}/${inventoryId}`);
  },

  /**
   * @description: Lấy danh sách hàng hóa theo filter
   * @param {Object} filter Đối tượng filter
   * @return {Promise} Promise
   * Author: tttuan 1/3/2023
   */
  getInventoriesFilter(object) {
    var defaultObject = {
      pageNumber: 1,
      pageSize: 10,
      keyword: "",
      filter: 2,
    };
    object = Object.assign(defaultObject, object);
    return axios.get(`${PREFIX_INVENTORY}/filter?keyword=${object.keyword}&filter=${object.filter}&pageSize=${object.pageSize}&pageNumber=${object.pageNumber}`, {
    });
  },

  /**
   * @description: Xóa hàng hóa
   * @param {String} inventoryId Id hàng hóa
   * @return {Promise} Promise
   * Author: tttuan 1/3/2023
   */
  deleteInventory(inventoryId) {
    return axios.delete(`${PREFIX_INVENTORY}/${inventoryId}`);
  },

  /**
   * @description: Thêm mới hàng hóa
   * @param {Object} inventory Đối tượng hàng hóa
   * @return {Promise} Promise
   * Author: tttuan 1/3/2023
   */
  insertInventory(object) {
    return axios.post(`${PREFIX_INVENTORY}`, object);
  },

  /**
   * @description: Cập nhật hàng hóa
   * @param {Object} inventory Đối tượng hàng hóa
   * @return {Promise} Promise
   * Author: tttuan 1/3/2023
   */
  updateInventory(object) {
    return axios.put(`${PREFIX_INVENTORY}/${object.inventoryID}`, object);
  },
  /**
   * @description: Export danh sách hàng hóa
   * Author: tttuan 5/3/2023
   */
  exportInventories(object) {
    return axios.get(`${PREFIX_INVENTORY}/export?keyword=${object.keyword}`, {
      responseType: "blob",
    });
  },

  getTopInventories() {
    return axios.get(`Dashboards/topInventory`);
  },

  getMinQuantity() {
    return axios.get(`Dashboards/minQuantity`);
  },

  getSumTotalCosts() {
    return axios.get(`Dashboards/sumTotalCosts`);
  },

  getTopInvoices() {
    return axios.get(`Dashboards/topInvoice`);
  }
});
