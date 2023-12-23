import Enum from "@/utils/enum";
export default (axios, api) => ({
  /**
   * @description: Hàm này dùng để xử lý trả về kết quả từ api
   * @param: {any}
   * Author: tttuan 08/11/2022
   */
  handleReturnResult(response) {
    let errorCode = Enum.MISAError.Exception;
    try {
      if (response.data.success) {
        return response.data.data;
      } else {
        if (response.data) {
          errorCode = response.data.MisaCode;
        }
        throw new Error(errorCode);
      }
    } catch (error) {
      throw new Error(errorCode);
    }
  },

  /**
   * @description: Hàm lấy mã mới
   * @param: {any}
   * @return: Promise
   * Author: tttuan 26/10/2022
   */
  async getNewCode() {
    const response = await axios.get(`${api}/new-code`);
    return this.handleReturnResult(response);
  },

  /**
   * @description: Hàm dùng để inactive và active dữ liệu
   * @param: {any}
   * Author: tttuan 10/11/2022
   */
  async inactiveAndActive(entityId, status) {
    const response = await axios.put(`${api}/status/${entityId}?status=${status}`);
    return this.handleReturnResult(response);
  },

  /**
   * @description: Lấy danh sách dữ liệu theo trang và điều kiện
   * @param {number} pageNumber
   * @param {number} pageSize
   * @param {object} filter
   * @return: Promise
   * Author: tttuan 26/10/2022
   */
  async getAllPaging(filter = {}) {
    const response = await axios.post(`${api}/filter`, filter);
    return this.handleReturnResult(response);
  },
  /**
   * @description: Xuất dữ liệu ra file excel
   * @param {object} filter
   * @param {object} isExportAll
   * @return: Promise
   * Author: tttuan 07/11/2022
   */
  async exportExcel() {
    const response = await axios.get(`${api}/export`, {
      responseType: "blob",
    });
    return response;
  },
  /**
   * @description: Hàm lấy toàn bộ dữ liệu
   * @param: {any}
   * @return: Promise
   * Author: tttuan 26/10/2022
   */
  async getAll() {
    const response = await axios.get(api);
    return this.handleReturnResult(response);
  },

  /**
   * @description: Hàm lấy mã lớn nhất
   * @param: {any}
   * @return: Promise
   * Author: tttuan 06/11/2022
   */
  async getMaxCode() {
    const response = await axios.get(`${api}/max-code`);
    return this.handleReturnResult(response);
  },

  /**
   * @description: Lấy dữ liệu theo id
   * @param {string} id
   * @return: Promise
   * Author: tttuan 26/10/2022
   */
  async getById(id) {
    const response = await axios.get(`${api}/${id}`);
    return this.handleReturnResult(response);
  },

  /**
   * Hàm lưu dữ liệu
   * @param {object} data Dữ liệu cần lưu
   * @return: Promise
   * Author: tttuan 26/10/2022
   */
  async save(data) {
    const response = await axios.post(api, data);
    return this.handleReturnResult(response);
  },

  /**
   * Hàm dùng để cập nhật dữ liệu
   * @param {object} data Dữ liệu cần cập nhật
   * @param {string} id Id của bản ghi cần cập nhật
   * @return: Promise
   * Author: tttuan 26/10/2022
   */
  async update(data, id) {
    const response = await axios.put(`${api}/${id}`, data);
    return this.handleReturnResult(response);
  },

  /**
   * @description: Hàm xóa dữ liệu theo id
   * @param {string} id
   * @param: {any}
   * Author: tttuan 26/10/2022
   */
  async deleteById(id) {
    const response = await axios.delete(`${api}/${id}`);
    return this.handleReturnResult(response);
  },

  /**
   * @description: Hàm xóa nhiều bản ghi
   * @param {array} ids
   * @param: {any}
   * Author: tttuan 26/10/2022
   */
  async deleteMultiple(ids) {
    const response = await axios.post(`${api}/delete-multiple`, ids);
    return this.handleReturnResult(response);
  },
});
