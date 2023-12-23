<template>
    <div class="v-table__content">
        <v-loading :isLoaded="isLoaded"></v-loading>
        <div class="v-table scrollable">
            <table class="v-table__main">
                <thead class="v-table__header">
                    <tr class="v-table__header-row" tabindex="-1">
                        <!-- Tạo phần padding-left 20px -->
                        <th class="v-table__header-row-sticky-padding" style="min-width: 20px;width: 20px"
                            v-if="tablePadding"></th>
                        <!-- Render header dựa vào props columns bên component cha -->
                        <th v-for="(column, index) of columns" :key="index" class="v-table__header-cell"
                            :class="[{ 'v-table__header-row-sticky': column.fixed }, `v-text__${column.textAlign ? column.textAlign : 'left'}`]"
                            :style="[{ minWidth: column.width ? column.width : 'auto' }, { width: column.width ? column.width : 'auto' }, { left: column.fixed ? `${column.left}px` : 'auto' }]">
                            <!-- <span class="skeleton-box"></span> -->
                            <div class="v-table__header-container">
                                <!-- Nếu như có type là checkbox mà title là null thì render checkbox -->
                                <v-input type="checkbox" inputClass="align-items-center" className="no-animation"
                                    v-model="checkAllValue" v-if="column.type === 'checkbox' && index == 0">
                                </v-input>
                                <!-- Mặc định render column title -->
                                <template v-if="column.tooltip">
                                    <v-tooltip :content="column.tooltip">
                                        <span>{{ column.title }}</span>
                                    </v-tooltip>
                                </template>
                                <template v-else>
                                    <span>{{ column.title }}</span>
                                </template>
                                <div class="v-table__header-icon ms-16 ms-icon-v2 ms-icon-header-option"
                                    @click="showFilterPopup(column, $event)" v-if="column.filterable">
                                </div>
                            </div>
                        </th>
                        <!-- Tạo phần padding-right 30px -->
                        <th class="v-table__header-row-sticky-padding" style="min-width: 30px; width: 30px"
                            v-if="tablePadding"></th>
                    </tr>
                </thead>
                <!--  -->
                <tbody class="v-table__body" v-if="!isLoaded">
                    <!-- Render body giả từ 1-10 -->
                    <tr v-for="(row, indexList) of lineOfLoading" :key="indexList" class="v-table__body-row">
                        <td class="v-table__body-row-sticky-padding" style="min-width: 20px;width: 20px"
                            v-if="tablePadding">
                        </td>
                        <td v-for="(column, index) of columns" :key="index" class="v-table__body-cell"
                            :class="[`v-text__${column.textAlign ? column.textAlign : 'left'}`, { 'v-table__body-row-sticky': column.fixed }]"
                            :style="[{ minWidth: column.width ? column.width : 'auto' }, { width: column.width ? column.width : 'auto' }, { left: column.fixed ? `${column.left}px` : 'auto' }]">
                            <!-- Khởi tạo skeleton loading -->
                            <v-skeleton :loading="!isLoaded">
                                <div></div>
                            </v-skeleton>
                        </td>
                        <td class="v-table__body-row-sticky-padding" style="min-width: 30px; width: 30px"
                            v-if="tablePadding">
                        </td>
                    </tr>
                </tbody>
                <!--  -->
                <tbody v-if="isLoaded" class="v-table__body">
                    <tr v-for="(row, indexList) of data" :key="indexList" class="v-table__body-row">
                        <td class="v-table__body-row-sticky-padding" style="min-width: 20px;width: 20px"
                            v-if="tablePadding">
                        </td>
                        <td v-for="(column, index) of columns" :key="index" class="v-table__body-cell"
                            :class="[`v-text__${column.textAlign ? column.textAlign : 'left'}`, { 'v-table__body-row-sticky': column.fixed }]"
                            :style="[{ width: column.width ? column.width : 'auto' }, { left: column.fixed ? `${column.left}px` : 'auto' }, { maxWidth: column.maxWidth ? column.maxWidth : 'auto' }]"
                            @dblclick="column.fixed ? '' : onHandleEdit(row)">
                            <!-- Khởi tạo skeleton loading -->
                            <!-- Nếu như type là checkbox thì render checkbox -->
                            <v-input type="checkbox" :value="row[column.key]" v-if="index == 0 && column.checkbox"
                                v-model="listSelected" inputClass="align-items-center"></v-input>
                            <!-- Nếu như type là checkbox và có title thì render checkbox disabled -->
                            <v-input type="checkbox" v-else-if="column.checkbox && column.title" :disabled="true"
                                v-model="row[column.key]" inputClass="align-items-center">
                            </v-input>
                            <!-- Nếu như type là date thì render date format theo format của column -->
                            <template v-else-if="column.type === 'date'">
                                {{ row[column.key] ? formatDate(row[column.key]) : '' }}
                            </template>
                            <!-- Nếu như type là gender thì render giới tính -->
                            <template v-else-if="column.type === 'gender'">
                                {{ convertGender(row[column.key]) }}
                            </template>
                            <!-- Nếu như type là currency thì render tiền tệ -->
                            <template v-else-if="column.type === 'currency'">
                                {{ formatCurrency(row[column.key]) }}
                            </template>
                            <!-- Nếu như type là hình ảnh -->
                            <template v-else-if="column.type === 'image'">
                                <div class="image">
                                    <img class="image__file" :src="row[column.key]" v-show="row[column.key]"> 
                                    <img class="image__file" src="@/assets/img/default-placeholder.png" v-show="!row[column.key]"> 
                                </div>
                            </template>
                            <!-- Nếu như type là action thì render action -->
                            <template v-else-if="column.type === 'action'">
                                <v-menu :propKey="row" @onSelect="onSelect" :items="actions" :columns="columns">
                                </v-menu>
                            </template>
                            <template v-else-if="column.formatter">
                                {{ column.formatter(row[column.key]) }}
                            </template>
                            <!-- Nếu như không có type thì render giá trị của key -->
                            <template v-else>
                                {{ row[column.key] }}
                            </template>
                        </td>
                        <td class="v-table__body-row-sticky-padding" style="min-width: 30px; width: 30px"
                            v-if="tablePadding">
                        </td>
                    </tr>
                </tbody>
                <tfoot class="v-table__footer" v-if="isShowTotalInColumn && isLoaded && data.length != 0">
                    <tr class="v-table__footer-row">
                        <td class="v-table__body-row-sticky-padding" style="min-width: 20px;width: 20px"
                            v-if="tablePadding">
                        </td>
                        <td v-for="(column, index) of columns" :key="index" class="v-table__footer-cell"
                            :class="[`v-text__${column.textAlign ? column.textAlign : 'left'}`, { 'v-table__body-row-sticky': column.fixed }]"
                            :style="[{ minWidth: column.width ? column.width : 'auto' }, { width: column.width ? column.width : 'auto' }, { left: column.fixed ? `${column.left}px` : 'auto' }]">
                            <div class="v-table__body-cell-content">
                                <div class="v-table__body-cell-content--text" v-if="column.formatter">
                                    {{ column.formatter(column.footer) }}
                                </div>
                                <div class="v-table__body-cell-content--text" v-else>
                                    {{ column.footer }}
                                </div>
                            </div>
                        </td>
                        <td class="v-table__body-row-sticky-padding" style="min-width: 30px; width: 30px"
                            v-if="tablePadding">
                        </td>
                    </tr>
                </tfoot>
            </table>
            <!-- Nếu như tổng số bản ghi trả về là 0 thì sẽ hiển thị không có dữ liệu -->
            <v-skeleton :loading="!isLoaded" v-if="data.length === 0">
                <div class="v-table__not-found">
                    <div class="v-table__not-found-icon">
                        <img :src="require('@/assets/img/bg_no_data.svg')" alt="">
                    </div>
                    <div class="v-table__not-found-text">
                        {{ $t('notice_message.not_found') }}
                    </div>
                </div>
            </v-skeleton>
        </div>
        <teleport to='body'>
            <VTableFilter :filterPopup="filterPopup" @applyFilter="applyFilter" @closeFilterPopup="closeFilterPopup" />
        </teleport>
    </div>
