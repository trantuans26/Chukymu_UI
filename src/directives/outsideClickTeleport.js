// tạo click outside cho combobox sử dụng teleport

export default {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (
        !(
          (
            event.target.closest(`.${el.className}`) ||
            el === event.target || // click phạm vi của combobox__data
            el.contains(event.target)
          ) //click vào element con của combobox__data
        )
      ) {
        // Thực hiện sự kiện tùy chỉnh:
        binding.value(event, el);
      }
    };

    document.body.addEventListener("click", el.clickOutsideEvent);
  },
  beforeUnmount: (el) => {
    document.body.removeEventListener("click", el.clickOutsideEvent);
  },
};
