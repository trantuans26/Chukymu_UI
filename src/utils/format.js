/* eslint-disable */
import i18n from "@/locales/i18n";
import { arrayToTree } from "performant-array-to-tree";
const { t } = i18n.global;
/**
 * @description: Hàm này dùng để format ngày giờ từ dạng timestamp sang dạng dd/mm/yyyy
 * @param: {number} timestamp - Thời gian dạng timestamp
 * @return: {string} - Thời gian dạng dd/mm/yyyy
 * Author: tttuan 10/09/2022
 */
export function formatDate(timestamp) {
  const date = new Date(timestamp);
  let day = date.getDate();
  day = day < 10 ? `0${day}` : day;
  let month = date.getMonth() + 1;
  month = month < 10 ? `0${month}` : month;
  let year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * @description: Hàm này dùng để format số thập phân về dạng số nguyên
 * @param: {number} number - Số thập phân
 * @return: {number} - Số nguyên
 * Author: tttuan 11/09/2022
 */
export function formatNumber(number) {
  return Math.round(number);
}

/**
 * @description: Hàm này dùng để format đơn vị tiền tệ
 * @param: {number} number - Số tiền
 * Author: tttuan 19/10/2022
 */
export function formatCurrency(number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(number);
}

/**
 * @description Hàm này dùng để chuẩn hóa các kí tự tiếng việt trong chuỗi văn bản thành kí tự không dấu
 * @param {string} text Chuỗi văn bản cần chuẩn hóa
 * @return {string} - Chuỗi văn bản sau khi chuẩn hóa
 * Author: tttuan 10/09/2022
 */
export function removeVietnameseTones(str) {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D"); // Chuyển các kí tự có dấu thành không dấu

  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư

  str = str.replace(/ + /g, " "); // Loại bỏ khoảng trắng thừa
  str = str.trim(); // Loại bỏ khoảng trắng ở đầu và cuối chuỗi

  // Remove punctuations
  str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " "); // Loại bỏ các kí tự đặt biệt
  return str;
}

/**
 * @description: Hàm này dùng để convert giới tính từ số sang chuỗi
 * @param: number - Giới tính dạng số
 * @return: string - Giới tính dạng chuỗi
 * Author: tttuan 12/09/2022
 */
export function convertGender(number) {
  if (number === 0) {
    return t("employee_info.female");
  } else if (number === 1) {
    return t("employee_info.male");
  } else {
    return t("employee_info.other");
  }
}
/**
 * @description: Hàm này dùng để convert giảm thuế từ số sang chuỗi
 * @param: {any}
 * Author: tttuan 04/11/2022
 */
export function convertTax(number) {
  switch (number) {
    case 1:
      return "Chưa xác định";
    case 2:
      return "Không giảm thuế";
    case 3:
      return "Có giảm thuế";
    default:
      return "";
  }
}

/**
 * @description: Hàm này dùng để convert trạng thái từ số sang chuỗi
 * @param: number - Trạng thái dạng số
 * Author: tttuan 24/10/2022
 */
export function convertStatus(number) {
  switch (Number(number)) {
    case 0:
      return "Ngừng sử dụng";
    case 1:
      return "Đang sử dụng";
    default:
      return "";
  }
}

/**
 * @description: Hàm này dùng để format lại định dạng số phân nhau bởi dấu . và lấy 2 số sau dấu phẩy mặc định là 00
 * @param: {any}
 * Author: tttuan 31/10/2022
 */
export function formatNumberShow(number, minimumFractionDigits = 0) {
  if (number === null || number === undefined) return "";
  if (!isNaN(number)) {
    let numberFormat = new Intl.NumberFormat("vi-VN", {
      style: "decimal",
      maximumFractionDigits: 2,
      minimumFractionDigits: minimumFractionDigits,
    }).format(number);
    return numberFormat;
  }
  return "";
}
/**
 * @description: Hàm này dùng để convert format ngược lại định dạng số đã format thành số thường
 * @param: {any}
 * Author: tttuan 04/11/2022
 */
export function reverseFormatNumber(val, locale) {
  var group = new Intl.NumberFormat(locale).format(1111).replace(/1/g, "");
  var decimal = new Intl.NumberFormat(locale).format(1.1).replace(/1/g, "");
  var reversedVal = val.replace(new RegExp("\\" + group, "g"), "");
  reversedVal = reversedVal.replace(new RegExp("\\" + decimal, "g"), ".");
  return Number.isNaN(reversedVal) ? 0 : reversedVal;
}

/**
 * @description: Hàm này dùng để convent inventory type từ số sang chuỗi
 * @param: {any}
 * Author: tttuan 07/11/2022
 */
export function convertInventoryType(number) {
  switch (number) {
    case 1:
      return "Hàng hóa";
    case 2:
      return "Dịch vụ";
    case 3:
      return "Nguyên vật liệu";
    case 4:
      return "Thành phẩm";
    case 5:
      return "Công cụ dụng cụ";
    default:
      return "";
  }
}

/**
 * @description: Hàm này dùng để xóa kí tự dẫn tới database injection
 * @param: {any}
 * Author: tttuan 07/11/2022
 */
export function removeDatabaseInjection(str) {
  try {
    return str.replace(/'/g, "");
  } catch (e) {
    return str;
  }
}
/**
 * @description: tìm ra tất cả các con của 1 node
 * @param: {any}
 * Author: tttuan 24/10/2022
 */
function getAllChildOfNode(list, propKeyReplace, result, level = 0) {
  list.forEach((item) => {
    item.level = level;
    item[propKeyReplace] = `${"&nbsp;".repeat(level * 4)}${item[propKeyReplace]}`;
    if (item.children && item.children.length > 0) {
      item[propKeyReplace] = `<b>${item[propKeyReplace]}</b>`;
    }
    result.push(item);
    if (item.children) {
      getAllChildOfNode(item.children, propKeyReplace, result, level + 1);
    }
  });
}

/**
 * @description: Tạo một mảng mới có tên dạng tree &ensp;
 * @param: {any}
 * Author: tttuan 07/11/2022
 * @return: {any}
 */
export function createArrayTreeName(list, propKey, propValue, propParent) {
  let result = [];
  let arr = arrayToTree(list, {
    id: propKey,
    parentId: propParent,
    dataField: null,
  });
  getAllChildOfNode(arr, propValue, result);
  return result;
}

export default {
  formatDate,
  formatNumber,
  removeVietnameseTones,
  convertGender,
  formatCurrency,
  formatNumberShow,
  convertStatus,
  convertTax,
  reverseFormatNumber,
  convertInventoryType,
  removeDatabaseInjection,
  createArrayTreeName,
};
