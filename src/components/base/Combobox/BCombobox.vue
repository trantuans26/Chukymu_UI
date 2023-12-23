<template>
  <div class="combobox" 

  >
    <input type="text" class="input input--haveicon input--modal combobox__input" 
      ref="departmentFocusing"
      v-model="value" 
      :class="{'input--error': required && !value}"   
      @input="inputOnChange" 
      @blur="onBlur()"
      @keydown="selectItemUpDown" 
      :placeholder="propPlaceholder"
      @click="onClick()"
      @keydown.enter="isShowListData = false"
      @change="this.$emit('onChange', value)"
      />
    <base-message-error :text="fieldName"></base-message-error>

    <button class="button combobox__button" 
      @click="btnSelectDataOnClick(), onClick()"
      @blur="onBlur()" 
      @keydown="selectItemUpDown" 
      tabindex="-1"
    >
      <i class="icon icon--caretdown"
        :class="{'icon--caretdownRotate' : isShowListData}"
      ></i>
    </button>
    <div class="combobox__data" 
      v-show="isShowListData" 
      ref="combobox__data" 
      v-clickoutside="hideListData"
    >
      <a class="combobox__item" 
        v-for="(item, index) in dataFilter" 
        :class="{
        'combobox__item--focus': index == indexItemFocus,
        'combobox__item--selected': index == indexItemSelected,
        }" 
        :key="item[this.propValue]" 
        :ref="'toFocus_' + index" 
        :value="item[this.propValue]"
        @click="itemOnSelect(item, index)" 
        @focus="saveItemFocus(index)" 
        @keydown="selectItemUpDown(index)"
        @keyup="selectItemUpDown(index)" 
        tabindex="1"
      >
        <div class="combobox__item-icon">
          <img 
            v-show="index == indexItemSelected" 
            :src="require('./icon/check.png')" alt="" srcset="" width="14"
            height="11" 
          />
        </div>
          
        <span>{{ item[this.propText] }}</span>
      </a>
    </div>
  </div>
</template>
<script>
/* eslint-disable */

import BaseMessageError from "@/components/base/Message/BaseMessageError.vue";

/**
 * Gán sự kiện nhấn click chuột ra ngoài combobox data (ẩn data list đi)
 * TTTuan (13/01/2023)
 */
const clickoutside = {
  mounted(el, binding, vnode, prevVnode) {
    el.clickOutsideEvent = (event) => {
      // Nếu element hiện tại không phải là element đang click vào
      // Hoặc element đang click vào không phải là button trong combobox hiện tại thì ẩn đi.
      if (
        !(
          (
            el === event.target || // click phạm vi của combobox__data
            el.contains(event.target) || //click vào element con của combobox__data
            el.previousElementSibling.contains(event.target)
          ) //click vào element button trước combobox data (nhấn vào button thì hiển thị)
        )
      ) {
        // Thực hiện sự kiện tùy chỉnh:
        binding.value(event, el);
        // vnode.context[binding.expression](event); // vue 2
      }
    };
    document.body.addEventListener("click", el.clickOutsideEvent);
  },
  beforeUnmount: (el) => {
    document.body.removeEventListener("click", el.clickOutsideEvent);
  },
};

function removeVietnameseTones(str) {
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
  str = str.replace(/Đ/g, "D");
  // Some system encode vietnamese combining accent as individual utf-8 characters
  // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
  // Remove extra spaces
  // Bỏ các khoảng trắng liền nhau
  str = str.replace(/ + /g, " ");
  str = str.trim();
  // Remove punctuations
  // Bỏ dấu câu, kí tự đặc biệt
  str = str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    " "
  );
  return str;
}

const keyCode = {
  Enter: 13,
  ArrowUp: 38,
  ArrowDown: 40,
  ESC: 27,
};

