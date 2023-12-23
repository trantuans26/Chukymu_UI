<template>
    <div class="v-input" tabindex="-1" :class="className">
        <!-- Label for input -->
        <div class="v-input__label" v-if="label">
            <v-tooltip :content="tooltipText" :position="tooltipPosition">
                <label @click="handleInputFocus">
                    <!-- :tooltip="tooltipText" :position="tooltipPosition" -->
                    {{ label }} <span v-if="required"> * </span>
                </label>
            </v-tooltip>

        </div>
        <div class="v-input__input" :class="inputClass" :tooltip="`${isShowErrorMessage && error ? errorMess : ''}`"
            :error="error">
            <!-- Base for radio and checkbox -->
            <input ref="input" v-if="type === 'checkbox' || type === 'radio'" :type="type" :class="[{ error: error }]"
                :id="id" :value="value" :disabled="disabled" :style="style" v-model="tempValue"
                :tabindex="type === 'radio' ? (modelValue == value ? 0 : -1) : tabIndex" />
            <!-- Base for text area -->
            <textarea ref="input" v-else-if="type === 'textarea'" :class="[{ error: error }]" :id="id"
                :disabled="disabled" :style="style" :tabindex="tabIndex" :rows="rows" :placeholder="placeholder"
                autocomplete="off" spellcheck="false" @focus="handleInputFocus" @click="hideErrorMessage"
                v-model="tempValue" @mouseover="showErrorMessage" @mouseleave="hideErrorMessage"
                @focusout="handleInputFocusOut"></textarea>
            <!-- Base for input type is text -->
            <input  ref="input" v-else-if="type === 'password'"
                type="password"
                :placeholder="placeholder"
                :class="[{ error: error }, { 'v-input__outline': outline }]" :id="id" :disabled="disabled"
                :tabindex="tabIndex" autocomplete="off" spellcheck="false" @focus="handleInputFocus"
                :style="[style, { textAlign: type === 'number' ? 'right' : 'left' }]" @focusout="handleInputFocusOut"
                :value="valueHeader" @click="hideErrorMessage" @mouseover="showErrorMessage" @input="handleInput"
                :data-error="`${error ?  errorMess : ''}`"
                @mouseleave="hideErrorMessage" @keydown="handleKeyDown" />
            <input v-else ref="input" :placeholder="placeholder"
                :class="[{ error: error }, { 'v-input__outline': outline }]" :id="id" :disabled="disabled"
                :tabindex="tabIndex" autocomplete="off" spellcheck="false" @focus="handleInputFocus"
                :style="[style, { textAlign: type === 'number' ? 'right' : 'left' }]" @focusout="handleInputFocusOut"
                :value="valueHeader" @click="hideErrorMessage" @mouseover="showErrorMessage" @input="handleInput"
                :data-error="`${error ?  errorMess : ''}`"
                :maxlength="maxLength ? maxLength : 255"
                @mouseleave="hideErrorMessage" @keydown="handleKeyDown" />
            <!-- Label custom for checkbox -->
            <label class="v-input__checkbox" v-if="type === 'checkbox'" @click="$refs.input.click()">
                <label class="label_custom" v-if="label_custom">{{ label_custom }}</label>
            </label>
            <!-- Label custome for radio -->
            <label class="v-input__radio" v-if="type === 'radio'" @click="$refs.input.click()">
                <label class="label_custom">{{ label_custom }}</label>
            </label>
            <!-- Icon for input -->
            <div class="v-input__icon" v-if="icon">
                <div :class="icon"></div>
                <slot name="icon"></slot>
            </div>
        </div>
    </div>
