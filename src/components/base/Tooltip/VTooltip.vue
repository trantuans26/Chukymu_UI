<template>
    <div class="v-tooltip" @mousemove="onMouseOver" @mouseleave="onMouseLeave" @mousedown="onMouseDown">
        <span v-if="content" class="v-tooltip__text" ref="tooltip" :class="isShow ? 'show' : ''">
            {{ content }}
        </span>
        <slot></slot>
    </div>
</template>
  
<script>
export default {
    props: {
        content: {
            type: String,
        },
        top: {
            type: Number,
            default: 20,
        },
        left: {
            type: Number,
            default: 10,
        },
        equalWidth: {
            type: Boolean,
            default: false,
        },
        position: {
            type: String,
            default: 'right',
        },
    },
    data() {
        return {
            isShow: false,
            isMouseDown: false,
        }
    },
    methods: {
        /**
        * @description: Hàm này dùng để ẩn tooltip khi hover ra và set lại giá trị isMouseDown = false để cho phép hiển thị tooltip khi hover vào
        * Author: tttuan 14/09/2022
        */
        onMouseLeave() {
            this.isShow = false;
            this.isMouseDown = false;
        },
        /**
         * @description: Hàm này dùng để ẩn tooltip khi click vào và set lại giá trị isMouseDown = true để không cho phép hiển thị tooltip khi hover vào
         * Author: tttuan 14/09/2022
         */
        onMouseDown() {
            this.isShow = false;
            this.isMouseDown = true;
        },
        /**
         * @description: Hàm này dùng để hiển thị tooltip khi hover vào
         * Author: tttuan 14/09/2022
         */
        onMouseOver(event) {
            if (!this.isMouseDown) { // nếu isMouseDown = false thì mới cho phép hiển thị tooltip
                const { clientX, clientY } = event; // lấy tọa độ của chuột
                const tooltip = this.$refs.tooltip;
                if (tooltip) {
                    // tạo tooltip ở dưới vị trí của chuột
                    tooltip.style.top = clientY + this.top + "px";
                    switch (this.position) {
                        case 'center':
                            tooltip.style.left = clientX - tooltip.offsetWidth / 2 + "px";
                            break;
                        default:
                            tooltip.style.left = clientX + this.left + "px";
                            break;
                    }
                    // nếu chiều rộng cuả tooltip lớn hơn chiều rộng của màn hình thì set 
                    if (clientX + tooltip.offsetWidth > window.innerWidth - 20) {
                        tooltip.style.left = clientX - tooltip.offsetWidth + "px";
                    }
                    // nếu chiều cao cuả tooltip lớn hơn chiều cao của màn hình thì set
                    if (clientY + tooltip.offsetHeight > window.innerHeight - 20) {
                        tooltip.style.top = clientY - tooltip.offsetHeight + "px";
                    }
                }
                this.isShow = true;
            }
        },
    },
    mounted() {
        // nếu equalWidth = true thì set style width max-content cho tooltip
        if (this.equalWidth) {
            this.$refs.tooltip.style.width = "max-content";
        }
    },
};
</script>
<style scoped lang="scss">
@import '@/assets/scss/base/tooltip.scss';
</style>