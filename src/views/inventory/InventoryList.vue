<template>
    <div class="employee">
        <div class="employee-header">
            <div class="employee-title">{{ $t('inventory_page.title') }}</div>
            <v-button @click="handleAction(Enum.ACTION.ADD)">
                {{ $t('inventory_page.add_inventory') }}
            </v-button>
        </div>
        <div class="employee-body">
            <!-- Các action như search, export, reload -->
            <div class="employee-body__toolbar">
                <div class="employee-body__toolbar-left">
                    <slot name="toolbar-left">
                        <v-dropdown className="secondary-light border-bold rounded" @onSelect="handleAction"
                            icon="ms-16 ms-icon ms-icon-arrow-down-black opacity-5" :items="bathAction"
                            :isShow="isInventorySelected">
                            {{ $t('action.batch_action') }}
                        </v-dropdown>

                        <div class="v-table__column-filter">
                            <div class="v-table__column-filter--text">
                                {{ $t("invoice_page.filter") }}: 
                            </div>
                        </div>
                        <div class="v-table__column-filter">
                            <div class="row sm-gutter flex--center">
                                <div class="col l-8 md-8">
                                    <v-combobox position="bottom" propKey="key" propValue="value" 
                                        v-model="selectedOptions" 
                                        :data="listOptions"
                                        :selectBox="true">
                                    </v-combobox>
                                </div>
                            </div>
                        </div>
                    </slot>
                </div>
                <div class="employee-body__toolbar-right">
                    <slot name="toolbar-right"></slot>
                    <v-input :placeholder="$t('inventory_page.search_function')" icon="ms-16 ms-icon ms-icon-search"
                        v-model="keyword" :outline="true" :styleProps="['width: 240px', 'font-style: italic']"
                        className="v-input__with-icon" :focus="true" 
                    />
                    <div :tooltip="$t('action.reload_data')" class="ms-24 ms-icon ms-icon-reload ms-r-2 ml-l-2"
                        @click="handleAction(Enum.ACTION.RELOAD)">
                    </div>
                </div>
            </div>
            <!-- Table hiển thị danh sách hàng hóa -->
            <v-table v-model:columns="columns" :data="inventoryList.data" @action="handleAction" :actions="tableAction"
                :isDataLoaded="isDataLoaded">
            </v-table>
            <!-- Phân trang -->
            <v-pagination v-model:pageSize="pagination.pageSize" v-model:pageNumber="pagination.pageNumber"
                v-model:totalRecord="inventoryList.totalRecord">
            </v-pagination>
        </div>
        <!-- Form sửa và thêm hàng hóa -->
        <inventory-form v-model="showInventoryForm" @insertInventory="insertInventory" @updateInventory="updateInventory"></inventory-form>

        <!-- Khu vực hiển thị popup và toast thông báo -->
        <v-popup ref="popup"></v-popup>
        <v-toast ref="toast" :showProgress="true" :maxMessage="10"></v-toast>
    </div>