</template>
<script>
import Validate from "@/utils/validate";
import format from "@/utils/format";
/* eslint-disable */
export default {
    name: "VInput",
    props: {
        label: {
            // Label for input
            type: String,
            default: "",
        },
        label_custom: {
            // Label custom for checkbox and radio
            type: String,
            default: "",
        },
        placeholder: {
            // Placeholder for input
            type: String,
            default: "",
        },
        icon: {
            // Icon for input
            type: String,
            default: "",
        },
        className: {
            // Class for input
            type: String,
            default: "",
        },
        type: {
            // Type for input
            type: String,
            default: "text",
        },
        rows: {
            // Rows for textarea
            type: Number,
            default: 2,
        },
        id: {
            // Id for input
            type: String,
            required: false,
            default: null,
        },
        name: {
            // Name for input
            type: String,
            required: false,
            default: null,
        },
        modelValue: {
            // Value for input
            required: false,
            default: null,
        },
        required: {
            // Required for input
            type: Boolean,
            required: false,
            default: false,
        },
        styleProps: {
            // Style for input
            type: Array,
            required: false,
            default: () => [],
        },
        outline: {
            // Outline for input
            type: Boolean,
            required: false,
            default: false,
        },
        disabled: {
            // Disabled for input
            type: Boolean,
            required: false,
            default: false,
        },
        value: {
            // Value for checkbox and radio
            required: false,
        },
        focus: {
            // Focus for input
            type: Boolean,
            required: false,
            default: false,
        },
        inputClass: {
            // Class for input
            type: String,
            required: false,
        },
        tabIndex: {
            // Tabindex for input
            type: Number,
            required: false,
            default: 0,
        },
        errorLabel: {
            // Error label for input
            type: String,
            required: false,
        },
        isEmail: {
            // Email for input
            type: Boolean,
            required: false,
            default: false,
        },
        isPhoneNumber: {
            // Phone number for input
            type: Boolean,
            required: false,
            default: false,
        },
        isPercent: {
            // Percent for input
            type: Boolean,
            required: false,
            default: false,
        },
        isNumber: {
            // Number for input
            type: Boolean,
            required: false,
            default: false,
        },
        minLength: {
            // Min length for input
            type: Number,
            required: false,
            default: 0,
        },
        maxLength: {
            // Max length for input
            type: Number,
            required: false,
            default: 0,
        },
        minNumber: {
            // Min number for input
            type: Number,
            required: false,
            default: 0,
        },
        maxNumber: {
            // Max number for input
            type: Number,
            required: false,
            default: 0,
        },
        validateCheck: {
            // Validate check for input
            type: Boolean,
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
            default: 'right',
        },
        isNegative: {
            // Negative for input
            type: Boolean,
            required: false,
            default: false,
        },

    },
    data() {
        return {
            error: false, // có hiển thị lỗi hay không
            errorMess: "", // nội dung lỗi
            isShowErrorMessage: false, // trạng thái hiển thị lỗi
            isChange: false, // trạng thái thay đổi,
            valueHeader: '', // giá trị header
        };
    },
    computed: {
        /**
         * @description: Tạo style cho input
         * Author: tttuan 14/09/2022
         */
        style() {
            let styleProps = {};
            if (this.styleProps.length > 0) {
                this.styleProps.forEach((item) => {
                    const key = item.split(":")[0];
                    const value = item.split(":")[1];
                    styleProps[key] = value;
                });
                return styleProps;
            } else {
                return {};
            }
        },
        /**
         * @description: Giá trị để emit về cho component cha
         * Author: tttuan 14/09/2022
         */
        tempValue: {
            get() {
                return this.modelValue;
            },
            set(value) {
                const self = this;
                self.isChange = true;
                let temp = value;
                if (!Validate.isNullOrEmpty(value)) { // nếu value rỗng thì set value = null
                    temp = null;
                }
                self.$emit("update:modelValue", temp);
                if (self.validateCheck || self.required) {
                    // nếu validateCheck = true thì validate cho trường dữ liệu không bắt buộc nhưng cố tình nhập sai
                    self.errorMess = "";
                    self.$nextTick(() => {
                        // sau khi set giá trị thì kiểm tra validate
                        self.validate();
                    });
                }
            },
        },

    },
    watch: {
        /**
         * @description: Khi giá trị thay đổi thì gán vào valueHeader
         * Author: tttuan 14/09/2022
         */
        modelValue: {
            handler(value) {
                if (this.type == 'number') {
                    if (!Validate.isNullOrEmpty(value)) return;
                    this.valueHeader = format.formatNumberShow(value);
                } else {
                    this.valueHeader = value;
                }
            },
            immediate: true,
        },
    },
    methods: {

        numbersOnly(evt) {
            evt = (evt) ? evt : window.event;
            var charCode = (evt.which) ? evt.which : evt.keyCode;
            if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
                evt.preventDefault();
            } else {
                return true;
            }
        },

        /**
         * @description: Hàm này dùng để xứ lý khi nhập vào input
         * @param: {any} 
         * Author: tttuan 04/11/2022
         */
        handleInput(e) {
            const self = this;
            if (self.type == 'number') {
                if (!self.isNegative) {
                    e.target.value = e.target.value.replace(/[^0-9.,]/g, ''); // replace các ký tự không phải số
                } else {
                    e.target.value = e.target.value.replace(/[^0-9.,-]/g, ''); // replace các ký tự không phải số
                }
                if (e.target.value.includes(',')) {
                    const arr = e.target.value.split(',');
                    if (arr[1].length > 2) { // nếu số thập phân lớn hơn 2 thì bỏ đi
                        e.target.value = arr[0] + ',' + arr[1].substring(0, 2);
                    }
                }
                // nếu giá trị cuối cùng là dấu chấm thì xóa đi
                if (e.target.value[e.target.value.length - 1] == '.') {
                    e.target.value = e.target.value.substring(0, e.target.value.length - 1);
                }
                // nếu có dấu phẩy đầu tiên và chuỗi rỗng thì thêm 0 vào trước dấu phẩy
                if (e.target.value.includes(',') && e.target.value.indexOf(',') == 0) {
                    e.target.value = '0' + e.target.value;
                }
                let reverseString = format.reverseFormatNumber(e.target.value, 'vi-VN'); // đảo chuỗi thành số
                if (!isNaN(reverseString) && reverseString != '') {
                    if (self.minNumber || self.maxNumber) {
                        if (reverseString > self.maxNumber) { // nếu lớn hơn max thì gán lại bằng tempValue
                            e.target.value = format.formatNumberShow(self.tempValue, 2);
                            return;
                        }
                    }
                    self.tempValue = Number(reverseString); // set giá trị cho modelValue
                    if (e.target.value.includes(',')) {
                        self.valueHeader = format.formatNumberShow(reverseString, e.target.value.split(',')[1].length);
                    } else {
                        self.valueHeader = format.formatNumberShow(reverseString, 0);
                    }
                } else {
                    self.tempValue = null;
                    self.valueHeader = '';
                }
            } else {
                self.tempValue = e.target.value;
            }
        },
        /**
         * @description: Hàm này dùng để xử lý khi nhập vào input
         * @param: {any} 
         * Author: tttuan 05/11/2022
         */
        handleKeyDown(e) {
            const self = this;
            if (self.type == 'number') {
                // nếu e.target.value đã có dấu , thì chặn không cho nhập thêm dấu phẩy
                if ((e.key == ',' || e.key == '.') && e.target.value.includes(',')) {
                    e.preventDefault();
                }
                // thay thế dấu . thành dấu ,
                if (e.key == '.' && !e.target.value.includes(',')) {
                    e.target.value = e.target.value + ',';
                }
                if (self.isNegative) {
                    // nếu e.target.value đã có dấu - thì chặn không cho nhập thêm dấu -
                    if (e.key == '-' && e.target.value.includes('-')) {
                        e.preventDefault();
                    }
                }
            }
        },

        /**
         * @description: Hàm này dùng để show errorMessage từ bên ngoài
         * @param: {any} 
         * Author: tttuan 09/11/2022
         */
        handleShowErrorMessage(message) {
            this.error = true;
            this.errorMess = message;
            this.isShowErrorMessage = true;
        },

        /**
         * @description: showErrorMessage cho tooltip khi hover vào input
         * Author: tttuan 14/09/2022
         */
        showErrorMessage() {
            if (this.error) {
                this.isShowErrorMessage = true;
            }
        },
        /**
         * @description: hideErrorMessage cho tooltip khi hover vào input
         * Author: tttuan 14/09/2022
         */
        hideErrorMessage() {
            this.isShowErrorMessage = false;
        },
        /**
         * @description: Hàm này dùng để bắt sự kiện blur của input nếu input rỗng thì sẽ hiển thị lỗi
         * @param: {any}
         * Author: tttuan 27/09/2022
         */
        validate() {
            const self = this;
            let errorLabel = self.errorLabel;
            let value = self.modelValue;
            if ((!self.required && Validate.isNullOrEmpty(value)) || self.required) {
                if (!Validate.isNullOrEmpty(value)) {
                    self.errorMess = this.$t("validate_error.required", [errorLabel]);
                    self.error = true;
                    self.isShowErrorMessage = true;
                    return;
                } else if (self.isEmail && !Validate.isEmail(value)) {
                    self.errorMess = this.$t("validate_error.invalid", [errorLabel]);
                    self.error = true;
                    self.isShowErrorMessage = true;
                    return;
                } else if (self.isPhoneNumber && !Validate.isPhoneNumber(value)) {
                    self.errorMess = this.$t("validate_error.invalid_phone_number", [errorLabel]);
                    self.error = true;
                    self.isShowErrorMessage = true;
                    return;
                } else if (self.isNumber && !Validate.isNumber(value)) {
                    self.errorMess = this.$t("validate_error.invalid_number", [errorLabel]);
                    self.error = true;
                    self.isShowErrorMessage = true;
                    return;
                } else if (self.maxLength > 0 && !Validate.isLength(value, 0, self.maxLength)) {
                    self.errorMess = this.$t("validate_error.max_length", [errorLabel, self.maxLength]);
                    self.error = true;
                    self.isShowErrorMessage = true;
                    return;
                } else if (self.minLength > 0 && !Validate.isLength(value, self.minLength)) {
                    self.errorMess = this.$t("validate_error.min_length", [errorLabel, self.minLength]);
                    self.error = true;
                    self.isShowErrorMessage = true;
                    return;
                } else {
                    self.error = false;
                    self.isShowErrorMessage = false;
                }
            } else {
                self.error = false;
                self.isShowErrorMessage = false;
            }
        },
        /**
         * @description: Hàm này dùng để focus vào input
         * Author: tttuan 20/10/2022
         */
        handleInputFocus() {
            try {
                this.$refs.input.focus();
            } catch (e) {
            }

        },
        /**
         * @description: Hàm này dùng để validate khi input blur
         * Author: tttuan 25/10/2022
         */
        handleInputFocusOut() {
            const self = this;
            if (this.type == 'number') {
                if (self.tempValue != null && Number(self.tempValue) > 0) {
                    this.valueHeader = format.formatNumberShow(self.tempValue, 2);
                }
            }
            if (self.required || self.validateCheck) { // validate khi input đã thay đổi
                self.validate();
                self.$emit('validate', { error: self.error, errorMess: self.errorMess });
            }
        },
        /**
         * @description: Hàm này dùng để reset lại input
         * @param: {any} 
         * Author: tttuan 25/10/2022
         */
        handleResetValue() {
            this.error = false;
            this.errorMess = "";
            this.isShowErrorMessage = false;
        },

    },
    created() {
        // nếu props focus là true thì đợi dom render xong sau đó focus vào
        if (this.focus) {
            this.$nextTick(() => {
                this.handleInputFocus();
            });
        }
    },

};
</script>
<style scoped lang="scss">
@import "@/assets/scss/base/input.scss";
</style>
