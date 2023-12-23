<template>
    <v-modal ref="modal" :tabIndex="tabIndex" @keydown.esc.prevent="reset()">
        <div class="v-popup">
            <div class="v-popup__body">
                <div class="v-popup__icon" @mousemove="stopDrag">
                    <div :class="`ms-48 ms-icon ms-icon-${icon}`"></div>
                </div>
                <div class="v-popup__text">
                    <span v-html="message"></span>
                    <slot name="body"></slot>
                </div>
            </div>
            <div class="v-line"></div>
            <div class="v-popup__footer">
                <div class="footer__left">
                    <v-button v-if="closeButton" className="secondary" @click="_close" :text="closeButton"
                        :focus="true" />
                </div>
                <div class="footer__right">
                    <v-button v-if="hideButton" :focus="true" @click="_close">{{ $t('confirm_popup.close') }}</v-button>
                    <v-button v-if="cancelButton != null" className="secondary" @click="_cancel" :text="cancelButton" />
                    <v-button v-if="okButton" @click="_confirm" :text="okButton" />
                    <div style="max-width: 0; max-height: 0; overflow: hidden;">
                        <input @focus="inputFocus()" />
                    </div>
                </div>
            </div>
        </div>
    </v-modal>
</template>


<script>
import Enum from '@/utils/enum';
export default {
    name: "VPopup",
    props: {
        tabIndex: {
            type: Number,
            default: 0,
        },
    },
    data: () => ({
        message: undefined, // nội dung thông báo
        icon: undefined, // icon hiển thị
        okButton: null, // nút ok
        cancelButton: null, // nút cancel
        closeButton: null, // nút close
        hideButton: false, // ẩn nút close
        // khai báo biến private để lưu trữ giá trị trả về
        resolvePromise: undefined,
        rejectPromise: undefined,

    }),
    methods: {
        /**
         * @description: Hàm này dùng để hiển thị popup
         * @param: {Object}  options - Các tham số truyền vào  {message, icon, okButton, cancelButton}
         * Author: tttuan 22/09/2022
         */
        show(opts = {}) {
            this.message = opts.message
            if (opts.cancelButton) {
                this.cancelButton = opts.cancelButton
            }
            if (opts.okButton) {
                this.okButton = opts.okButton
            }
            if (opts.closeButton) {
                this.closeButton = opts.closeButton
            }
            if (opts.icon) {
                this.icon = opts.icon
            }
            if (opts.hideButton) {
                this.hideButton = opts.hideButton
            }
            // gọi hàm show của v-modal
            this.$refs.modal.open()
            // Trả về promise để người gọi có thể lấy kết quả
            return new Promise((resolve, reject) => {
                this.resolvePromise = resolve
                this.rejectPromise = reject
            })
        },

        /**
         * @description: Hàm này dùng để hiển thị popup thông báo
         * Author: tttuan 07/10/2022
         */
        showInfo(message) {
            this.show({
                message: message,
                icon: "info",
                hideButton: true,
            })
        },

        /**
         * @description: Hàm này dùng để hiển thị popup cảnh báo
         * Author: tttuan 07/10/2022
         */
        showWarning(message) {
            this.show({
                message: message,
                icon: "warning",
                hideButton: true,
            })
        },

        /**
         * @description: Hàm này dùng để hiển thị popup lỗi
         * Author: tttuan 07/10/2022
         */
        showError(message) {
            this.show({
                message: message,
                icon: "error",
                hideButton: true,
            })
        },

        /**
         * @description: Hàm này dùng để nhấn nút ok
         * Author: tttuan 27/09/2022
         */
        _confirm() {
            this.resolvePromise(this.okButton)
            this.reset()
        },

        /**
         * @description: Hàm này dùng để nhấn nút cancel
         * Author: tttuan 27/09/2022
         */
        _cancel() {
            this.resolvePromise(this.cancelButton)
            this.reset()
        },

        /**
         * @description: Hàm này dùng để nhấn nút close
         * Author: tttuan 27/09/2022
         */
        _close() {
            this.resolvePromise(this.closeButton)
            this.reset();
        },

        /**
         * @description: Hàm này dùng để reset lại các giá trị
         * Author: tttuan 07/10/2022
         */
        reset() {
            this.message = undefined
            this.icon = undefined
            this.okButton = null
            this.cancelButton = null
            this.closeButton = null
            this.hideButton = false
            this.$refs.modal.close()
            this.$store.commit('setActionKey', Enum.ACTION.NULL)
        },

        /**
         * @description: Hàm này dùng để focus vào vị trí đầu tiên của popup nếu vượt qua tabIndex
         * Author: tttuan 12/10/2022
         */
        inputFocus() {
            this.$refs.modal.$el.querySelector('button').focus()
        }
    },
   
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/base/popup.scss";
</style>