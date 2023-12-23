<template>
    <div class="v-table__content">
        <v-loading :isLoaded="isLoaded"></v-loading>
        <div class="v-table">
            <table class="v-table__main">
                <thead class="v-table__header">
                    <tr class="v-table__header-row" tabindex="-1">
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
                                <span>{{ column.title }}</span>
                                <div class="v-table__header-icon ms-16 ms-icon-v2 ms-icon-header-option"
                                    @click="showFilterPopup(column, $event)" v-if="column.filterable">
                                </div>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody class="v-table__body">
                    <!-- Render body dựa vào key -->
                    <tr v-for="(row, indexList) of arrayTreeObj" :key="indexList" class="v-table__body-row">
                        <td v-for="(column, index) of columns" :key="index" class="v-table__body-cell"
                            :class="[`v-text__${column.textAlign ? column.textAlign : 'left'}`, { 'v-table__body-row-sticky': column.fixed }]"
                            :style="[{ minWidth: column.width ? column.width : 'auto' }, { width: column.width ? column.width : 'auto' }, { left: column.fixed ? `${column.left}px` : 'auto' }]"
                            @dblclick="column.fixed ? '' : onHandleEdit(row)">
                            <!-- Khởi tạo skeleton loading -->
                            <v-skeleton :loading="!isLoaded">
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
                                <!-- Nếu như type là status thì render status -->
                                <template v-else-if="column.type === 'status'">
                                    {{ row[column.key] ? convertStatus(row[column.key]) : '' }}
                                </template>
                                <!-- Nếu như type là gender thì render giới tính -->
                                <template v-else-if="column.type === 'gender'">
                                    {{ convertGender(row[column.key]) }}
                                </template>
                                <!-- Nếu như type là currency thì render tiền tệ -->
                                <template v-else-if="column.type === 'currency'">
                                    {{ formatCurrency(row[column.key]) }}
                                </template>
                                <!-- Nếu như type là action thì render action -->
                                <template v-else-if="column.type === 'action'">
                                    <v-menu :propKey="row" @onSelect="onSelect" :items="actions" :columns="columns">
                                    </v-menu>
                                </template>
                                <!-- Nếu như type là tree thì render tree -->
                                <!-- Nếu như không có type thì render giá trị của key -->
                                <template v-else-if="column.type === 'tree'">
                                    <span class="v-tree__item " :style="setPadding(row)">
                                        <span :class="iconName(row)" class="v-tree__icon"
                                            @click="toggle(row, indexList)"></span>
                                        <span class="v-tree__name"
                                            :class="{ 'font-weight-700': row.children.length > 0 }"> {{
                                                    row[column.key]
                                            }}</span>
                                    </span>
                                </template>
                                <template v-else>
                                    {{ row[column.key] }}
                                </template>
                            </v-skeleton>
                        </td>
                    </tr>
                </tbody>
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
        propKeyTree: { // key của tree
            type: String,
            required: false,
            default: 'id'
        },
    },
    data() {
        return {
            checkAllValue: false, // giá trị check all
            listFilter: [], // Lưu danh sách các filter
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
                type: Enum.FilterType.String,
                filterOptions: [],
                selectedOption: null,
            },
            itemId: "", // id của item được chọn
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
        /**
         * @description: chuyển đổi dữ liệu thành dạng tree
         * @param: {any} 
         * Author: tttuan 02/11/2022
         */
        arrayTreeObj() {
            let vm = this;
            var newData = [];
            vm.recursive(vm.data, newData, 0, vm.itemId, false);
            return newData;
        }
    },
    watch: {
        data: {
            handler: function () {
                // nếu click vào collapse thì sẽ không load lại dữ liệu
                if (this.itemId === "") {
                    this.onLoaded();
                }
                this.itemId = "";
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
         * @description: Trả về icon của tree expand or collapse
         * @param: {any} 
         * Author: tttuan 02/11/2022
         */
        iconName(item) {
            if (item.expend == true) {
                return "ms-16 ms-icon ms-icon-tree-collapse-small";
            }

            if (item.children.length > 0) {
                return "ms-16 ms-icon ms-icon-tree-expand-small";
            }
            return "ms-16";
        },
        /**
         * @description: Set margin cho tree item
         * @param: {any} 
         * Author: tttuan 02/11/2022
         */
        setPadding(item) {
            return `margin-left: ${item.level * 30}px`;
        },
        /**
         * @description: // hàm đệ quy để chuyển đổi dữ liệu thành dạng tree
         * @param {data} dữ liệu trả về từ api
         * @param {newObj} dữ liệu mới
         * @param {level} level của item
         * @param {itemId} key của item
         * @param {isExpend} trạng thái expand or collapse
         * Author: tttuan 02/11/2022
         */
        recursive(data, newObj, level, itemId, isExpend) {
            try {
                let vm = this;
                data.forEach(function (o) {
                    if (o.children && o.children.length != 0) { // nếu có children thì set một số giá trị như level và expend
                        o.level = level; // set level cho item
                        newObj.push(o); // thêm item vào mảng mới
                        if (o.id == itemId) { // nếu id của item bằng id được truyền vào thì set trạng thái expend cho item
                            o.expend = isExpend;
                        }
                        if (o.expend == true) { // nếu trạng thái expend của item là true thì gọi lại hàm đệ quy để hiển thị các item con
                            vm.recursive(o.children, newObj, o.level + 1, itemId, isExpend);
                        }
                    } else { // nếu không có children thì thêm item vào mảng mới
                        o.level = level;
                        newObj.push(o);
                        return false;
                    }
                });
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * @description: Hàm này dùng để toggle trạng thái expand or collapse của parent item
         * @param: {any} 
         * Author: tttuan 10/11/2022
         */
        toggle(item) {
            try {
                // hiển thị con của row được chọn
                let vm = this;
                vm.itemId = item[vm.propKeyTree]; // lấy id của item được chọn
                item.leaf = false;
                if (item.children.length > 0) { // hiển thị hoặc ẩn con của item được chọn
                    item.expend = !item.expend;
                    vm.recursive(item.children, [], item.level + 1, item.id, true);
                }
                if (item.expend == true && item.children.length >= 0) {
                    item.children.forEach(function (o) {
                        o.expend = undefined;
                    });
                    vm.$set(item, "expend", undefined);
                    vm.itemId = null;
                }
            } catch (error) {
                console.log();
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
        /**
          * @description: Hàm này dùng để tạo hiệu ứng loading sau khi load dữ liệu
          * @param: {any} 
          * Author: tttuan 20/10/2022
          */
        onLoaded() {
            this.isLoaded = false;
            setTimeout(() => {
                this.isLoaded = true;
            }, 200);
        },
        /**
         * @description: Hàm này dùng để show filter popup
         * @param: {any} 
         * Author: tttuan 10/11/2022
         */
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
            }
            const filter = this.$store.getters.getItemFilterByKey(column.key);
            if (filter) {
                self.filterPopup = {
                    ...self.filterPopup,
                    value: filter.value,
                    condition: filter.condition,
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

.v {
    &-tree__item {
        display: flex;
        align-items: center;
    }

    &-tree__icon {
        margin-right: 0.5rem;
    }

    &-tree__name {}
}
</style>