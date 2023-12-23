<template>
    <div class="filter-condition" v-if="getListFilter.length > 0">
        <div class="filter-condition__item" v-for="(item, index) in getListFilter" :key="index">
            {{ item.title }} {{ item.selectedOption ? '' : item.conditionName }} {{ item.selectedOption
                    ?
                    `"${item.selectedOption}"` :
                    item.value ? `"${item.value}"` : ''
            }}
            <div class="filter-condition__delete ms-16 ms-icon ms-icon-close-small"
                @click="deleteFilterCondition(item)"></div>
        </div>
        <div class="filter-condition__remove" @click="deleteFilterCondition(-1)">Xóa điều kiện lọc</div>
    </div>
</template>

<script>
export default {
    name: 'VFilter',
    computed: {
        /**
         * @description: Hàm lấy ra filter trong vuex
         * @param: {any} 
         * Author: tttuan 10/11/2022
         */
        getListFilter: {
            get() {
                return this.$store.getters.getListFilter;
            },
        },
    },
    methods: {
        /**
        * @description: Hàm này dùng để xóa 1 hoặc nhiều điều kiện lọc
        * Author: tttuan 28/10/2022
        */
        deleteFilterCondition(item) {
            this.$store.commit('removeItemFilter', item.key);
            if (item == -1) {
                this.$store.commit('removeAllFilter');
            }
        },
    },
    created() {
        this.$store.commit('removeAllFilter');
    },
}
</script>

<style>

</style>