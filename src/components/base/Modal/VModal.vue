<template>
    <transition name="fade">
        <div class="modal" v-if="isVisible || isShow" :tabindex="tabIndex" ref="modal" :style="[{ zIndex: zIndex }]">
            <div class="modal-content" ref="modal-content" :class="[`modal-${position}`,{'slideIn' : isResize}]"
                :style="[{ width: width }, { minWidth: width }]">
                <slot></slot>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    name: "VModal",
    props: {
        isShow: { // Modal có show hay không
            type: Boolean,
            default: false,
        },
        tabIndex: { // Tab index của modal
            type: Number,
            default: 0,
        },
        position: { // Vị trí của modal
            type: String,
            default: "center",
        },
        width: { // Chiều rộng của modal
            type: String,
            default: "auto",
        },
        isResize: { // Modal có resize hay không
            type: Boolean,
            default: false,
        },
        zIndex: { // Z-index của modal
            type: Number,
            default: 9999,
        },
    },
    data: () => ({
        isVisible: false, // Modal có hiển thị hay không
    }),
    watch: {
        /**
         * @description: Khi isShow thay đổi thì thay đổi isVisible
         * @param: {any} 
         * Author: tttuan 14/10/2022
         */
        isShow: function (val) {
            if (val) {
                this.open();
            } else {
                this.close();
            }
        },
    },
    methods: {
        /**
         * @description: Hàm này dùng để mở modal
         * Author: tttuan 07/10/2022
         */
        open() {
            this.isVisible = true;
            this.$nextTick(() => {
                this.oldFocus = document.activeElement; // Lấy element đang focus
                this.$refs.modal.focus(); // Focus vào modal
            });
        },
        /**
        * @description: Hàm này dùng để đóng modal (nếu có thẻ đang focus thì focus vào tab đó)
        * Author: tttuan 07/10/2022
        */
        close() {
            this.isVisible = false
            if (this.oldFocus) {
                this.oldFocus.focus();
            }
        },
    },

}
</script>

<style  lang="scss" scoped>
@import "@/assets/scss/base/modal.scss";

.slideIn {
    transition: all 0.3s ease;
    animation: slideIn 0.3s ease;
}



@keyframes slideIn {
    0% {
        transform: translateX(100%);
    }

    100% {
        transform: translateX(0);
    }
}
</style>