</template>
<script>
import InventoryForm from './InventoryForm.vue';
import Enum from "@/utils/enum";
import { mapGetters } from 'vuex';
export default {
    components: { InventoryForm },
    data() {
        return {
            keyword: "", // biến này dùng để lưu từ khóa tìm kiếm
            showInventoryForm: false, // biến này dùng để hiển thị form thêm mới hoặc cập nhật hàng hóa
            inventoryList: [], // biến này dùng để lưu danh sách hàng hóa
            pagination: {
                pageNumber: 1,
                pageSize: 20,
                keyword: "",
                filter: 2,
            }, // biến này dùng để lưu thông tin phân trang và tìm kiếm
            debounce: null, // biến này dùng để lưu hàm debounce,
            isDataLoaded: false, // biến này dùng để kiểm tra dữ liệu đã được load hay chưa
            listOptions: [
                {'key': 2, 'value': this.$t("filter.all")}, 
                {'key': 1, 'value': this.$t("filter.runnin_out-of-stock")}, 
                {'key': 0, 'value': this.$t("filter.out-of-stock")}
            ],
            selectedOptions: 2,
        };
    },
    computed: {
        ...mapGetters(['isInventorySelected']), // lấy giá trị từ store kiểm tra xem có hàng hóa nào được chọn hay không
        /**
         * @description: Lấy ra các action key (phím tắt) lưu trữ trong store 
         * Author: tttuan 11/10/2022
         */
        action: {
            get() {
                return this.$store.getters.getActionKey;
            },
            set(value) {
                this.$store.commit('setActionKey', value);
            }
        },
        /**
         * @description: Khai báo các cột hiển thị trong table
         * Author: tttuan 11/10/2022
         */
        columns: {
            get() {
                return [
                    {
                        title: '',
                        key: 'inventoryID',
                        fixed: true,
                        checkbox: true,
                        type: 'checkbox',
                        width: "40px",
                    },
                    {
                        title: this.$t(`inventory_table.code`),
                        key: 'inventoryCode',
                        search: true,
                    },
                    {
                        title: this.$t(`inventory_table.name`),
                        key: 'inventoryName',
                        width: "270px",
                        search: true,
                    },
                    {
                        title: this.$t(`inventory_table.quantity`),
                        key: 'quantity',
                    },
                    {
                        title: this.$t(`inventory_table.cost`),
                        key: 'cost',
                        type: 'currency'
                    },
                    {
                        title: this.$t(`inventory_table.inventory_category`),
                        key: 'inventoryCategoryName',
                    },
                    {
                        title: this.$t(`inventory_table.image`),
                        key: 'image',
                        type: 'image'
                    },
                    {
                        title: this.$t(`inventory_table.action`),
                        key: 'action',
                        type: 'action',
                        fixed: true,
                        textAlign: 'center',
                        width: "120px",
                    },
                ];
            },
            set(value) {
                this.columns = value;
                console.log(this.columns);
            }
        },
        /**
         * @description: Khai báo các action thực hiện hàng loạt
         * Author: tttuan 11/10/2022
         */
        bathAction: {
            get() {
                return [{ 'key': Enum.ACTION.DELETE_MANY, 'value': this.$t('action.delete') }];
            }
        },
        /**
         * @description: Khai báo các action thực hiện trên từng dòng của table
         * Author: tttuan 11/10/2022
         */
        tableAction: {
            get() {
                return [
                    {
                        'key': Enum.ACTION.DUPLICATE,
                        'value': this.$t('action.duplicate'),
                    },
                    {
                        'key': Enum.ACTION.DELETE,
                        'value': this.$t('action.delete'),
                    }
                ]; // Khởi tạo danh sách action trên từng dòng
            }
        },

        inventoriesSelectedByID: {
            get() {
                return this.$store.getters.getListIdSelected;
            },
        }
    },
    watch: {
        selectedOptions: {
            handler: function (newVal) {
                this.pagination.filter = newVal;
                this.getInventoryList();
                console.log(newVal + ': ', this.inventoryList);
            },
            deep: true,
        },

        inventoriesSelectedByID: {
            handler: function (newVal) {
                this.$store.commit('setInventorySelected', newVal);
            },
            deep: true,
        },

        /**
         * @description: Lắng nghe sự thay đổi khi người dùng thay đổi liên quan tới phân trang
         * Author: tttuan 06/10/2022
         */
        pagination: {
            handler: function (newVal) {
                this.getInventoryList(newVal);
            },
            deep: true,
        },
        /**
         * @description: Lắng nghe sự thay đổi khi người dùng thay đổi liên quan tới từ khóa tìm kiếm
         * Author: tttuan 06/10/2022
         */
        keyword: {
            /**
            * @description: Dùng debounce để tránh việc gọi api liên tục khi người dùng nhập từ khóa
            * Author: tttuan 23/09/2022
            */
            handler: function (newVal) {
                const me = this;
                clearTimeout(me.debounce);
                if (newVal) {
                    me.debounce = setTimeout(() => {
                        me.pagination.keyword = newVal.trim();
                    }, 500); // triển khai debounce để giảm số lần gọi api
                } else {
                    me.debounce = setTimeout(() => {
                        me.pagination.keyword = "";
                    }, 500); // triển khai debounce để giảm số lần gọi api
                }

            },
        },
        /**
         * @description: Lắng nghe sự kiện khi người dùng thay đổi trạng thái của form thêm mới hoặc cập nhật hàng hóa bằng phím tắt
         * Author: tttuan 10/10/2022
         */
        action: {
            handler: function (newVal) {
                // let curentFocus = document.activeElement; // lấy phần tử đang được active
                switch (newVal) {
                    case Enum.ACTION.ADD: // tổ hợp phím  Ctrl + Alt + A để thêm mới hàng hóa
                        this.handleAction(newVal);
                        break;
                    case Enum.ACTION.DELETE: // phím delete để xóa hàng hóa
                        if (this.isInventorySelected) {
                            this.handleAction(Enum.ACTION.DELETE_MANY);
                        }
                        break;
                    case Enum.ACTION.EXPORT:
                        this.handleAction(Enum.ACTION.EXPORT);
                        break;
                    case Enum.ACTION.RELOAD: // tổ hợp phím Ctrl + R để reload lại table
                        this.handleAction(Enum.ACTION.RELOAD);
                        break;
                    default:
                        break;
                }
            },
            deep: true,
        }
    },

    methods: {
        /**
         * @description: Thực hiện các action như thêm mới, sửa, xóa, xóa nhiều, tải lại dữ liệu, xuất ra excel
         * @param {string} action - Tên của action
         * @param {object} data - Dữ liệu của action
         * Author: tttuan 16/09/2022
         */
        handleAction(action, data) {
            const me = this;
            try {
                switch (action) {
                    case Enum.ACTION.ADD: // thêm mới hàng hóa
                        me.showAddInventoryForm();
                        break;
                    case Enum.ACTION.EDIT: // sửa hàng hóa
                        me.showEditInventoryForm(data);
                        break;
                    case Enum.ACTION.DELETE: // xóa hàng hóa
                        me.deleteInventory(data);
                        break;
                    case Enum.ACTION.DELETE_MANY: // xóa nhiều hàng hóa
                        me.deleteInventoryMany(data);
                        break;
                    case Enum.ACTION.DUPLICATE: // Nhân bản hàng hóa
                        me.duplicateInventory(data);
                        break;
                    case Enum.ACTION.INACTIVE:
                        me.$root.$toast.info(me.$t('notice_message.developing'));
                        break;
                    case Enum.ACTION.RELOAD: // Tải lại danh sách hàng hóa
                        me.reloadData();
                        break;
                    case Enum.ACTION.EXPORT: // Xuất file excel
                        me.exportExcel();
                        break;
                }
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * @description: Hàm này dùng để hiển thị form thêm mới hàng hóa
         * Author: tttuan 07/10/2022
         */
        showAddInventoryForm() {
            const me = this;
            me.$store.dispatch('setMode', Enum.FORM_MODE.ADD);
            me.showInventoryForm = true;
        },
        /**
         * @description: Hàm này dùng để sửa hàng hóa
         * @param {object} inventory - Dữ liệu của hàng hóa
         * Author: tttuan 07/10/2022
         */
        showEditInventoryForm(inventory) {
            const me = this;
            me.$store.dispatch('setMode', Enum.FORM_MODE.EDIT);
            me.$store.dispatch('setInventoryId', inventory.inventoryID);
            me.showInventoryForm = true;
        },
        /**
         * @description: Hàm này dùng để xóa hàng hóa
         * @param {object} inventory - Dữ liệu của hàng hóa
         * Author: tttuan 07/10/2022
         */
        deleteInventory(inventory) {
            const me = this;
            me.deleteInventoryBackend(inventory);
        },
        /**
         * @description: Hàm này dùng để xóa nhiều hàng hóa
         * Author: tttuan 1/3/2023
         */
        async deleteInventoryMany() {
            const me = this;
            const confirm = await me.$refs.popup.show({
                message: me.$t('notice_message.confirm_delete_many'),
                icon: Enum.ICON.WARNING,
                okButton: me.$t('confirm_popup.yes'),
                closeButton: me.$t('confirm_popup.cancel'),
            });
            if (confirm == me.$t('confirm_popup.yes')) {
                const result = await me.$store.dispatch('deleteMultipleInventory');
                if (result != null) {
                    me.$root.$toast.success(me.$t('notice_message.delete_many_success'));
                    this.$store.commit('setListIdSelected', []);
                    me.getInventoryList();
                } else {
                    me.$root.$toast.error(me.$t('notice_message.delete_many_fail'));
                }
            }
        },
        /**
         * @description: Hàm này dùng để nhân bản hàng hóa
         * @param {object} employee - Dữ liệu của hàng hóa
         * Author: tttuan 07/10/2022
         */
        async duplicateInventory(employee) {
            const me = this;
            me.$store.dispatch('setMode', Enum.FORM_MODE.DUPLICATE);
            me.$store.dispatch('setInventoryId', employee.inventoryID);
            me.showInventoryForm = true;
        },
        /**
         * @description: Hàm này dùng để tải lại danh sách hàng hóa
         * Author: tttuan 07/10/2022
         */
        async reloadData() {
            const me = this;
            const res = await me.getInventoryList();
            if (res) {
                me.$root.$toast.success(me.$t('notice_message.reload_data_success'));
            } else {
                me.$root.$toast.error(me.$t('notice_message.reload_data_fail'));
            }
        },
        /**
         * @description: Hàm này dùng để xuất danh sách hàng hóa ra file excel
         * Author: tttuan 05/10/2022
         */
        async exportExcel() {
            const me = this;
            try {
                me.$root.$toast.info(me.$t('notice_message.export_excel_processing'));
                const res = await me.$api.inventory.exportInventories(me.pagination); // kiểm tra xem có dữ liệu không
                if (res.status == Enum.MISA_CODE.SUCCESS) {
                    const link = document.createElement('a'); // tạo thẻ a để download file
                    link.href = res.request.responseURL; // đường dẫn tải file
                    link.click();
                    me.$root.$toast.success(me.$t('notice_message.export_excel_success'));
                }
            } catch (error) {
                me.$root.$toast.error(me.$t('notice_message.export_excel_fail'));
                console.log(error);
            }
        },
        /**
         * @description: Hàm này dùng để xóa hàng hóa ở bên backend
         * @param {object} data - Dữ liệu của hàng hóa cần xóa
         * Author: tttuan 19/09/2022
         */
        async deleteInventoryBackend(employee) {
            const me = this;
            try {
                const confirm = await me.$refs.popup.show({
                    message: me.$t('notice_message.confirm_delete', [employee.inventoryCode]),
                    icon: Enum.ICON.WARNING,
                    okButton: me.$t('confirm_popup.yes'),
                    closeButton: me.$t('confirm_popup.cancel'),
                });
                if (confirm == me.$t('confirm_popup.yes')) {
                    const res = await me.$api.inventory.deleteInventory(employee.inventoryID);
                    if (res.status == Enum.MISA_CODE.SUCCESS) {
                        me.deleteInventoryFrontEnd(employee);
                    } else {
                        me.$root.$toast.error(me.$t('notice_message.delete_fail', [employee.inventoryCode]));
                    }
                }
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * @description: Hàm này dùng để xóa hàng hóa trong danh sách ở bên frontend
         * @param: {object} data - Dữ liệu của hàng hóa cần xóa 
         * Author: tttuan 22/09/2022
         */
        deleteInventoryFrontEnd(data) {
            const me = this;
            const { inventoryID, inventoryCode } = data;
            try {
                const index = me.inventoryList.data.findIndex((item) => item.inventoryID === inventoryID);
                if (index !== -1) {
                    me.inventoryList.data.splice(index, 1);
                    me.$root.$toast.success(me.$t('notice_message.delete_success', [inventoryCode]));
                    me.inventoryList.totalRecord -= 1; // Giảm tổng số bản ghi đi 1
                }
            } catch (error) {
                me.$root.$toast.success(me.$t('notice_message.delete_fail', [inventoryCode]));
                console.log(error);
            }
        },
        /**
         * @description: Hàm này đùng để nhận emit từ con nếu thành công thì thêm hàng hóa vào bảng 
         * @param: {Object} employee - Dữ liệu của hàng hóa
         * Author: tttuan 01/10/2022
         */
        insertInventory(inventory) {
            const me = this;
            try {
                me.inventoryList.data.unshift(inventory); // Thêm hàng hóa vào đầu mảng
                me.$root.$toast.success(me.$t('notice_message.insert_success', [inventory.inventoryCode]));
                me.inventoryList.totalRecord += 1; // Tăng tổng số bản ghi lên 1
            } catch (error) {
                me.$root.$toast.error(me.$t('notice_message.insert_fail', [inventory.inventoryCode]));
                console.log(error);
            }
        },
        /**
         * @description: Hàm này dùng để cập nhật hàng hóa ở bên frontend
         * Author: tttuan 05/10/2022
         */
        updateInventory(inventory) {
            const me = this;
            try {
                const index = me.inventoryList.data.findIndex((item) => item.inventoryID === inventory.inventoryID);
                if (index !== -1) {
                    me.inventoryList.data.splice(index, 1);
                    me.inventoryList.data.unshift(inventory);
                    me.$root.$toast.success(me.$t('notice_message.update_success', [inventory.inventoryCode]));
                }
            } catch (error) {
                me.$root.$toast.error(me.$t('notice_message.update_fail', [inventory.inventoryCode]));
                console.log(error);
            }
        },
        /**
         * @description: Hàm này dùng để lấy danh sách hàng hóa
         * Author: tttuan 19/09/2022
         */
        async getInventoryList() {
            const me = this;
            try {
                me.isDataLoaded = false;
                const result = await me.$api.inventory.getInventoriesFilter(me.pagination);
                if (result.status == Enum.MISA_CODE.SUCCESS) {
                    me.inventoryList = result.data;
                    me.isDataLoaded = true;
                    return Promise.resolve(true);
                } else {
                    return Promise.resolve(false);
                }
            } catch (error) {
                me.$refs.popup.showError(me.$t('notice_message.get_employee_list_fail'));
                console.log(error);
                return Promise.reject(false);
            }
        },

    },
    created() { // Hàm này chạy khi component được tạo
        const me = this;
        me.getInventoryList(); // Lấy danh sách hàng hóa
        me.Enum = Enum; // Khởi tạo enum
    },

    updated() {
        let me = this;
        me.inventoriesSelectedByID = this.$store.getters.getListIdSelected;

        me.listOptions = [
            {'key': 2, 'value': this.$t("filter.all")}, 
            {'key': 1, 'value': this.$t("filter.runnin_out-of-stock")}, 
            {'key': 0, 'value': this.$t("filter.out-of-stock")}
        ];
    },
}
</script>
<style lang="scss" scoped>

.employee {
    width: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;

    &-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        box-sizing: border-box;
    }

    &-title {
        font-size: 24px;
        font-family: "MISA Fonts Bold";
    }

    &-body {
        background-color: #fff;
        box-sizing: border-box;
        flex: 1;
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;

        &__toolbar {
            display: flex;
            justify-content: space-between;
            padding: 16px;
            margin-bottom: 16px;
            margin-top: 20px;

            &-left {
                display: flex;
                align-items: center;
            }

            &-right {
                display: flex;
                align-items: center;
            }
        }
    }
}

.v-table__column-filter--text {
    font-weight: 700;
    margin-right: 12px;
    font-family: "MISA Fonts Bold";
    font-size: 14px;
    margin-left: 24px;
}
</style>