<template>
    <div class="v-button">
        <button class="v-button__button" :type="type" :class="[buttonType,className,{'rounded' : rounded}, {'is--disabled': disabled}]"
            :disabled="disabled" ref="button" :tabindex="tabIndex" :style="style" @blur="$emit('blur')">
            <div class="v-button__text">
                <slot></slot>
                {{ text }}
            </div>
            <div class="v-button__icon" v-if="icon">
                <div :class="icon"></div>
                <slot name="icon"></slot>
            </div>
        </button>
    </div>
</template>

<script>
export default {
    name: "VButton",
    props: {
        type: { // Thiết lập type của button (submit, button, reset)
            type: String,
            default: "button",
        },
        icon: { // Button có icon hay không
            type: String,
            default: "",
        },
        disabled: { // Button có disabled hay không
            type: Boolean,
            default: false,
        },
        className: { // Class của button
            type: String,
            default: "",
        },
        text: { // Text của button
            type: String,
            default: "",
        },
        styleProps: {
            type: Array,
            required: false,
            default: () => [],
        },
        buttonType: {
            type: String,
            default: "primary",
        },
        tabIndex: {
            type: Number,
            default: 0,
        },
        focus: {
            type: Boolean,
            default: false,
        },
        rounded: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        /**
         * @description: tạo style cho button
         * Example: styleProps: ['color: red', 'background-color: blue']
         * 
         * Author: tttuan 14/09/2022
         */
        style() {
            let styleProps = {};
            if (this.styleProps.length > 0) {
                this.styleProps.forEach((item) => {
                    const key = item.split(":")[0].trim();
                    const value = item.split(":")[1].trim();
                    styleProps[key] = value;
                });
                return styleProps;
            } else {
                return {};
            }
        },
    },
    methods: {
        /**
         * @description: Hàm này dùng để focus vào button
         * Author: tttuan 14/09/2022
         */
        focusButton() {
            this.$refs.button.focus();
        },
    },
    created() {
        // nếu props focus là true thì đợi dom render xong sau đó focus vào 
        if (this.focus) {
            this.$nextTick(() => {
                this.$refs.button.focus();
            });
        }
    },
};
</script>
<style scoped lang="scss">
@import "@/assets/scss/base/button.scss";

.is--disabled {
    pointer-events: none;
    background-color: rgb(229, 229, 229) !important;
    color: rgb(142, 142, 142) !important;
}

</style>