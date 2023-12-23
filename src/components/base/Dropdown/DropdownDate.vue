<template>
    <div class="dropdown" @blur="isShow = false" tabindex="-1">
        <div class="dropdown__value" :class="{ 'color--white': isWhiteColor }">
            {{ value }}
        </div>

        <div class="dropdown__icon" @click="isShow = !isShow">
            <div v-show="isWhiteColor" class="icon__caretdown--white"></div>
            <div v-show="!isWhiteColor" class="icon__caretdown--black"></div>
        </div>

        <div class="dropdown__box">
            <div v-show="isShow" class="dropdown__list">
                <div class="dropdown__item"
                    v-for="item in listItems"
                    :key="item"
                    :class="{'dropdown__item--focused': value == item}"
                    @click="setValue(item)"
                > 
                    {{ item }} 
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>

export default {
    name: "DropdownDate",
    props: {
        value: String,
        isWhiteColor: {
            type: Boolean,
            default: false,
        },
        listItems: {
            type: String,
        },
    },

    created() {

    },

    updated() {

    },

    watch: {

    },

    methods: {
        setValue(value) {
            this.isShow = false;
            this.$emit('setValue', value);
        },
    },

    data() {
        return {
            isShow: false,
        };
    },

};

</script>
  
<style lang="scss" scoped>

.dropdown {
    display: flex;
    align-items: center;
    position: relative;

    &__value {
        margin-right: 2px;
    }

    &__icon {
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }

    &__box {
        border-radius: 4px;
        border: 1px solid rgb(158, 158, 158);
        box-sizing: border-box;
        z-index: 2;
        top: 30px;
        right: -47px;
        position: absolute;
        background-color: white;
    }

    &__list {
        height: 160px;
        width: 160px;
        overflow-y: scroll;
        margin: 2px 0;
    }

    &__item {
        padding-left: 10px;
        line-height: 28px;
        height: 28px;

        &:hover {
            background-color: rgb(13, 24, 61);
            color: white;
        }

        &--focused {
            background-color: rgb(13, 24, 61);
            color: white;
        }
    }
}

.icon__caretdown--white {
    background: url("@/assets/img/Sprites.d78db031.svg") no-repeat -612px -413px;
	width: 9px;
	height: 6px;
}

.icon__caretdown--black {
    background: url("@/assets/img/Sprites.d78db031.svg") no-repeat -1800px -478px;
	width: 8px;
	height: 5px;
    opacity: 0.7;
}   

.color--white {
    color: white;
}
</style>
  