/**
 * @description: Định nghĩa các Enum cho toàn bộ ứng dụng
 * Author: tttuan 10/09/2022
 */
export default {
  // Mã phím
  KEY_CODE: {
    // Mã phím Enter
    ENTER: 13,
    // Mã phím Tab
    TAB: 9,
    // Mã phím Esc
    ESC: 27,
    // Mã phím Space
    SPACE: 32,
    // Mã phím Delete
    DELETE: 46,
    // Mã phím Backspace
    BACKSPACE: 8,
    // Mã phím Arrow Left
    ARROW_LEFT: 37,
    // Mã phím Arrow Up
    ARROW_UP: 38,
    // Mã phím Arrow Right
    ARROW_RIGHT: 39,
    // Mã phím Arrow Down
    ARROW_DOWN: 40,
    // Mã phím F1
    F1: 112,
    // Mã phím S
    S: 83,
    // Mã phím N
    N: 78,
    // Mã phím E
    E: 69,
    // Mã phím R
    R: 82,
    // Mã phím L
    L: 76,
    // Mã phím A
    A: 65,
    // Mã phím C
    C: 67,
  },
  // tên phím
  KEY_NAME: {
    S: "S",
    // s nếu không có shift
    s: "s",
    A: "A",
    // Esc
    Esc: "Escape",
    // Delete
    Delete: "Delete",
    // R
    R: "R",
    // E
    E: "E",
    // L
    L: "L",
    // f1
    F1: "F1",
  },
  KEY_DEFINE: {
    // Tổ hợp phím Ctrl + S : Cất
    CTRL_S: " (Ctrl + S)",
    // Tổ hợp phím Ctrl + shift + S : Cất và thêm mới
    CTRL_SHIFT_S: " (Ctrl + Shift + S)",
    // Tổ hợp phím Ctrl + alt + A : Thêm mới
    CTRL_ALT_A: " (Ctrl + Alt + A)",
    // Đóng
    CLOSE: " (Esc)",
    // F1
    F1: " (F1)",
  },
  // Mã loại thông báo
  ALERT_TYPE: {
    // Thông báo thành công
    SUCCESS: "success",
    // Thông báo lỗi
    ERROR: "error",
    // Thông báo cảnh báo
    WARNING: "warning",
    // Thông báo thông tin
    INFO: "info",
  },
  // Form mode
  FORM_MODE: {
    // Chế độ thêm mới
    ADD: "add",
    // Chế độ chỉnh sửa
    EDIT: "edit",
    // Chế độ Nhân bản
    DUPLICATE: "duplicate",
    // Null
    NULL: null,
  },
  // Hành động cất, hủy, xóa, nhân bản, lưu,...
  ACTION: {
    // Thêm mới
    ADD: "add",
    // Chỉnh sửa
    EDIT: "edit",
    // Xóa
    DELETE: "delete",
    // Xóa nhiều
    DELETE_MANY: "deleteMany",
    // Tìm kiếm
    SEARCH: "search",
    // Lưu
    SAVE: "save",
    // Cất và đóng form
    SAVE_AND_CLOSE: "saveAndClose",
    // Cất và thêm mới
    SAVE_AND_ADD: "saveAndAdd",
    // Hủy
    CANCEL: "cancel",
    // Đóng
    CLOSE: "close",
    // ngưng sử dụng
    INACTIVE: "inactive",
    // Sử dụng
    ACTIVE: "active",
    // nhân bản
    DUPLICATE: "duplicate",
    // Reload dữ liệu
    RELOAD: "reload",
    // Xuất file
    EXPORT: "export",
    // Trợ giúp
    HELP: "help",
    // Null
    NULL: null,
    // Collapse thanh sidebar
    COLLAPSE: "collapse",
  },
  // Các tính chất hàng hóa dịch vụ
  GOODS_PROPERTY: {
    // Hàng hóa
    GOODS: 1,
    // Dịch vụ
    SERVICE: 2,
    // Nguyên Vật Liệu
    MATERIAL: 3,
    // Thành phẩm
    FINISHED_GOODS: 4,
    // Công cụ dụng cụ
    TOOL: 5,
  },
  /// Tình trạng tồn kho
  INVENTORY_STATUS: {
    // Còn tồn
    IN_STOCK: 1,
    // Hết hàng
    OUT_OF_STOCK: 2,
    // Sắp hết hàng
    SOON_OUT_OF_STOCK: 3,
  },

  // Các thông báo lỗi của toast
  ICON: {
    ERROR: "error",
    SUCCESS: "success",
    WARNING: "warning",
    INFO: "info",
  },
  // MISA CODE RESPONSE
  MISA_CODE: {
    // Thành công
    SUCCESS: 200,
    // Thêm mới thành công
    CREATED: 201,
    // Thêm mới thành công
    NO_CONTENT: 204,
    // Lỗi validate
    VALIDATE: 400,
    // Lỗi không xác định
    ERROR: 500,
  },
  // Language
  LANGUAGE: {
    // Tiếng việt
    VI: "vi",
    // Tiếng anh
    EN: "en",
  },
  FilterConditon: {
    // Lọc bằng
    Equal: "Equal",
    // Lọc khác
    NotEqual: "NotEqual",
    // Lọc chứa
    Contain: "Contain",
    // Lọc không chứa
    NotContain: "NotContain",
    // Lọc bắt đầu bằng
    StartWith: "StartWith",
    // Lọc kết thúc bằng
    EndWith: "EndWith",
    // Lọc null
    IsNull: "IsNull",
    // Lọc không null
    IsNotNull: "IsNotNull",
    // Lọc lớn hơn
    GreaterThan: "GreaterThan",
    // Lọc lớn hơn hoặc bằng
    GreaterThanOrEqual: "GreaterThanOrEqual",
    // Lọc nhỏ hơn
    LessThan: "LessThan",
    // Lọc nhỏ hơn hoặc bằng
    LessThanOrEqual: "LessThanOrEqual",
  },
  FilterType: {
    // Lọc theo số
    Number: "number",
    // Lọc theo trạng thái
    Boolean: "boolean",
    // Lọc theo chuỗi
    Text: "text",
    // Lọc theo ngày tháng
    Date: "date",
  },
  MISAError: {
    /// <summary>
    /// Lỗi Exception
    /// </summary>
    Exception: 500,

    /// <summary>
    /// Lỗi trùng dữ liệu
    /// </summary>
    Duplicate: 6,

    /// <summary>
    /// Lỗi xóa dữ liệu
    /// </summary>
    Delete: 7,

    /// <summary>
    /// Lỗi validate do nghiệp vụ
    /// </summary>
    Validate: 8,

    /// <summary>
    /// Lỗi không tìm thấy dữ liệu
    /// </summary>
    NotFound: 404,

    /// <summary>
    /// Lỗi xóa dữ liệu do có nhiều bảng tham chiếu
    /// </summary>
    ForeignKey: 9,
  },

  DATE: {
    currentYear: 19,
    lastYear: 18,
    currentMonth: 17,
    today: 13,
    yesterday: 14,
    currentWeek: 15,
    lastWeek: 16,
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
    All: 20,
  },
};
