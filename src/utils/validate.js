/**
 * @description: Hàm này dùng để kiểm tra xem email có hợp lệ hay không
 * Author: tttuan 08/10/2022
 * @param {string} email
 * @returns {boolean} true: hợp lệ, false: không hợp lệ
 */
function isEmail(email) {
  // eslint-disable-next-line no-useless-escape
  return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);
}

/**
 * @description: Hàm này dùng để kiểm tra xem chuỗi có phải là số hay không
 * Author: tttuan 08/10/2022
 * @param {string} value - Giá trị cần kiểm tra
 * @param {boolean} positive - Kiểm tra số dương hay không
 * @returns {boolean} true: là số, false: không phải là số
 */
function isNumber(value, positive = false) {
  if (positive) {
    // eslint-disable-next-line no-useless-escape
    return /^\d+$/.test(value) && value > 0;
  }
  // eslint-disable-next-line no-useless-escape
  return /^\d+$/.test(value);
}

/**
 * @description: Hàm này dùng để xem giá trị có null hay rỗng hay không
 * @param {any} value - Giá trị cần kiểm tra
 * @returns {boolean}  true: hợp lệ, false: không hợp lệ
 * Author: tttuan 08/10/2022
 */
function isNullOrEmpty(value) {
  return !(value === null || value === undefined || value === "");
}

/**
 * @description: Hàm này dùng để kiểm tra độ dài của chuỗi
 * @param {string} value - Giá trị cần kiểm tra
 * @param {number} minLength - Độ dài tối thiểu
 * @param {number} maxLength - Độ dài tối đa
 * @returns {boolean} true: hợp lệ, false: không hợp lệ
 * Author: tttuan 08/10/2022
 */
function isLength(value, minLength = 0, maxLength = 100) {
  return value.length >= minLength && value.length <= maxLength;
}

/**
 * @description: Hàm này dùng để kiểm tra số điện thoại
 * @param {string} value - Giá trị cần kiểm tra
 * @returns {boolean} true: hợp lệ, false: không hợp lệ
 * Author: tttuan 08/10/2022
 */
function isPhoneNumber(value) {
  // eslint-disable-next-line no-useless-escape
  return /^(84|0[3|5|7|8|9])+([0-9]{8})\b$/.test(value);
}

export default {
  isEmail,
  isNumber,
  isNullOrEmpty,
  isLength,
  isPhoneNumber,
};
