
<template>
    <div class="v-collapse">
        <div class="v-collapse__header" @click="toggleContent">
            <div class="v-collapse__icon">
                <div class="ms-16 ms-icon-v2"
                    :class="isShow? 'ms-icon-arrow-bottom-black' : 'ms-icon-arrow-right-black'"></div>
            </div>
            <div class="v-collapse__title">{{title}}
                <slot name="title"></slot>
            </div>
        </div>
        <Transition name="collapse-transition">
            <div class="v-collapse__content" v-show="isShow">
                <slot></slot>
            </div>
        </Transition>
    </div>
</template>

<script>
import { ref } from 'vue'
export default {
    name: 'VCollapse',
    props: {
        title: {
            type: String,
            default: ''
        },
    },
    setup() {
        const isShow = ref(false)
        const toggleContent = () => {
            isShow.value = !isShow.value
        }
        return {
            isShow,
            toggleContent
        }
    }
}
</script>

<style lang="scss" scoped>
.collapse-transition-enter,
.collapse-transition-leave-to {

    opacity: 0;
}

.collapse-transition-enter-active,
.collapse-transition-leave-active {
    transition: all 0.3s ease;
}

.v {
    &-collapse {}

    &-collapse__content {}

    &-collapse__header {
        display: flex;
        align-items: center;
        cursor: pointer;
        font-size: 18px;
        padding: 10px 0;
        transition: all .2s ease-out;
        color: inherit;
    }

    &-collapse__icon {}

    &-collapse__title {}


}
</style>