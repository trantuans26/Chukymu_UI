<template>
    <div class="v-skeleton" v-if="loading">
        <div class="v-skeleton__box" :class="{'v-skeleton__round' : round }"></div>
    </div>
    <div v-else>
        <slot></slot>
    </div>
</template>

<script>

export default {
    name: "VSkeleton",
    props: {
        loading: { // hiển thị skeleton hay không
            type: Boolean,
            default: true,
        },
        round: { // có bo tròn hay không
            type: Boolean,
            default: false,
        },
    },
    setup() {
    },
}
</script>

<style lang="scss" scoped>
.v {
    &-skeleton {
        display: flex;
        flex-grow: 1;
    }

    &-skeleton__box {
        display: inline-block;
        width: 100%;
        height: 1.5em;
        position: relative;
        overflow: hidden;
        background-color: #F2F2F2;

        &::after {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            transform: translateX(-100%);
            background-image: linear-gradient(90deg,
                    rgba(#fff, 0) 0,
                    rgba(#fff, 0.2) 20%,
                    rgba(#fff, 0.5) 60%,
                    rgba(#fff, 0));
            animation: shimmer 1s infinite;
            content: '';
        }

        @keyframes shimmer {
            100% {
                transform: translateX(100%);
            }
        }
    }

    &-skeleton__round {
        border-radius: $border-radius;
    }
}
</style>