<template>
    <div class="v-dropdown" v-click-outside="handleHide" :class="{'v-dropdown--disabled': !isShow}">
        <div v-if="hasButton" class="v-has__button" :class="className">
            <div class="v-dropdown__text" tabindex="-1" @click="$emit('onClick')">
                <slot></slot>
                {{ isTextChange ? textContent : text }}
            </div>
            <div class="v-dropdown__icon" v-if="icon" @click="toggleContent" tabindex="-1">
                <div class="line"></div>
                <div :class="icon"></div>
                <slot name="icon"></slot>
            </div>
        </div>
        <div v-else class="v-dropdown__button flex-shrink" @click="toggleContent" :class="className" tabindex="-1">
            <div class="v-dropdown__text">
                <slot></slot>
                {{ isTextChange ? textContent : text }}
            </div>
            <div class="v-dropdown__icon size--16" v-if="icon">
                <div class="iconCustom iconCustom__grey--caretdown" v-if="!isShow"></div>
                <div class="iconCustom iconCustom__black--caretdown" v-if="isShow"></div>
                <slot name="icon"></slot>
            </div>
        </div>
        <transition name="slide-fade">
            <div v-if="hasContent" v-show="showContent" class="v-dropdown__custom">
                <slot name="content"></slot>
            </div>
            <div v-else class="v-dropdown__content" v-show="showContent">
                <div class="v-dropdown__content-item" v-for="(option, index) in items" :key="index"
                    @click="handleSelect(option)"
                    :class="{ 'v-dropdown__content-item--active': option[propKey] === value && backgroundActive }">
                    <slot name="item" :option="option" :index="index">
                        {{ option[propValue] }}
                    </slot>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    name: "VDropdown",
    props: {
        icon: { // Dropdown có icon hay không
            type: String,
            default: "",
        },
        className: { // Class của dropdown
            type: String,
            default: "",
        },
        text: { // Text của dropdown
            type: String,
            default: "",
        },
        items: { // Danh sách các item của dropdown
            type: Array,
            default: () => [],
        },
        isShow: { // Dropdown có show hay không
            type: Boolean,
            default: true,
        },
        propKey: { // Key của dữ liệu
            type: String,
            default: "key",
        },
        propValue: { // Value của dữ liệu
            type: String,
            default: "value",
        },
        value: { // Giá trị của dropdown
            type: String,
            default: "",
        },
        backgroundActive: { // Có để màu nền khi active hay không
            type: Boolean,
            default: true,
        },
        hasButton: { // Có button hay không
            type: Boolean,
            default: false,
        },
        isTextChange: { // Có thay đổi text khi chọn item hay không
            type: Boolean,
            default: false,
        },
        hasContent: { // Có content hay không
            type: Boolean,
            default: false,
        },
        isShowContent: { // Có show content hay không
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            showContent: false, // Dropdown có show content hay không
            textContent: "", // Text của dropdown
        };
    },
    watch: {
        showContent(value) { // Khi show content thay đổi thì emit ra ngoài
            this.$emit("update:isShowContent", value);
        },
        isShowContent: { // Khi isShowContent thay đổi thì showContent cũng thay đổi
            handler(value) {
                this.showContent = value;
            },
            deep: true,
        },
    },
    methods: {
        /**
         * @description: Hiển thị content của dropdown 
         * Author: tttuan 03/10/2022
         */
        toggleContent() { // Toggle content của dropdown
            this.showContent = !this.showContent;
        },

        /**
         * @description: Ẩn content của dropdown
         * Author: tttuan 03/10/2022
         */
        handleHide() { // Ẩn content của dropdown
            if (event.target.closest(".v-select__content")) return;


            this.showContent = false;
        },
        /**
         * @description: Xử lý khi chọn item của dropdown
         * Author: tttuan 03/10/2022
         */
        handleSelect(item) { // Xử lý khi chọn item của dropdown
            if (this.isTextChange) {
                this.textContent = item[this.propValue];
                this.$emit("update:value", item[this.propKey]);
            }
            this.$emit("onSelect", item[this.propKey], item[this.propValue]);
            this.handleHide();
        },
    },
    created() {
        if (this.isTextChange && this.value) {
            this.items.map((item) => {
                if (item[this.propKey] === this.value) {
                    this.textContent = item[this.propValue];
                }
            });
        }
    },
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/base/dropdown.scss";

.v-dropdown--disabled {
    pointer-events: none;
}

.iconCustom {
    background-image: url("@/assets/img/Sprites.64af8f61.svg");
    background-repeat: no-repeat;
    display: block;
    cursor: pointer;
}

.iconCustom__black--caretdown {
	background-position: -564px -365px !important;
	width: 8px;
	height: 5px;
	opacity: 1 !important; 
}

.iconCustom__grey--caretdown {
	background-position: -1756px -317px;
	width: 8px;
	height: 5px;
	opacity: 0.8;
}

.size--16 {
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.v {
    &-dropdown__custom {
        z-index: 99999;
        position: absolute;
        top: 125%;
        left: 0;
    }

    &-has__button {
        display: flex;
        font-family: "MISA Fonts Bold";

        .v {
            &-dropdown__text {
                border-radius: 30px 0 0 30px;
                background-color: #2ca01c;
                color: #fff;
                padding: 8px 16px 8px 20px;
                height: 36px;
                cursor: pointer;
                transition: all .2s ease;
                position: relative;

                &:active {
                    background-color: #2ca01c;
                    color: #fff;
                }

                &:active::before {
                    content: "";
                    position: absolute;
                    border-radius: 30px 0 0 30px;
                    height: calc(100% + 2px);
                    width: 106%;
                    left: -3px;
                    top: -1px;
                    border: 3px solid #dcdcdc;
                    z-index: 9;
                }
            }

            &-dropdown__icon {
                background-color: #2ca01c;
                color: #fff;
                width: 46px;
                border-radius: 0 30px 30px 0;
                padding: 8px 10px;
                height: 36px;
                transition: all .2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;

                &:focus {
                    background-color: #2ca01c;
                    color: #fff;
                }

                &:focus::before {
                    content: "";
                    position: absolute;
                    border-radius: 0 30px 30px 0;
                    height: calc(100% + 2px);
                    width: 100%;
                    border: 3px solid #dcdcdc;
                    z-index: 9;
                }

                .line {
                    left: 0;
                    height: 20px;
                    position: absolute;
                    border: 1px solid transparent;
                    border-left-color: #fff;
                }
            }
        }
    }
}
</style>