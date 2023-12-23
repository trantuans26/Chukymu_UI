<template>
    <div class="v-date__picker" :tooltip="`${isShowErrorMessage && error ?  errorMess : ''}`">
        <div class="v-input__label" v-if="label">
            {{ label }} <span v-if="required"> * </span>
        </div>
        <date-picker :required="required" pickerType="date" format="DD/MM/yyyy" :locale="locale" :allowClear="true"
            v-model:value="defaultPickerValue" @focus="onHandleBorder" @blur="onHandleBorder">
            <template #nextIcon>
                <div class="ms-24 ms-icon ms-icon-arrow-right"></div>
            </template>
            <template #superNextIcon>
                <div class="ms-24 ms-icon ms-icon-arrow-right"></div>
            </template>
            <template #prevIcon>
                <div class="ms-24 ms-icon ms-icon-arrow-left"></div>
            </template>
            <template #superPrevIcon>
                <div class="ms-24 ms-icon ms-icon-arrow-left"></div>
            </template>
            <template #suffixIcon>
                <div class="ms-30 d-flex align-items-center justify-content-center">
                    <div class="ms-24 ms-icon ms-icon-datepicker"></div>
                </div>
            </template>
        </date-picker>
    </div>
</template>

<script>
import DatePicker from 'ant-design-vue/es/date-picker/moment';
import "ant-design-vue/lib/date-picker/style/css";
import locale from "ant-design-vue/lib/date-picker/locale/vi_VN"; // gọi locale tiếng việt cho datepicker
import moment from 'moment'; // gọi moment để format date
import { formatDate } from '@/utils/format'; // gọi hàm format date
import Validate from '@/utils/validate'; // gọi hàm validate
locale.lang = { // format lại locale cho datepicker
    ...locale.lang,
    monthFormat: "MMMM",
    dateFormat: "DD/MM/yyyy",
    dayFormat: "DD",
    placeholder: "DD/MM/YYYY",
}

export default {
    name: "VDatePicker",
    components: {
        DatePicker
    },
    props: {
        label: {
            type: String,
            default: "",
        },
        required: {
            type: Boolean,
            default: false,
        },
        modelValue: {
            required: false,
        },
        errorLabel: {
            type: String,
            required: false,
        },
        isLessThanToday: {
            type: Boolean,
            default: false,
        },
        isLessThanValue: {
            type: String,
            default: "",
        },
        isLessThanValueLabel: {
            type: String,
            default: "",
        },
        isSubmit: {
            type: Boolean,
            default: false,
        },
        validateCheck: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    data() {
        return {
            locale,
            defaultPickerValue: this.modelValue ? moment(formatDate(this.modelValue), 'DD/MM/YYYY') : null,
            error: false, // Hiển thị lỗi
            errorMess: "", // Nội dung lỗi
            isShowErrorMessage: false, // Hiển thị nội dung lỗi
        };
    },
    watch: {
        /**
        * @description: theo giõi isLessThanValue để hiển thị lỗi
        * Author: tttuan 13/10/2022
        */
        isLessThanValue: {
            handler(newVal) {
                if (newVal && this.defaultPickerValue) {
                    this.validate();
                }
            },
            deep: true,
        },
        /**
         * @description: theo giõi nếu vmodel thay đổi thì thay đổi giá trị defaultPickerValue
         * Author: tttuan 08/10/2022
         */
        modelValue: {
            handler: function (newVal) {
                const self = this;
                if (newVal) {
                    self.defaultPickerValue = moment(formatDate(newVal), 'DD/MM/YYYY');
                } else {
                    self.defaultPickerValue = null;
                }
            },
            deep: true,
        },
        /**
         * @description: theo giõi form submit để hiển thị lỗi
         * Author: tttuan 08/10/2022
         */
        isSubmit: {
            handler(isSubmit) {
                if (isSubmit) {
                    this.validate();
                }
            },
            deep: true,
        },
        /**
         * @description: theo giõi nếu defaultPickerValue thay đổi thì validate và emit value lên v-model
         * @param {*} valueBinding  
         * Author: tttuan 13/10/2022
         */
        defaultPickerValue: {
            handler: function (valueBinding) {
                if (valueBinding) {
                    this.$emit("update:modelValue", moment(valueBinding).format("YYYY-MM-DD"));
                } else {
                    this.$emit("update:modelValue", null);
                }
                if (this.validateCheck) {
                    this.errorMess = "";
                    this.$nextTick(() => { // đợi cho update lên model value xong rồi mới kiểm tra
                        this.validate();
                    });
                }
            },
            deep: true,
        },

    },
    methods: {
        /**
         * @description: Hàm này dùng để validate dữ liệu trước khi truyền ra ngoài
         * Author: tttuan 08/10/2022
         */
        validate() {
            const self = this;
            let errorLabel = self.errorLabel;
            let picker = this.$el.getElementsByClassName("ant-picker")[0];
            let pickerInput = picker.getElementsByTagName("input")[0];
            pickerInput.removeAttribute("title");
            if ((!self.required && Validate.isNullOrEmpty(self.modelValue)) || self.required) {
                if (self.isLessThanToday && !moment().isAfter(self.defaultPickerValue)) {
                    self.errorMess = self.$t("validate_error.over_current_date", [errorLabel]);
                    self.isShowErrorMessage = true;
                    self.error = true;
                    picker.classList.add("error");
                    picker.setAttribute("data-error", self.errorMess);
                    return false;
                } else if (self.isLessThanValue && moment(self.isLessThanValue).isAfter(self.defaultPickerValue)) {
                    self.errorMess = self.$t("validate_error.less_value", [errorLabel, self.isLessThanValueLabel]);
                    self.isShowErrorMessage = true;
                    self.error = true;
                    picker.classList.add("error");
                    picker.setAttribute("data-error", self.errorMess);
                    return false;
                } else if (!Validate.isNullOrEmpty(self.modelValue)) {
                    self.errorMess = self.$t("validate_error.required", [errorLabel])
                    self.isShowErrorMessage = true;
                    self.error = true;
                    picker.classList.add("error");
                    picker.setAttribute("data-error", self.errorMess);
                    return false;
                } else {
                    self.errorMess = "";
                    self.isShowErrorMessage = false;
                    self.error = false;
                    picker.classList.remove("error");
                    picker.removeAttribute("data-error");
                    return true;
                }
            } else {
                self.errorMess = "";
                self.isShowErrorMessage = false;
                self.error = false;
                picker.classList.remove("error");
                picker.removeAttribute("data-error");
            }
        },
        /**
         * @description: Hàm này dùng để hiển thị lỗi
         * Author: tttuan 13/10/2022
         */
        onHandleBorder() {
            const self = this;
            this.$nextTick(() => {
                let picker = self.$el.getElementsByClassName("ant-picker")[0];
                if (self.error) {
                    picker.classList.add("error");
                } else {
                    picker.classList.remove("error");
                }
            });

        },
    },
};
</script>

<style lang="scss" >
@import "@/assets/scss/base/datepicker.scss";
</style>