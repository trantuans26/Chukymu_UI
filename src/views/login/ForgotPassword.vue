<template>
    <div>
        <!-- Khu vực hiển thị dialog form thêm hoặc sửa nhân viên -->
        <v-dialog :isShow="modelValue" @close="closeFormHandle">
            <template #title>
                <div class="row e-header">
                    <div class="e-header__title col font-weight-700">
                        {{ $t('forgot_password.title') }}
                    </div>
                </div>
            </template>
            <template #body>
                <div class="grid" ref="employeeForm">
                    <div class="">
                        <div class="col l-8 md-8">
                            <div class="row sm-gutter">
                                <div class="pd__16--bottom form-group col l-8 md-8 c-5 focus" v-show="isLoaded">
                                    <v-skeleton :loading="isLoaded">
                                        <div></div>
                                    </v-skeleton>
                                </div>

                                <div class="pd__16--bottom form-group col l-8 md-8 c-5 focus" v-show="!isLoaded">
                                    <v-input 
                                        :label="$t('forgot_password.email')" v-model="email"
                                        ref="employeeCode" @validate="setValid('email', $event)" :maxLength="100"  
                                        :isEmail="true"  
                                        :required="true" :errorLabel="$t('forgot_password.email')">
                                    </v-input>
                                    <span v-if="content" class="v-tooltip__text" ref="tooltip" :class="isShow ? 'show' : ''">
                                        {{ content }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
            <template #footer__right>
                <v-button @click="saveHandler(Enum.ACTION.SAVE_AND_CLOSE)"
                    :tooltip="$t('forgot_password.reset_password')">
                    {{ $t('forgot_password.reset_password') }}
                </v-button>
            </template>
        </v-dialog>
        <!-- Khu vực hiển thị popup cảnh báo -->
        <v-popup ref="popup" :tabIndex="0"></v-popup>


    </div>
</template>

<script>
import Enum from "@/utils/enum";

export default {
    name: "ForgotPassword",
    props: {
        modelValue: { // dùng để đóng mở form
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            email: null,
            attemptSubmit: true, // biến kiểm tra đã submit form chưa
            Enum: Enum, // dùng để gọi Enum trong template 
            disabledButton: true,
            isLoaded: false,
        };
    },
    computed: {
        /**
         * @description: Get và set trạng thái của form lưu trữ trong store 
         * Author: tttuan 08/10/2022
         */
        formMode: {
            set(val) {
                this.$store.dispatch('setMode', val);
            },
            get() {
                return this.$store.getters.getMode;
            },
        },
        /**
        * @description: Lấy ra các action key (phím tắt) lưu trữ trong store 
        * Author: tttuan 11/10/2022
        */
        action: {
            get() {
                return this.$store.getters.getActionKey;
            },
            set(value) {
                this.$store.commit('setActionKey', value);
            }
        },       
    },

    watch: {
        
    },

    methods: {
        closeFormHandle() {
            this.email = null;
            this.$emit("update:modelValue", false);            
        },

        async forgotPassword() {
            let me = this;
            me.isLoaded = true;

            setTimeout(function() {
                me.isLoaded = false;
                me.email = null;
                me.$emit("update:modelValue", false);
                me.$emit("resetPasswordSuccess", true); 
            }, 1000);

            await me.$api.employee.forgotPassword(me.email);
        },


        setValid(fieldName, valid) {
            console.log(fieldName, valid);
        },
        /**
         * @description: Hàm này dùng để xử lý sự kiện cất
         * @param: {string} action: hành động sau khi cất
         * Author: tttuan 19/09/2022
         */
        async saveHandler() {
            let me = this;
            try {
                me.attemptSubmit = true; // set trạng thái submit
                const validateResult = await me.$nextTick(async () => { // đợi cho khi các ô input validate xong thì mới tìm class error
                    const errorClass = me.$el.querySelectorAll(".error");
                    if (errorClass.length > 0) { // nếu có lỗi thì focus vào phần tử đầu tiên
                        let count = 1;
                        let htmlMessage = Array.from(errorClass).map((item) => {
                            return `${count++}. ${item.getAttribute("data-error")}`;
                        }).join('<br/>');
                        await me.$refs.popup.show({
                            message: htmlMessage,
                            icon: Enum.ICON.ERROR,
                            hideButton: 'true',
                        }).then(() => {
                            me.inputFocus(true);
                        });
                        return false;
                    } else {
                        return true;
                    }
                });
                if (validateResult) {
                    await me.forgotPassword();                    
                }
            } catch (error) {
                if (error.response) {
                    let { status, data } = error.response;
                    if (status == Enum.MISA_CODE.VALIDATE) {
                        let htmlMessage = Object.values(data.moreInfo).map((item) => {
                            return `${item}`;
                        });
                        await me.$refs.popup.showError(htmlMessage);
                    }
                } else {
                    me.$refs.popup.showError(me.$t("notice_message.unknown_error"));
                }
            }
        },
        /**
        * @description: Hàm này dùng để focus vào trường input đầu tiên hoặc là trường lỗi đầu tiên
        * @param: {boolean} isFocusError: có focus vào trường lỗi đầu tiên hay không
        * Author: tttuan 5/3/2023
        */
        inputFocus(isFocusError = false) {
            try {
                let me = this;
                if (isFocusError) {
                    const errorClass = me.$el.querySelector(".error");
                    if (errorClass) {
                        if (errorClass.tagName === "INPUT") {
                            errorClass.focus();
                        }
                        if (errorClass.tagName === "DIV") {
                            errorClass.querySelector("input").focus();
                        }
                    }
                } else {
                    const focusFirst = me.$el.querySelector(".focus").querySelector("input");
                    if (focusFirst) {
                        focusFirst.focus();
                    }
                }
            } catch (error) {
                // console.log(error);
            }
        }
    },
    beforeUnmount() {
        this.formMode = Enum.FORM_MODE.NULL // reset lại formMode
        this.attemptSubmit = false; // reset lại attemptSubmit
        this.$emit("update:modelValue", false); // reset lại modelValue
    },
};
</script>

<style lang="scss" scoped>
.v-dialog__header {
    padding-bottom: 32px;
}

.e-header {
    align-items: center;

    &__title {
        font-size: 24px;
        font-weight: 700;
    }
}

.e-body {
    &__gender {
        height: 32px;
        align-items: center;
    }
}

.v-max-900 {
    &.wide {
        margin: 20px 0;
        max-width: 800px;
        min-width: 400px;
    }
}

.pd__16--bottom {
    padding-bottom: 16px;
}

.is--disabled {
    pointer-events: none;
    background-color: rgb(229, 229, 229) !important;
    opacity: 0.6;
}
</style>