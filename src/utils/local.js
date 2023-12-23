/**
 * @description: Hàm này dùng để lấy giá trị của một biến trong localStorage
 * @param: {any}
 * Author: tttuan 10/11/2022
 */
function getLocalStorage(key) {
  return localStorage.getItem(key);
}

/**
 * @description: Hàm này dùng để lưu giá trị của một biến vào localStorage
 * @param: {any}
 * Author: tttuan 10/11/2022
 * @param {string} key - Tên biến
 * @param {any} value - Giá trị của biến
 */
function setLocalStorage(key, value) {
  localStorage.setItem(key, value);
}

export default {
  getLocalStorage,
  setLocalStorage,
};
