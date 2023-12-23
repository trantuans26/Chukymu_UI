<template>
    <div class="v-pagination__container" v-if="totalRecord != -1">
        <div class="v-pagination__left">
            {{ $t('pagination.total') }}: <span class="font-weight-700 m-x-1"> {{ totalRecord
            }} </span> {{ $t('pagination.record') }}
        </div>
        <div class="v-pagination__right">
            <div class="v-pagination__right-record">
                <v-combobox position="top" propKey="key" propValue="value" v-model="vPageSize" :data="listOptions"
                    :selectBox="true">
                </v-combobox>
            </div>
            <div class="v-pagination__right-page">
                <ul class="v-pagination">
                    <li class="v-pagination__prev" @click="changePage('prev')"
                        :class="{ 'v-pagination__item--disabled': pageNumber === 1 }">
                        {{ $t('pagination.before') }}
                    </li>
                    <li class="v-pagination__item" v-for="(page, index) in pages" :key="index"
                        :class="[{ 'v-pagination__item--active': page == pageNumber }]" @click="changePage(page)">{{
                                page
                        }}
                    </li>
                    <li class="v-pagination__after" @click="changePage('after')"
                        :class="{ 'v-pagination__item--disabled': pageNumber === totalPage }">
                        {{ $t('pagination.after') }}
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'VPagination',
    props: {
        pageNumber: { // trang hiện tại
            type: Number,
            default: 1
        },
        totalRecord: { // tổng số bản ghi
            type: Number,
            default: -1,
        },
        pageSize: { // số bản ghi trên 1 trang
            type: Number,
            default: 20
        },
        options: { // danh sách số bản ghi trên 1 trang
            type: Array,
            default: () => []
        },
        autoSetPageNumber: { // tự động set lại thành trang 1 khi thay đổi pageSize
            type: Boolean,
            default: true
        },
        delta: { // số trang hiển thị phần 2 bên của trang hiện tại
            type: Number,
            default: 2
        }
    },
    computed: {
        /**
         * @description: Get và set danh sách số bản ghi trên 1 trang
         * @param {Array} options
         * @return {Array} listOptions
         * Author: tttuan 20/10/2022
         */
        listOptions: {
            get() {
                return [
                    { key: 10, value: this.$t('pagination.10') },
                    { key: 20, value: this.$t('pagination.20') },
                    { key: 30, value: this.$t('pagination.30') },
                    { key: 50, value: this.$t('pagination.50') },
                    { key: 100, value: this.$t('pagination.100') }
                ];
            },
            set(value) {
                this.listOptions = value;
            }
        },
        /**
       * @description: binding 2 chiều cho pageSize và nếu autoSetPageNumber = true thì set lại pageNumber = 1 
       * khi thay đổi pageSize, nếu autoSetPageNumber = false thì không set lại pageNumber
       * mà lấy trang cuối cùng của pageSize mới
       * @param {Number} pageSize
       * @return {Number} vPageSize
       * Author: tttuan 20/10/2022
       */
        vPageSize: {
            get() {
                return this.pageSize;
            },
            set(value) {
                this.$emit('update:pageSize', value);
                if (this.autoSetPageNumber) {
                    this.$emit('update:pageNumber', 1);
                } else {
                    let totalPage = Math.ceil(this.totalRecord / value);
                    // nếu trang hiện tại lớn hơn tổng số trang thì set lại trang hiện tại là trang cuối
                    if (this.pageNumber > totalPage) {
                        this.$emit('update:pageNumber', totalPage);
                    }
                }
            }
        },
        /**
         * @description: Tính tổng số trang
         * @return {Number} totalPage
         * Author: tttuan 20/10/2022
         */
        totalPage() {
            return Math.ceil(this.totalRecord / this.pageSize);
        },
        /**
         * @description: Tính số trang hiển thị
         * Author: tttuan 20/10/2022
         */
        pages() {
            let pages = []; // danh sách trang
            for (let i = 1; i <= this.totalPage; i++) {
                if (i == 1 || i == this.totalPage || (i >= this.pageNumber - this.delta && i <= this.pageNumber + this.delta)) {
                    // nếu là trang đầu hoặc trang cuối, hoặc trang hiện tại và 2 trang xung quanh thì hiển thị phần rìa là 2 trang
                    pages.push(i);
                } else if (i == this.pageNumber - (this.delta + 1) || i == this.pageNumber + (this.delta + 1)) {
                    // nếu là trang xung quanh trang hiện tại thì hiển thị dấu ...
                    pages.push('...');
                }
            }
            // trả về mảng các trang
            return pages;
        }
    },
    methods: {
        /**
        * @description: Handle sự kiện khi click vào các trang
        * @param: {Number} page
        * Author: tttuan 20/10/2022
        */
        changePage(page) {
            if (page == '...') {
                return;
            }
            if (page == 'prev' && this.pageNumber <= 1) {
                return;
            }
            if (page == 'after' && this.pageNumber >= this.totalPage) {
                return;
            }
            if (page == 'prev') {
                page = this.pageNumber - 1;
            }
            if (page == 'after') {
                page = this.pageNumber + 1;
            }
            this.$emit('update:pageNumber', page);
        }
    },
    mounted() {
        /**
        * @description: Nếu có truyền options thì set lại listOptions
        * Author: tttuan 20/10/2022
        */
        if (this.options.length > 0) {
            this.listOptions = this.options;
        }
    },
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/base/pagination.scss";
</style>