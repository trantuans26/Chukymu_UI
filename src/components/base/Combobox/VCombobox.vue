<template>
    <div class="v-combobox" @keydown="handleSelectItemUpDown" v-click-outside="handleClickOutside" :class="[className]"
        ref="v-combobox">
        <v-tooltip :content="tooltipText" :position="tooltipPosition">
            <div class="v-input__label" v-if="label" @click="handleShowListData">
                {{ label }} <span v-if="required">*</span>
            </div>
        </v-tooltip>
        <div class="v-combobox__body" ref="combobox">
            <div class="v-combobox__selected" :class="[{ error: error }, { 'v-combobox__focus': isFocus }]"
                :tooltip="showError" :error="error">
                <!-- Combobox multiple value thì cần thêm khoảng để hiển thị nhiều giá trị -->
                <div v-if="mode === 'multiple'" class="v-combobox__multi-select">
                    <div class="v-combobox__selection-item" v-for="(item, index) in selectedItems" :key="index">
                        <v-tooltip :content="item[propTooltip]">
                            <span>{{ replaceText(item[propValue]) }}</span>
                        </v-tooltip>
                        <div class="ms-16 ms-icon-v2 ms-icon-close-small" @click="handleRemoveItem(item)"></div>
                    </div>
                    <input ref="input" type="text" :value="textInput" :placeholder="placeholder" autocomplete="off"
                        spellcheck="false" @input="handleInput" @focus="handleInputFocus" @blur="handleBlurInput"
                        :readonly="selectBox" />
                </div>
                <!-- Combobox thường thì chỉ cần input để gõ text -->
                <input v-else ref="input" type="text" :value="textInput" :placeholder="placeholder" @input="handleInput"
                    @blur="handleBlurInput" autocomplete="off" spellcheck="false" @focus="handleInputFocus"
                    :readonly="selectBox" />
                <!-- Thêm button add nhanh vào combobox -->
                <div v-if="add" class="v-combobox__icon v-combobox__add" @click="handleHideListData(), $emit('add')">
                    <div class="ms-16 ms-icon ms-icon-plus-success"></div>
                </div>
                <!-- Button show list -->
                <div class="v-combobox__icon" @click="handleShowListData">
                    <div :class="iconUpDown">
                    </div>
                </div>
            </div>
            <Teleport to="body">
                <div class="v-select__content" ref="content" v-if="isShowListData">
                    <!-- Khu vực hiển thị header (nếu có)  -->
                    <div class="v-select__header" v-if="hasHeader">
                        <div class="v-select__item" v-for="(item, index) in columns " :key="index"
                            :style="[{ maxWidth: item.width }, { width: item.width }]">
                            {{ item.title }}
                        </div>
                    </div>
                    <!-- Khu vực hiển thị body -->
                    <div class="v-select__body">
                        <div class="v-select__list" ref="list">
                            <div class="v-select__items" v-for="(option, index) of filterData" :key="index"
                                @click="handleSelectItem(option, index, true)"
                                :class="[{ 'v-select__hover': index == indexItemFocus }, { 'v-select__focus': option[propKey] === keyItemSelected && mode != 'multiple' }]">
                                <div v-if="hasHeader" class="v-select__item">
                                    <div class="v-select__item--content" v-for="(item, index) in columns" :key="index"
                                        :style="[{ maxWidth: item.width }, { width: item.width }]">
                                        <div class="v-select__item--text" v-html="option[item.key]"></div>
                                    </div>
                                </div>
                                <div v-else class="v-select__item">
                                    <div class="v-select__item--content">
                                        {{ option[propValue] }}
                                    </div>
                                </div>
                                <div class="v-select__item--selected"
                                    v-if="selectedItemsKey.includes(option[propKey]) && mode === 'multiple'">
                                    <div class="ms-16 ms-icon-v2 ms-icon-selected-small"></div>
                                </div>
                            </div>
                        </div>
                        <!-- Khu vực hiển thị dữ liệu trống -->
                        <div v-if="filterData.length == 0" class="v-select__list">
                            <div class="v-select__empty">
                                Không có dữ liệu hiển thị
                            </div>
                        </div>
                    </div>
                    <!-- Khu vực hiển thị footer -->
                    <div v-if="footer" class="v-select__footer">
                        <slot name="footer"></slot>
                    </div>
                </div>
            </Teleport>
        </div>
    </div>