</template>
<script>

import { formatDate, convertGender, formatCurrency, convertStatus } from '@/utils/format';
import Enum from '@/utils/enum';
import VTableFilter from './VTableFilter'
import format from '@/utils/format';
export default {
    name: "VTable",
    components: {
        VTableFilter
    },
    props: {
        actions: { // các action được thực hiện trên row
            type: Array,
            required: false,
        },
        data: { // dữ liệu trả về từ api
            type: Array,
            required: true,
            default: () => []
        },
        columns: { // các cột của table
            type: Array,
            required: true,
        },
        tablePadding: { // padding của table
            type: Boolean,
            required: false,
            default: true,
        },
        isDataLoaded: { // trạng thái load data
            type: Boolean,
            required: false,
        },
        lineOfLoading: { // số dòng loading
            type: Number,
            required: false,
            default: 10,
        },
        delay: { // thời gian delay loading
            type: Number,
            required: false,
            default: 300,
        },
        isShowTotalInColumn: { // hiển thị tổng trong cột
            type: Boolean,
            required: false,
            default: false,
        },
    },
    data() {
        return {
            checkAllValue: false, // giá trị check all
            isLoaded: false, // trạng thái load dữ liệu
            filterPopup: { // popup lọc
                isShow: false,
                left: 0,
                top: 0,
                title: '',
                key: '',
                value: '',
                condition: Enum.FilterConditon.Contain,
                conditionName: this.$t('table_filter.contain'),
                type: Enum.FilterType.Text,
                filterOptions: [],
                selectedOption: null,
                column: null,
            },
        }
    },
    computed: {
        /**
         * @description: get và set các list id selected
         * @param: {any} 
         * Author: tttuan 29/10/2022
         */
        listSelected: {
            get() {
                return this.$store.getters.getListIdSelected;
            },
            set(value) {
                this.$store.commit('setListIdSelected', value);
            },
        },
    },
    watch: {
        /**
         * @description: Thay đổi trạng thái load data
         * @param: {any} 
         * Author: tttuan 04/11/2022
         */
        isDataLoaded: {
            handler: function (value) {
                this.isLoaded = value;

            },
            immediate: true,
        },
        /**
         * @description: Tạo hiệu ứng khi thay đổi dữ liệu
         * @param: {any} 
         * Author: tttuan 04/11/2022
         */
        data: {
            handler: function () {
                this.onLoaded();
            },
            deep: true
        },
        /**
          * @description: Hàm này dùng để set cho check all value là true nếu tất cả các row đều được chọn
          * @param {newVal} dữ liệu mới
          * Author: tttuan 16/09/2022
          */
        listSelected: {
            handler: function (newVal) {
                try {
                    this.checkAllValue = newVal.length === this.data.length;
                } catch (error) {
                    console.log(error);
                }
            },
            deep: true
        },
        /**
         * @description: nếu click vào checkbox thì thêm hoặc xóa dòng được chọn vào danh sách
         * @param {isCheckAll} trạng thái mới của checkbox được chọn
         * Author: tttuan 16/09/2022
         */
        checkAllValue(isCheckAll) {
            try {
                if (isCheckAll) {
                    const key = this.columns[0].key; // lấy key của cột đầu tiên
                    this.listSelected = this.data.map((item) => item[key]); // thêm các key của dòng được chọn vào listSelected
                } else {
                    this.listSelected = this.listSelected.length === this.data.length ? [] : this.listSelected; // nếu số lượng dòng được chọn bằng số lượng dòng trong bảng thì xóa hết
                }
            } catch (error) {
                console.log(error);
            }
        }
    },
    methods: {
        /**
          * @description: Hàm này dùng để tạo hiệu ứng loading sau khi dữ liệu được load xong
          * @param: {any} 
          * Author: tttuan 20/10/2022
          */
        onLoaded() {
            if (this.data.length > 0) {
                this.isLoaded = false;
                setTimeout(() => {
                    this.isLoaded = true;
                }, this.delay);
            }
        },
        formatDate, convertGender, formatCurrency, convertStatus,
        /**
          * @description: Hàm này gọi dùng để truyền các action sau khi chọn của row
          * trong table lên component cha
          * @param {action} các action của row 
          * Author: tttuan 12/09/2022
          */
        onSelect(action) {
            this.$emit('action', action.key, action.value);
        },
        /**
          * @description: Hàm này gọi dùng để sửa dữ liệu
          * @param {Object} row dữ liệu cần sửa
          * Author: tttuan 12/09/2022
          */
        onHandleEdit(row) {
            this.$emit('action', Enum.ACTION.EDIT, row);
        },

        showFilterPopup(column, event) {
            const self = this;
            self.filterPopup.isShow = false;
            let target = event.target.parentElement.parentElement.getBoundingClientRect(); // lấy ra thẻ cha chứa icon show filter
            let top = target.top + target.height; // tính toán vị trí top của popup
            let left = target.left + target.width; // tính toán vị trí left của popup
            self.filterPopup = {
                isShow: true,
                top: top,
                left: left,
                title: column.title,
                key: column.key,
                type: column.type || Enum.FilterType.Text,
                value: '',
                condition: column.condition || column.type == Enum.FilterType.Number ? Enum.FilterConditon.Equal : Enum.FilterConditon.Contain,
                conditionName: column.type == Enum.FilterType.Number ? self.$t('table_filter.equal') : self.$t('table_filter.contain'),
                filterOptions: column.filterOptions || [],
                selectedOption: null,
                column: column,
            }
            const filter = this.$store.getters.getItemFilterByKey(column.key);
            if (filter) {
                self.filterPopup = {
                    ...self.filterPopup,
                    value: filter.value,
                }
            }
        },
        /**
         * @description: Hàm này dùng để đóng popup filter
         * @param: {any} 
         * Author: tttuan 29/10/2022
         */
        closeFilterPopup(removeKey) {
            if (removeKey !== undefined) {
                this.$store.commit('removeItemFilter', removeKey);
            }
            this.filterPopup = {
                isShow: false,
                top: 0,
                left: 0,
                title: '',
                key: '',
                value: '',
                condition: Enum.FilterConditon.Contain,
                conditionName: this.$t('table_filter.contain'),
                type: Enum.FilterType.Text,
                filterOptions: [],
                selectedOption: null,
                column: null,
            } // reset lại giá trị của popup filter
        },
        /**
         * @description: Hàm này dùng để lưu giá trị filter vào store
         * @param: {any}
         * Author: tttuan 29/10/2022
         */
        applyFilter(value) {
            if (value.value || value.condition == Enum.FilterConditon.IsNotNull || value.condition == Enum.FilterConditon.IsNull) {
                let filter = {
                    key: value.key,
                    value: format.removeDatabaseInjection(value.value),
                    condition: value.condition,
                    conditionName: value.conditionName,
                    title: value.title,
                    selectedOption: value.selectedOption,
                }
                this.$store.commit('addItemFilter', filter);
            }
            this.closeFilterPopup();
        },
    },
    beforeMount() {
        this.onLoaded()
    }
};
</script>
<style  lang="scss" scoped>
@import "@/assets/scss/base/table.scss";

.image {
    width: 36px;
    height: 36px;
}

.image img {
    width: 100%;
    height: 100%;
}
</style>