export default {
  name: "BCombobox",
  directives: {
    clickoutside,
  },
  props: {
    setValue: String,
    setID: String,
    url: String,
    propValue: String,
    propCode: String,
    propText: String,
    fieldName: String,
    propPlaceholder: String,
    required: {
      type: Boolean,
      default: false,
    },
    isLoadData: {
      type: Boolean,
      default: true,
    },
    addFocus: {
      type: Boolean,
      default: false,
    }
  },
  components: {
    BaseMessageError,
  },
  methods: {
    /**
     * Lưu lại index của item đã focus
     * TTTuan (13/01/2023)
     */
    saveItemFocus(index) {
      this.indexItemFocus = index;
    },

    /**
     * Ẩn danh sách item
     * TTTuan (13/01/2023)
     */
    hideListData() {
      this.isShowListData = false;
    },

    /**
     * Mở validate
     * TTTuan (13/01/2023)
     */
    validateOn() {
      this.$emit('validateOn', true);
    },

    /**
     * Đóng validate
     * TTTuan (13/01/2023)
     */
     validateOff() {
      this.$emit('validateOff', false);
    },

    /**
     * Nhấn vào button thì hiển thị hoặc ẩn List Item
     * TTTuan (13/01/2023)
     */
    btnSelectDataOnClick() {
      this.dataFilter = this.data;
      this.isShowListData = !this.isShowListData;
    },

    /**
     * Click chọn item trong danh sách
     * TTTuan (13/01/2023)
     */
    itemOnSelect(item, index) {
      let me = this;
      const text = item[me.propText];
/*       me.selectedID = item[me.propValue];
      me.selectedCode = item[me.propCode];
      me.textInput = text;  */
      me.value = text;
      me.indexItemSelected = index;
      me.isShowListData = false;

      me.$emit('getID', item[me.propValue]);
      me.$emit('getCode', item[me.propCode]);
    },

    /**
     * Nhập text thì thực hiện filter dữ liệu và hiển thị
     * TTTuan (13/01/2023)
     */
    inputOnChange() {
      var me = this;
      // Thực hiện lọc các phần tử phù hợp trong data:
      this.dataFilter = this.data.filter((e) => {
        let text = removeVietnameseTones(me.value)
          .toLowerCase()
          .replace(" ", "");
        let textOfItem = removeVietnameseTones(e[me.propText])
          .toLowerCase()
          .replace(" ", "");
        return textOfItem.includes(text);
      });
      this.isShowListData = true;
    },

    /**
     * Lựa chọn item bằng cách nhấn các phím lên, xuống trên bàn phím
     * TTTuan (13/01/2023)
     */
    selectItemUpDown() {
      var me = this;
      var keyCodePress = event.keyCode;
      var elToFocus = null;
      switch (keyCodePress) {
        case keyCode.ESC:
          this.isShowListData = false;
          break;
        case keyCode.ArrowDown:
          this.isShowListData = true;
          elToFocus = this.$refs[`toFocus_${me.indexItemFocus + 1}`];
          if (
            this.indexItemFocus == null ||
            !elToFocus ||
            elToFocus.length == 0
          ) {
            this.indexItemFocus = 0;
          } else {
            this.indexItemFocus += 1;
          }
          break;
        case keyCode.ArrowUp:
          this.isShowListData = true;
          elToFocus = this.$refs[`toFocus_${me.indexItemFocus - 1}`];
          if (
            this.indexItemFocus == null ||
            !elToFocus ||
            elToFocus.length == 0
          ) {
            this.indexItemFocus = this.dataFilter.length - 1;
          } else {
            this.indexItemFocus -= 1;
          }
          break;
        case keyCode.Enter:
          elToFocus = this.$refs[`toFocus_${me.indexItemFocus}`];
          if (elToFocus && elToFocus.length > 0) {
            elToFocus[0].click();
            this.isShowListData = false;
          }
          break;
        default:
          break;
      }
    },

    /**
     * Blur
     * TTTuan (13/01/2023)
     */
    onBlur() {
      this.$emit('onBlur', true);
    },

    /**
     * Blur
     * TTTuan (13/01/2023)
     */
     onClick() {
      this.$emit('onClick', false);
    },

  },

  created() {
    // Thực hiện lấy dữ liệu từ api:
    if (this.url) {
      fetch(this.url)
        .then((res) => res.json())
        .then((res) => {
          this.data = res;
          this.dataFilter = res;
        })

        .catch((res) => {
          console.log(res);
        });
    }
  },

  beforeMount() {

  },

  mounted() {
    this.dataFilter.forEach((element, index) => {
      if(element.inventoryCategoryName && element.inventoryCategoryName == this.setValue) {
        this.indexItemSelected = index;
      }
    });
  },

  beforeUpdate() {
    if(this.$parent.isShowSuccessToast == true)
      this.textInput = '';
  },

  updated() {
    let me = this;
    me.isFocused = this.addFocus;
    me.isFocused == true ? me.$refs.departmentFocusing.focus() : false;

    me.$emit("removeFocus", false);


  },

  data() {
    return {
      data: [], // data gốc
      selectedID: null,
      selectedCode: null,
      dataFilter: [], // data đã được filter
      isShowListData: false, // Hiển thị list data hay không
      indexItemFocus: null, // Index của item focus hiện tại
      indexItemSelected: null, // Index của item được selected
      isRequired: false,
      isFocused: false,
    };
  },

  watch: {
  },

  computed: {
    value: {
      get() {
        return this.setValue;
        
      },

      set(value) {
        let val = value;
        
        this.$emit('getName', val);
      }
    },
  },
};
</script>
<style scoped>
:root {
    --comboboxItem-colorChecked: rgb(38, 43, 102);
    --comboboxText-colorChecked: rgb(52, 59, 140);
}

.combobox {
  position: relative;
  /* flex-direction: row; */
  display: flex;
  height: 30px;
  border-radius: 4px;
  box-sizing: border-box;

}

