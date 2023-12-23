<template>
    <div class="v-menu" ref="menu">
        <div class="v-menu__main">
            <div class="v-menu__button" tabindex="-1" @click="handleSelect({ key: 'edit' })">{{ $t('action.edit') }}
            </div>
            <div class="v-menu__dropdown">
                <div class="v-menu__icon" @click="open" v-click-outside="close" tabindex="-1">
                    <div class="v-menu__line"></div>
                    <div class="ms-16 ms-icon ms-icon-arrow-down">
                    </div>
                </div>
            </div>
        </div>
        <teleport to="body">
            <Transition name="slide">
                <div class="v-menu__content" v-if="isVisible" ref="content">
                    <div class="v-menu__item" v-for="(item, index) in actionItems" :key="index"
                        @click="handleSelect(item)" tabindex="-1">
                        {{ item.value }}
                    </div>
                </div>
            </Transition>
        </teleport>
    </div>
</template>

<script>
import Enum from '@/utils/enum'
export default {
    props: {
        propKey: { // Key của menu
            required: true,
        },
        columns: { // Giá trị của menu
            required: true,
        },
        isUp: {
            type: Boolean,
            default: false,
        },
        items: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            isVisible: false,
        }
    },
    computed: {
        actionItems() {
            return this.items.length > 0 ? this.items : [{
                'key': Enum.ACTION.DUPLICATE,
                'value': this.$t('action.duplicate'),
            },
            {
                'key': Enum.ACTION.DELETE,
                'value': this.$t('action.delete'),
            },
            {
                'key': !this.status ? Enum.ACTION.ACTIVE : Enum.ACTION.INACTIVE,
                'value': !this.status ? this.$t('action.active') : this.$t('action.inactive'),
            }]
        },

        /**
         * @description: Lấy ra trạng status của bản ghi
         * @param: {any} 
         * Author: tttuan 10/11/2022
         */
        status() {
            try {
                return this.propKey[this.columns.find((item) => item.key === 'status').key] === 1
            } catch (error) {
                return true
            }

        },
    },
    methods: {
        /**
         * @description: Hàm này dùng để set position cho menu
         * Author: tttuan 25/09/2022
         */
        setPosition() {
            const menuPosition = this.$refs.menu.getBoundingClientRect()
            this.$nextTick(() => {
                const contentPosition = this.$refs.content.getBoundingClientRect()

                if (this.isUp) {
                    this.$refs.content.style.top = `${menuPosition.top - contentPosition.height}px`
                } else {
                    if (menuPosition.top + contentPosition.height * 2 > window.innerHeight) {
                        this.$refs.content.style.top = `${menuPosition.top - contentPosition.height - menuPosition.height / 2}px`
                    } else {
                        this.$refs.content.style.top = `${menuPosition.top + menuPosition.height / 2}px`
                    }
                }
                this.$refs.content.style.left = `${menuPosition.left - contentPosition.width + menuPosition.width}px`
                this.$refs.content.style.width = `${menuPosition.width}px`
            })
        },
        /**
         * @description: Hàm này dùng để mở menu
         * @param: {any} 
         * Author: tttuan 02/11/2022
         */
        open() {
            this.isVisible = true
            this.setPosition()
        },

        /**
         * @description: Hàm này dùng để đóng dropdown
         * Author: tttuan 25/09/2022
         */
        close() {
            this.isVisible = false
        },

        /**
         * @description: Hàm này dùng để xử lý khi chọn item
         * Author: tttuan 03/10/2022
         */
        handleSelect(item) {
            this.$emit('onSelect', {
                key: item.key,
                value: this.propKey,
            });
            this.close()
        },
    },
    mounted() {
        const scrollableElements = document.querySelectorAll('.scrollable');
        scrollableElements.forEach((element) => {
            element.addEventListener('scroll', this.close);
        });
    },
    unmounted() {
        const scrollableElements = document.querySelectorAll('.scrollable');
        scrollableElements.forEach((element) => {
            element.removeEventListener('scroll', this.close);
        });

    },
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/base/menu.scss";
</style>