</template>
<script>
/* eslint-disable */
import { removeVietnameseTones, createArrayTreeName } from '@/utils/format';
import Validate from '@/utils/validate';
import axios from 'axios';
import Enum from '@/utils/enum';
const keycode = Enum.KEY_CODE;
export default {
    name: "VCombobox",
    props: {
        data: { // Danh sách dữ liệu
            type: Array,
            required: false
        },
        footer: { // Footer của combobox
            type: Boolean,
            default: false
        },
        className: { // Class của combobox
            type: String,
            default: ''
        },
        columns: { // Các cột của combobox
            type: Array,
            default: () => []
        },
        placeholder: { // Placeholder của input
            type: String,
            required: false,
            default: "",
        },
        position: { // Vị trí hiển thị danh sách dữ liệu
            type: String,
            required: false,
            default: "bottom",
        },
        label: { // Label của combobox
            type: String,
            required: false,
            default: null,
        },
        add: { // Thêm mới dữ liệu
            type: Boolean,
            required: false,
            default: false,
        },
        required: { // Bắt buộc nhập
            type: Boolean,
            required: false,
            default: false,
        },
        selectBox: { // Nếu là select box thì không cho gõ text
            type: Boolean,
            required: false,
            default: false,
        },
        modelValue: { // Giá trị của combobox
            required: false,
            default: null,
        },
        propKey: { // Key của dữ liệu
            required: false,
            default: "key",
        },
        propValue: { // Value của dữ liệu
            required: false,
            default: "value",
        },
        propTooltip: { // Tooltip của dữ liệu
            required: false,
        },
        propApi: { // Nếu có api thì lấy dữ liệu từ api
            type: String,
            required: false,
            default: null,
        },
        errorLabel: { // Hiển thị lỗi
            required: false,
        },
        width: { // Chiều rộng của combobox
            required: false,
            default: "100%",
        },
        mode: { // Chế độ combobox
            required: false,
            default: "single",
        },
        focus: { // Focus vào combobox
            required: false,
            default: false,
        },
        tooltipText: {
            // tooltip text
            type: String,
            required: false,
        },
        tooltipPosition: {
            // tooltip position
            type: String,
            required: false,
            default: "right",
        },
        addNew: {
            // add new
            type: Boolean,
            required: false,
            default: false,
        },
        additionValue: { // chấp nhận add thêm giá trị mới vào combobox nếu không có trong data hay không
            type: Boolean,
            required: false,
            default: false,
        },
        additionObject: { // chấp nhận add thêm giá trị mới vào combobox nếu không có trong data hay không
            type: Object,
            required: false,
            default: () => { }
        },
        tree: {
            type: Object,
            required: false,
            default: () => { }
        },
    },
    data() {
        return {
            isShowListData: false, // Hiển thị danh sách dữ liệu
            indexItemFocus: -1, // index của item được focus
            indexItemSelected: -1, // index của item được chọn
            keyItemSelected: this.modelValue, // key của item được chọn
            textInput: "", // Giá trị của input
            // BIẾN DÙNG LƯU DỮ LIỆU
            dataApi: [], // dữ liệu lấy từ api
            filterData: [], // dữ liệu lọc
            // BIẾN DÙNG CHO HIỂN THỊ LỖI VALIDATE
            error: false, // Hiển thị lỗi
            errorMess: "", // Nội dung lỗi
            // BIẾN DÙNG CHO MULTIPLE OPTION
            selectedItems: [], // Danh sách item được chọn (là text)
            selectedItemsKey: [], // Danh sách item được chọn (là key)
            isFocus: false, // Biến kiểm tra combobox có được focus hay không
        };
    },
    computed: {
        /**
         * @description: Hàm này đùng để hiển thị error
         * @param: {any} 
         * Author: tttuan 01/11/2022
         */
        showError() {
            return !this.isShowListData && this.error ? this.errorMess : '';
        },
        /**
         * @description: kiểm tra xem combobox có header hay không
         * @param: {any} 
         * Author: tttuan 01/11/2022
         */
        hasHeader() {
            return this.columns.length > 0;
        },
        /**
         * @description: Hàm này dùng để thay đổi icon khi combobox được mở hoặc đóng
         * @param: {any} 
         * Author: tttuan 01/11/2022
         */
        iconUpDown() {
            return `ms-16 ms-icon ms-icon-arrow-down-black ${this.isShowListData ? "arrrow-dropdown-open" : "arrrow-dropdown-close"}`;
        },
        /**
        * @description: Reactivity cho combobox
        * Author: tttuan 25/10/2022
        */
        tempValue: {
            get() {
                return this.modelValue;
            },
            set(value) {
                const self = this;
                self.$emit("update:modelValue", value);
                if (self.required) {
                    // nếu validateCheck = true thì validate cho trường dữ liệu không bắt buộc nhưng cố tình nhập sai
                    self.errorMess = "";
                    self.$nextTick(() => {
                        // sau khi set giá trị thì kiểm tra validate
                        self.validate(value);
                        this.$emit('validate', { error: self.error, errorMess: self.errorMess });
                    });
                }
            },
        },
    },
    watch: {
        /**
         * @description: Theo giõi nếu có một object mới truyền vào thì thêm vào data và chọn nó
         * @param: {any} 
         * Author: tttuan 04/11/2022
         */
        additionObject: {
            handler: function (value) {
                if (value) {
                    this.dataApi.unshift(value);
                    if (this.mode == 'single') {
                        // lấy ra index của item được chọn
                        let index = this.dataApi.findIndex(item => item[this.propKey] == value[this.propKey]);
                        this.handleSelectItem(value, index, true);
                    } else {
                        this.handleSelectItem(value);
                    }
                }
            },
            deep: true,
        },
        /**
         * @description: Nếu data bên component cha thay đổi thì sẽ lấy dữ liệu mới
         * Author: tttuan 14/10/2022
         */
        data: {
            handler(newData) {
                this.dataApi = newData;
                this.filterData = newData;
                if (this.indexItemSelected > -1) {
                    this.textInput = newData[this.indexItemSelected][this.propValue];
                }
            },
            deep: true,
        },
        /**
         * @description: Hàm này dùng để reset lại combobox khi dữ liệu bên component cha thay đổi
         * @param: {any} 
         * Author: tttuan 01/11/2022
         */
        modelValue: {
            handler(newData) {
                if (newData === null) {
                    // blur ra khỏi combobox trước khi validate
                    if (this.required) {
                        this.$refs.input.blur();
                    }
                    this.handleResetCombobox();
                } else {
                    this.loadData();
                }
            },
            deep: true,
        },
        /**
         * @description: showError tính lại vị trí tooltip 
         * @param: {any} 
         * Author: tttuan 04/11/2022
         */
        showError: {
            handler(newData) {
                if (newData) {
                    let after = this.$el.querySelector('.error');
                    // kiểm tra content after có dài hơn độ dài của input không
                }
            },
            deep: true,
        },
        /**
         * @description: Hàm này dùng để format lại text input nếu nó là tree 
         * @param: {any} 
         * Author: tttuan 11/11/2022
         */
        textInput: {
            handler(newData) {
                if (this.tree) {
                    this.textInput = this.replaceText(newData);
                }
            },
            deep: true,
        },
    },
    methods: {
        /**
         * @description: Hàm này dùng để replace &npsp; và thẻ <b> thành khoảng trắng
         * @param: {any} 
         * Author: tttuan 10/11/2022
         */
        replaceText(text) {
            try {
                return text.replace(/&nbsp;/g, ' ').replace(/<b>/g, '').replace(/<\/b>/g, '').trim();
            } catch (error) {
                return text;
            }
        },
        /**
         * @description: nạp dữ liệu vào combobox
         * @param: {any} 
         * Author: tttuan 07/11/2022
         */
        loadData() {
            const self = this;
            if (self.mode === 'single') {
                const index = self.dataApi.findIndex((item) => item[self.propKey] === self.modelValue); // Tìm index của item có key trùng với giá trị mặc định
                if (index !== -1) { // Nếu tồn tại item có key trùng với giá trị mặc định\
                    self.handleSelectItem(self.dataApi[index], index); // Lấy dữ liệu của item được focus
                    self.$emit("update:textInput", self.dataApi[index][self.propValue]); // Cập nhật lại textInput
                }
            } else {
                self.selectedItemsKey = self.modelValue || []; // Lấy dữ liệu của item được focus
                self.selectedItems = self.dataApi.filter((item) => self.selectedItemsKey.includes(item[self.propKey])); // Lấy dữ liệu của item được focus
                if (self.selectedItems.length > 0) {
                    self.$emit("update:textInput", self.selectedItems.map(item => self.replaceText(item[self.propValue]).replace(';', '')).join(';'));
                }
            }
            if (self.additionValue) {
                self.textInput = self.modelValue;
            }
        },
        /**
         * @description: Hàm này dùng để set vị trí phù hợp cho combobox nằm dưới hoặc trên input
         * @param: {any} 
         * Author: tttuan 24/10/2022
         */
        setComboboxPosition() {
            const self = this;
            try {
                const menuPosition = self.$refs.combobox.getBoundingClientRect(); // lấy ra vị trí của combobox
                const contentPosition = self.$refs.content.getBoundingClientRect(); // lấy ra vị trí của list content
                if (self.position === 'top') { // nếu position = top thì sẽ set vị trí cho combobox nằm trên input
                    self.$refs.content.style.top = `${menuPosition.top - contentPosition.height - 4}px`;
                } else {
                    if (menuPosition.top + contentPosition.height > window.innerHeight) {
                        // nếu vị trí của combobox + chiều cao của list content > chiều cao của window thì sẽ set vị trí cho combobox nằm trên combobox
                        self.$refs.content.style.top = `${menuPosition.top - contentPosition.height - 4}px`;
                    } else {
                        // ngược lại sẽ set vị trí cho combobox nằm dưới input
                        self.$refs.content.style.top = `${menuPosition.top + menuPosition.height + 4}px`;
                    }
                }
                if (self.width !== 'auto') {
                    // nếu width khác auto thì sẽ set width cho list content
                    self.$refs.content.style.minWidth = `${menuPosition.width}px`
                }
                self.$refs.content.style.left = `${menuPosition.left}px`
            } catch (error) {

            }
        },
        /**
         * @description: Hàm này dùng để hiển thị danh sách khi focus vào
         * @param: {any} 
         * Author: tttuan 01/11/2022
         */
        handleInputFocus() {
            this.isFocus = true;
            this.$refs.input.focus();
        },
        /**
         * @description: Hàm này dùng để validate combobox xem có trống hay không
         * @param {String} giá trị của combobox
         * Author: tttuan 08/10/2022
         */
        validate(value) {
            const self = this;
            if (self.required) {
                if (!Validate.isNullOrEmpty(value)) {
                    self.handleResetCombobox();
                }
                self.error = self.mode === 'multiple' ? self.selectedItemsKey.length === 0 : !Validate.isNullOrEmpty(value);
                if (self.error) {
                    self.errorMess = self.$t("validate_error.required", [self.errorLabel]);
                    return false;
                } else {
                    self.errorMess = "";
                    self.error = false;
                    return true;
                }
            }

        },
        /**
         * @description: Hàm này dùng để xử lý nhập giá trị vào combobox
         * @param: {any} 
         * Author: tttuan 01/11/2022
         */
        handleInput(event) {
            const self = this;
            self.textInput = event.target.value;
            self.filterData = self.dataApi.filter((option) =>
                removeVietnameseTones(option[self.propValue])
                    .toLowerCase()
                    .includes(removeVietnameseTones(self.textInput).toLowerCase())
            );
            self.indexItemFocus = 0;
            if (!self.isShowListData) { // nếu combobox đang đóng thì mở combobox
                self.handleShowListData();
            }
            if (!Validate.isNullOrEmpty(self.textInput) && self.mode === 'single') {
                self.tempValue = null;
                self.$nextTick(() => {
                    self.$refs.input.focus();
                });

            }
        },
        /**
        * @description: Hàm này dùng để xử lý thanh cuộn lên xuống khi focus vào item
        * @param {Number} index của item
        * Author: tttuan 13/10/2022
        */
        handleScroll(indexItemFocus) {
            const self = this;
            try {
                const position = self.$refs['list'].getBoundingClientRect(); // lấy ra vị trí của list content
                const itemHeight = self.$refs['list'].children[0].clientHeight; // lấy ra chiều cao của item
                const itemPosition = self.$refs['list'].children[indexItemFocus].getBoundingClientRect(); // lấy ra vị trí của item
                const itemPositionTop = itemPosition.top; // lấy ra vị trí top của item
                const itemPositionBottom = itemPosition.bottom; // lấy ra vị trí bottom của item
                if (itemPositionTop < position.top) { // nếu vị trí top của item < vị trí top của list content thì sẽ cuộn lên
                    self.$refs['list'].scrollTop -= itemHeight;
                }
                if (itemPositionBottom > position.bottom) { // nếu vị trí bottom của item > vị trí bottom của list content thì sẽ cuộn xuống
                    self.$refs['list'].scrollTop += itemHeight;
                }
                // nếu indexItemFocus = 0 thì sẽ cuộn lên đầu
                if (indexItemFocus <= 0) {
                    self.$refs['list'].scrollTop = 0;
                }
                // nếu indexItemFocus = length - 1 thì sẽ cuộn xuống cuối
                if (indexItemFocus >= self.filterData.length - 1) {
                    self.$refs['list'].scrollTop = self.$refs['list'].scrollHeight;
                }
            } catch (error) {

            }
        },
        /**
         * @description: Hàm này dùng để hiển thị danh sách dữ liệu
         * Author: tttuan - 08/09/2022 
         */
        handleShowListData() {
            const self = this;
            try {
                self.filterData = self.dataApi; // Gán dữ liệu đã lọc bằng dữ liệu từ api
                self.isShowListData = true; // Hiển thị danh sách dữ liệu
                self.$refs.input.focus(); // Focus vào input
                self.$nextTick(() => {
                    // đợi render xong thì set vị trí cho combobox
                    if (self.mode !== 'multiple') {
                        // nếu mode khác multiple và isShowListData = true thì sẽ scroll đến item đang focus
                        if (self.indexItemSelected > -1 && self.isShowListData) {
                            self.indexItemFocus = self.indexItemSelected;
                            self.$refs.list.children[self.indexItemFocus].scrollIntoView({
                                behavior: 'instant',
                                block: 'nearest',
                                inline: 'nearest',
                            });
                        }
                    } else {
                        // nếu mode = multiple thì sẽ không scroll tới những item đã chọn
                        self.indexItemFocus = -1;
                    }
                });
            } catch (error) {
            }
        },
        /**
         * @description: Hàm này dùng để lấy dữ liệu khi click vào item hoặc nhấn enter
         * @param {Object} item - Dữ liệu của item được chọn
         * @param {Number} index - Index của item được chọn
         * Author: tttuan - 08/09/2022 
         */
        handleSelectItem(item, index, isFocus = false) {
            const self = this;
            try {
                if (self.mode === 'multiple') {
                    // nếu mode = multiple thì sẽ thêm item vào list item đã chọn
                    if (self.selectedItemsKey.includes(item[self.propKey])) {
                        // Nếu item đã được chọn mà click lại thì bỏ chọn
                        self.selectedItemsKey.splice(self.selectedItemsKey.indexOf(item[self.propKey]), 1);  // xóa key của item đã chọn
                        self.selectedItems.splice(self.selectedItems.indexOf(item), 1); // xóa item đã chọn (hiển thị trên)
                    } else {
                        // Nếu item chưa được chọn thì thêm vào list item đã chọn
                        self.selectedItemsKey.push(item[self.propKey]); // thêm key của item đã chọn
                        let tempItem = JSON.parse(JSON.stringify(item)); // clone item
                        if (self.tree) {
                            tempItem[self.tree.propName] = self.replaceText(tempItem[self.tree.propName]); // thay thế text
                        }
                        self.selectedItems.push(tempItem); // thêm item đã chọn (hiển thị trên)
                    }
                    self.tempValue = self.selectedItemsKey; // gán giá trị tạm bằng list key của item đã chọn
                    self.$emit("update:textInput", self.selectedItems.map(item => self.replaceText(item[self.propValue]).replace(';', '')).join(';'));
                    self.textInput = null;
                }
                else {
                    const value = item[self.propValue]; // Lấy giá trị của item được chọn
                    self.textInput = value; // Gán giá trị cho textInput
                    self.indexItemSelected = index; // Gán index của item được chọn
                    self.indexItemSelected = index; // Gán index của item được chọn
                    self.indexItemFocus = index; // Gán index vị trí focus của item
                    self.keyItemSelected = item[self.propKey]; // Gán key của item được chọn
                    self.$emit("update:textInput", value); // Emit giá trị của text input
                    self.tempValue = self.keyItemSelected; //  Emit giá trị của item được chọn
                    self.handleHideListData(); // Ẩn danh sách dữ liệu
                }
                if (isFocus) {
                    self.$refs.input.focus();
                }
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * @description: Hàm này dùng để xóa giá trị của combobox (chỉ dùng cho mode multiple)
         * @param {Object} item - Dữ liệu của item được chọn
         * Author: tttuan 24/10/2022
         */
        handleRemoveItem(item) {
            const self = this;
            try {
                self.selectedItemsKey.splice(self.selectedItemsKey.indexOf(item[self.propKey]), 1);
                self.selectedItems.splice(self.selectedItems.indexOf(item), 1);
                // Emit giá trị của item được chọn
                self.tempValue = self.selectedItemsKey;
                self.$refs.input.focus();
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * @description: Hàm này dùng để ẩn đi danh sách dữ liệu
         * Author: tttuan - 08/09/2022 
         */
        handleHideListData() {
            const self = this;
            self.isShowListData = false;
        },
        /**
         * @description: handleClickOutside - Hàm này dùng để ẩn danh sách dữ liệu khi click ra ngoài combobox
         * @param: {any} 
         * Author: tttuan 01/11/2022
         */
        handleClickOutside() {
            const self = this;
            try {
                if (self.isShowListData) {
                    if (event.target.closest('.v-combobox__selection-item') || event.target.closest('.v-select__content')) {
                        return;
                    }
                    self.handleHideListData();
                    self.isFocus = false;
                }
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * @description: Hàm này dùng để xử lý validate khi blur và outfocus
         * Author: tttuan 25/10/2022
         */
        handleBlurInput() {
            const self = this;
            if (!Validate.isNullOrEmpty(self.textInput)) { // Nếu textInput rỗng
                if (self.mode === 'single') {
                    self.tempValue = null;
                }
            } else {
                if (self.mode === 'single') {
                    if (self.additionValue) {
                        self.tempValue = self.textInput;
                        self.indexItemSelected = -1; // Reset lại index item được chọn
                        self.indexItemFocus = 0; // Reset lại index item được focus
                        self.keyItemSelected = null; // Reset lại key item được chọn
                    } else {
                        if (self.indexItemSelected > -1) {
                            self.textInput = self.dataApi[self.indexItemSelected][self.propValue];
                        } else {
                            self.tempValue = null;
                            self.textInput = null;
                        }
                    }
                } else {
                    self.textInput = null;
                }
            }
            if (!self.isShowListData) {
                self.isFocus = false;
            }
        },
        /**
         * @description: Hàm này dùng để chọn item khi nhấn phím mũi tên lên, xuống, enter, esc
         * Author: tttuan - 08/09/2022 
         */
        handleSelectItemUpDown(event) {
            const self = this;
            const keyCodePress = event.keyCode; // Lấy mã phím được nhấn
            try {
                if (self.mode === 'multiple' && self.selectedItems.length > 0 && !Validate.isNullOrEmpty(self.textInput) && keyCodePress == keycode.BACKSPACE) {
                    // Nếu mode = multiple, có item được chọn, text input không rỗng và phím được nhấn là backspace thì xóa item cuối cùng
                    self.selectedItems.splice(self.selectedItems.length - 1, 1);
                    self.selectedItemsKey.splice(self.selectedItemsKey.length - 1, 1);
                    self.tempValue = self.selectedItemsKey;
                }
                if (!self.isShowListData && (keyCodePress == keycode.ARROW_DOWN || keyCodePress == keycode.ARROW_UP)) {
                    // nếu danh sách dữ liệu đang ẩn và nhấn phím mũi tên lên hoặc xuống thì hiển thị danh sách dữ liệu
                    event.preventDefault();
                    self.handleShowListData();
                    return;
                }
                if (keyCodePress == keycode.TAB) {
                    self.handleHideListData(); // Ẩn danh sách dữ liệu
                    self.handleBlurInput(); // Ẩn danh sách dữ liệu
                    return;
                }
                if (keyCodePress == keycode.ESC && self.isShowListData) {
                    event.stopPropagation(); // Ngăn sự kiện click ra ngoài combobox
                    self.handleHideListData(); // Ẩn danh sách dữ liệu
                    return;
                }
                if (self.isShowListData) {
                    switch (keyCodePress) {
                        case keycode.ENTER:
                            event.preventDefault();
                            if (self.filterData.length > 0 && self.indexItemFocus !== -1) {
                                // lấy ra vị trí index của item được chọn trong danh sách dữ liệu
                                const index = self.dataApi.findIndex((item) => item[self.propValue] == self.filterData[self.indexItemFocus][self.propValue]);
                                self.handleSelectItem(self.filterData[self.indexItemFocus], index);
                                if (self.mode !== 'multiple') {
                                    self.handleHideListData();
                                }
                            }
                            break;
                        case keycode.ARROW_DOWN:
                            event.preventDefault();
                            self.indexItemFocus = self.indexItemFocus === self.filterData.length - 1 ? 0 : self.indexItemFocus + 1; // Focus vào item tiếp theo
                            self.handleScroll(self.indexItemFocus);
                            break;
                        case keycode.ARROW_UP:
                            event.preventDefault();
                            self.indexItemFocus = self.indexItemFocus === 0 ? self.filterData.length - 1 : self.indexItemFocus - 1; // Focus vào item trước đó
                            self.handleScroll(self.indexItemFocus);
                            break;
                        default:
                            break;
                    }
                }
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * @description: Hàm này dùng để reset lại combobox
         * Author: tttuan 25/09/2022
         */
        handleResetCombobox() {
            const self = this;
            self.indexItemSelected = -1; // Reset lại index item được chọn
            self.indexItemFocus = -1; // Reset lại index item được focus
            self.keyItemSelected = null; // Reset lại key item được chọn
            self.textInput = null; // Reset lại text input
            if (self.mode === 'multiple') {
                self.selectedItems = []; // Reset lại dữ liệu đã chọn
                self.selectedItemsKey = []; // Reset lại dữ liệu đã chọn
            }
        },
    },
    mounted() {
        window.addEventListener('resize', this.setComboboxPosition);
        const scrollableElements = document.querySelectorAll('.scrollable');
        scrollableElements.forEach((element) => {
            element.addEventListener('scroll', this.handleClickOutside);
        });
    },
    unmounted() {
        window.removeEventListener('resize', this.setComboboxPosition);
        const scrollableElements = document.querySelectorAll('.scrollable');
        scrollableElements.forEach((element) => {
            element.removeEventListener('scroll', this.handleClickOutside);
        });
    },
    updated() {
        const self = this;
        if (self.isShowListData) {
            self.setComboboxPosition();
        }
    },
    /**
     * @description: Hook khởi tạo để gán giá trị vào combo box
     * Author: tttuan 25/09/2022
     */
    async created() {
        const self = this;
        try {
            if (self.propApi && self.dataApi.length === 0) { // Nếu có prop api và dữ liệu api rỗng thì gọi api lấy dữ liệu
                const response = await axios.get(self.propApi);
                if (response.data.success) {
                    const data = response.data.data;
                    if (!self.tree) {
                        self.dataApi = data;
                        self.filterData = data;
                    } else {
                        self.dataApi = createArrayTreeName(data, self.tree.id, self.tree.propName, self.tree.parentId);
                        self.filterData = self.dataApi;
                    }
                }
            }
            if (self.data) { // Nếu có dữ liệu truyền từ component cha thì gán dữ liệu
                if (!self.tree) {
                    self.dataApi = self.data;
                    self.filterData = self.data;
                } else {
                    self.dataApi = createArrayTreeName(self.data, self.tree.id, self.tree.propName, self.tree.parentId);
                    self.filterData = self.dataApi;
                }
            }
            if (self.modelValue != null) { // Nếu có giá trị mặc định truyền từ component cha
                self.loadData();
            }
            if (self.focus) {
                this.$nextTick(() => {
                    self.handleInputFocus();
                });
            }
        } catch (error) {
            console.log(error);
        }
    },

}
</script>
<style lang="scss" scoped>
@import "@/assets/scss/base/combobox.scss";

.v {
    &-combobox__multi-select {
        max-height: unset;
        display: flex;
        flex-basis: 100%;
        flex-grow: 1;
        flex-wrap: wrap;
        align-items: center;
        padding: 0 0 0 0px;
        width: 0 !important;

        input {
            border: none;
            font-size: 13px;
            padding-right: unset;
            text-overflow: ellipsis;
            background-color: transparent;
            width: auto !important;
            min-width: 50px;
            padding: 2px 3px 2px 5px;
        }

    }

    &-combobox__selection-item {
        display: flex;
        align-items: center;
        border: 1px solid #ccc;
        border-radius: 3px;
        background-color: #f0f0f0;
        padding: 2px 3px 2px 5px;
        margin: 3px;
        font-weight: 400;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}


@keyframes slide-fade {
    0% {
        transform: translateY(10px);
        opacity: 0;
    }

    100% {
        transform: translateY(0px);
        opacity: 1;
    }
}

.slide-fade-enter-active {
    animation: slide-fade 0.3s;
}

.slide-fade-leave-active {
    animation: slide-fade 0.3s reverse;
}

.arrrow-dropdown-open {
    transform: rotate(180deg);
    transition: transform .3s linear
}

.arrrow-dropdown-close {
    transform: rotate(0deg);
    transition: transform .3s linear
}
</style>
    