.combobox__button {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(90, 90, 90);
  border-radius: 0 2px 2px 0;
  right: 1px;
  top: 1px;
  outline: none;
  border: none;
  border-left: unset;
  height: 30px;
  width: 28px;
  background-color: #fff;
  cursor: pointer;
  min-width: unset !important;
  outline: none;
}

.combobox__button:hover,
.combobox__button:focus {
  background-color: rgb(224, 224, 224);
  color: #000;
}

.combobox__data {
  display: flex;
  flex-direction: column;
  padding: 2px 0px;
  position: absolute;
  overflow: auto;
  width: 100%;
  height: 180px;
  max-height: 180px;
  top: 100%;
  left: 0;
  border-radius: 2.5px;
  background-color: #fff;
  box-shadow: 0px 3px 6px #00000016;
  z-index: 999;
}

.combobox__data::-webkit-scrollbar {
	width: 10px;
}

.combobox__data::-webkit-scrollbar-track {
    background-color: rgb(241, 241, 241);
	border-radius: 3px;
}

.combobox__data::-webkit-scrollbar-thumb {
	border-radius: 3px;
	background-color: #9E9E9E;
}

.combobox__item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  line-height: 29px;
  padding-left: 10px;
  height: 29px;
  cursor: pointer;
  outline: none;
  color: black;
}

.combobox__item-icon {
  width: 16px;
  height: 16px;
  font-size: 16px;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.combobox__item-icon--selected {
  width: 14px;
  height: 11px;
}

.combobox__item:hover,
.combobox__item:focus,
.combobox__item--focus,
.combobox__item--hover {
  background-color: #e9ebee;
  color: rgb(52, 59, 140);
}

.combobox__item--selected {
  pointer-events: none;
  background-color: rgb(38, 43, 102);
  color: #fff;
}

.input-err .combobox__input,
.input-err .combobox__input~.combobox__button {
  border-color: #E61D1D;
}

.combobox__input:focus,
.combobox__input:focus~.combobox__button {
  border-color: rgb(38, 43, 102);
}

:root {
    --input-height: 32px;
    --input-colorHover: rgb(52, 59, 140);
}

.input {
    font-size: 13px;
    background-color: #ffffff;
    border-radius: 4px;
    padding-left: 10px;
    color: inherit;
    border: 1px solid #babec5;
    height: 32px;
    box-sizing: border-box;
    outline: none;
    border-collapse: collapse;
    width: 100%;
}

.input::placeholder {
    font-size: 13px;
    font-style: italic;
}

.input--focused {
    border-color: rgb(0, 98, 204);
}

.input--disable {
    background-color: #f5f4f4;
    pointer-events: none;
}

.input:hover,
.input:focus {
    border-color: rgb(0, 98, 204);
}

.input:focus +.message--hasError {
    display: none;
}

.input--disable {
    background-color: #f5f4f4;
    pointer-events: none;
}

.input--error,
.input--error:hover {
    border: 1px solid #ed4337;
}

/* Begin: Search input */
.input--search {
    width: 280px;
    padding-left: 10px;
    padding-right: 36px;
}

.input--search::placeholder {
    font-size: 8px !important;
    font-style: Roboto Italic;
}
/* End: Search input */
.input--filter {
 /*    pointer-events: none; */
}

.input--filter::selection {
    background-color: white;
}


/* Được dùng cho dữ liệu nhập số */
.input--textright {
    text-align: right;
}

/* Được dùng cho modal */
.input--haveicon {
    padding-right: 36px;
}

input[type="date"]::-webkit-calendar-picker-indicator {
    position: relative;
    padding: 6px;
    width: 16px;
    height: 17px;
    right: 0.8px;
    cursor: pointer;
}

input[type="date"]::-webkit-calendar-picker-indicator:hover {
    background-color: rgb(224, 224, 224);
    border-radius: 2px;
}

input[type="radio"] {
    accent-color: #2ca01c;
    width: 18px;
    height: 18px;
    position: relative;
    top: -2px;
    outline-color: #a2f897;
}

.input__text--error {
    position: absolute;
    color: #ed4337;
    font-size: 10px;
    margin-top: 4px;
}

.input--quantity {
    position: relative;
}

.input--modal {
    font-size: 14px;
}

.input--page {
    width: 200px !important;
    text-overflow: ellipsis;
    display: flex;
    flex-grow: 1;
}

.input--220 {
    width: 200px !important;
}

.input--174 {
    width: 174px !important;
}

.icon {
  background-image: url("@/assets/img/Sprites.64af8f61.svg");
  background-repeat: no-repeat;
  display: block;
  cursor: pointer;
}

.icon--caretdown {
  background-position: -560px -359px;
  width: 16px;
  height: 16px;
  transform: rotate(0deg);
  transition: transform .15s linear;
}

.icon--caretdownRotate {
  transform: rotate(180deg);
}

</style>
