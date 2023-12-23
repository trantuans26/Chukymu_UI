<template>

    <v-modal :isShow="isShow" :tabIndex="tabIndex" :position="position" :width="isResize ? changeSize : width"
        :style="[{ zIndex: zIndex }]" :isResize="isResize" @keydown.ctrl.alt.c.stop="onHandleResize"
        @keydown.esc.stop="onHandleClose" @keydown.ctrl.shift.s.exact="onHandleSaveAndNew"
        @keydown.ctrl.s.exact="onHandleSave">
        <div class="v-dialog__content" :class="`v-dialog__content--${position}`">
            <div class="v-dialog__header">
                <div class="v-dialog__title">
                    <slot name="title"></slot>
                </div>
                <div class="v-dialog__close">
                    <div class="ms-24 ms-icon ms-icon-close" :tooltip="$t('action_form.close') + ' (ESC)'"
                        @click="onHandleClose"></div>
                </div>
            </div>
            <div class="v-dialog__body scrollable">
                <slot name="body"></slot>
                <div v-if="line" class="v-line"></div>
            </div>
            <div class="v-dialog__footer">
                <div class="footer__right">
                    <slot name="footer__right"></slot>
                </div>
                <div class="footer__left">
                    <slot name="footer__left"></slot>
                </div>
            </div>
        </div>
        <div v-if="isResize" class="resize d-flex" :class="changeIconChevron" @click="onHandleResize">
            <div class="ms-16 ms-icon-v2 ms-icon-chevron-left"></div>
        </div>
    </v-modal>

</template>

<script>
export default {
    name: "VDialog",
    props: {
        isShow: {
            type: Boolean,
            default: false
        },
        line: {
            type: Boolean,
            default: true
        },
        tabIndex: {
            type: Number,
            default: 0
        },
        position: {
            type: String,
            default: "center"
        },
        width: {
            type: String,
            default: "auto"
        },
        isResize: {
            type: Boolean,
            default: false
        },
        zIndex: {
            type: Number,
            default: 9999
        }
    },
    data() {
        return {
            isFull: false,
        }
    },
    computed: {
        /**
         * @description: Thay đổi vị trí của icon đóng mở nếu form resize
         * Author: tttuan 03/11/2022
         */
        changeIconChevron() {
            return this.isFull && this.isShow ? 'is-full-screen-true' : 'is-full-screen-false'
        },
        /**
         * @description: Thay đổi kích thước của form khi resize
         * Author: tttuan 03/11/2022
         */
        changeSize() {
            return this.isFull ? 'calc(100vw - 6px)' : this.width;
        },

    },
    methods: {
        /**
         * @description: Hàm này dùng để collapse toàn màn hình cho dialog
         * @param: {any} 
         * Author: tttuan 02/11/2022
         */
        onHandleResize() {
            this.isFull = !this.isFull
            this.$emit('onHandleResize', this.isFull)
        },
        /**
         * @description: Hàm đóng dialog
         * Author: tttuan 11/09/2022
         */
        onHandleClose() {
            this.$emit("close");
        },
        /**
         * @description: Phím tắt khi nhấn phím ctrl + s
         * @param: {any} 
         * Author: tttuan 03/11/2022
         */
        onHandleSave() {
            this.$emit("onHandleSave");
        },
        /**
         * @description: Phím tắt khi nhấn phím ctrl + shift + s
         * @param: {any}
         * Author: tttuan 03/11/2022
         */
        onHandleSaveAndNew() {
            this.$emit("onHandleSaveAndNew");
        },
    },
}
</script>
<style lang="scss" >
@import '@/assets/scss/base/dialog.scss';





.resize {
    width: 12px;
    height: 50px;
    background: #fff;
    border: 1px solid #d4d7dc;
    border-radius: 8px;
    position: absolute;
    align-items: center;
    left: -6px;
    top: 43%;
    z-index: 99;
}




.is-full-screen-false {
    transform: rotateY(0deg);
}

.is-full-screen-true {
    transform: rotateY(180deg);
}
</style>