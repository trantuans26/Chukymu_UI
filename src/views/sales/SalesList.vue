<template>
    <div class="employee sales">
        <div class="employee-header sales-header">
            <div class="employee-title">{{ $t('sales_page.title') }}</div>
            <v-button @click="handleAction(Enum.ACTION.ADD)">
                {{ $t('sales_page.add_sales') }}
            </v-button>
        </div>
        <div class="employee-body sales-body">
            <!-- Các action như search, export, reload -->
            <div class="employee-body__toolbar">
                <div class="employee-body__toolbar-left">
                    <slot name="toolbar-left">
                        <v-dropdown className="secondary-light border-bold rounded" @onSelect="handleAction"
                            icon="ms-16 ms-icon ms-icon-arrow-down-black opacity-5" :items="bathAction"
                            :isShow="isInventorySelected">
                            {{ $t('action.batch_action') }}
                        </v-dropdown>
                    </slot>
                </div>
                <div class="employee-body__toolbar-right">
                    <slot name="toolbar-right"></slot>
                    <v-input :placeholder="$t('sales_page.search_function')" icon="ms-16 ms-icon ms-icon-search"
                        v-model="keyword" :outline="true" :styleProps="['width: 240px', 'font-style: italic']"
                        className="v-input__with-icon" :focus="true" 
                    />
                    <div :tooltip="$t('action.reload_data')" class="ms-24 ms-icon ms-icon-reload ms-r-2 ml-l-2"
                        @click="handleAction(Enum.ACTION.RELOAD)">
                    </div>
                    <div :tooltip="$t('action.export_excel')" class="ms-24 ms-icon ms-icon-excel ms-x-2"
                        @click="handleAction(Enum.ACTION.EXPORT)"></div>
                </div>
            </div>
            <!-- Table hiển thị danh sách hàng hóa -->
            <v-table v-model:columns="columns" :data="inventoryList.data" @action="handleAction"
                :isDataLoaded="isDataLoaded">
            </v-table>
            <!-- Phân trang -->
            <v-pagination v-model:pageSize="pagination.pageSize" v-model:pageNumber="pagination.pageNumber"
                v-model:totalRecord="inventoryList.totalRecord">
            </v-pagination>
        </div>
        <!-- Form sửa và thêm hàng hóa -->
        <sales-form v-model="showSalesForm" @insertInventory="insertInventory" @updateInventory="updateInventory"></sales-form>

        <!-- Khu vực hiển thị popup và toast thông báo -->
        <v-popup ref="popup"></v-popup>
        <v-toast ref="toast" :showProgress="true" :maxMessage="10"></v-toast>
    </div>
</template>
<script>
import SalesForm from './SalesForm.vue';
import Enum from "@/utils/enum";
import { mapGetters } from 'vuex';
export default {
    components: { SalesForm },
    data() {
        return {
            keyword: "", // biến này dùng để lưu từ khóa tìm kiếm
            showSalesForm: false, // biến này dùng để hiển thị form thêm mới hoặc cập nhật hàng hóa
            inventoryList: [], // biến này dùng để lưu danh sách hàng hóa
            pagination: {
                pageNumber: 1,
                pageSize: 20,
                keyword: "",
            }, // biến này dùng để lưu thông tin phân trang và tìm kiếm
            debounce: null, // biến này dùng để lưu hàm debounce,
            isDataLoaded: false, // biến này dùng để kiểm tra dữ liệu đã được load hay chưa

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
                    }
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
    },
    watch: {
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
                const self = this;
                clearTimeout(self.debounce);
                if (newVal) {
                    self.debounce = setTimeout(() => {
                        self.pagination.keyword = newVal.trim();
                    }, 500); // triển khai debounce để giảm số lần gọi api
                } else {
                    self.debounce = setTimeout(() => {
                        self.pagination.keyword = "";
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
            const self = this;
            try {
                switch (action) {
                    case Enum.ACTION.ADD: // thêm mới hàng hóa
                        self.showAddSalesForm();
                        break;
                    case Enum.ACTION.DELETE_MANY: // xóa nhiều hàng hóa
                        self.deleteInventoryMany(data);
                        break;
                    case Enum.ACTION.DUPLICATE: // Nhân bản hàng hóa
                        self.duplicateInventory(data);
                        break;
                    case Enum.ACTION.INACTIVE:
                        self.$root.$toast.info(self.$t('notice_message.developing'));
                        break;
                    case Enum.ACTION.RELOAD: // Tải lại danh sách hàng hóa
                        self.reloadData();
                        break;
                    case Enum.ACTION.EXPORT: // Xuất file excel
                        self.exportExcel();
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
        showAddSalesForm() {
            const self = this;
            self.$store.dispatch('setMode', Enum.FORM_MODE.ADD);
            self.showSalesForm = true;
        },
        /**
         * @description: Hàm này dùng để sửa hàng hóa
         * @param {object} inventory - Dữ liệu của hàng hóa
         * Author: tttuan 07/10/2022
         */
        showEditSalesForm(inventory) {
            const self = this;
            self.$store.dispatch('setMode', Enum.FORM_MODE.EDIT);
            self.$store.dispatch('setInventoryId', inventory.inventoryID);
            self.showSalesForm = true;
        },
        /**
         * @description: Hàm này dùng để xóa hàng hóa
         * @param {object} inventory - Dữ liệu của hàng hóa
         * Author: tttuan 07/10/2022
         */
        deleteInventory(inventory) {
            const self = this;
            self.deleteInventoryBackend(inventory);
        },
        /**
         * @description: Hàm này dùng để xóa nhiều hàng hóa
         * Author: tttuan 1/3/2023
         */
        async deleteInventoryMany() {
            const self = this;
            const confirm = await self.$refs.popup.show({
                message: self.$t('notice_message.confirm_delete_many'),
                icon: Enum.ICON.WARNING,
                okButton: self.$t('confirm_popup.yes'),
                closeButton: self.$t('confirm_popup.cancel'),
            });
            if (confirm == self.$t('confirm_popup.yes')) {
                const result = await self.$store.dispatch('deleteMultipleEmployee');
                if (result > 0) {
                    self.$root.$toast.success(self.$t('notice_message.delete_many_success', [result]));
                    self.getInventoryList();
                } else {
                    self.$root.$toast.error(self.$t('notice_message.delete_many_fail'));
                }
            }
        },
        /**
         * @description: Hàm này dùng để nhân bản hàng hóa
         * @param {object} employee - Dữ liệu của hàng hóa
         * Author: tttuan 07/10/2022
         */
        async duplicateInventory(employee) {
            const self = this;
            self.$store.dispatch('setMode', Enum.FORM_MODE.DUPLICATE);
            self.$store.dispatch('setInventoryId', employee.inventoryID);
            self.showSalesForm = true;
        },
        /**
         * @description: Hàm này dùng để tải lại danh sách hàng hóa
         * Author: tttuan 07/10/2022
         */
        async reloadData() {
            const self = this;
            const res = await self.getInventoryList();
            if (res) {
                self.$root.$toast.success(self.$t('notice_message.reload_data_success'));
            } else {
                self.$root.$toast.error(self.$t('notice_message.reload_data_fail'));
            }
        },
        /**
         * @description: Hàm này dùng để xuất danh sách hàng hóa ra file excel
         * Author: tttuan 05/10/2022
         */
        async exportExcel() {
            const self = this;
            try {
                self.$root.$toast.info(self.$t('notice_message.export_excel_processing'));
                const res = await self.$api.inventory.exportInventories(self.pagination); // kiểm tra xem có dữ liệu không
                if (res.status == Enum.MISA_CODE.SUCCESS) {
                    const link = document.createElement('a'); // tạo thẻ a để download file
                    link.href = res.request.responseURL; // đường dẫn tải file
                    link.click();
                    self.$root.$toast.success(self.$t('notice_message.export_excel_success'));
                }
            } catch (error) {
                self.$root.$toast.error(self.$t('notice_message.export_excel_fail'));
                console.log(error);
            }
        },
        /**
         * @description: Hàm này dùng để xóa hàng hóa ở bên backend
         * @param {object} data - Dữ liệu của hàng hóa cần xóa
         * Author: tttuan 19/09/2022
         */
        async deleteInventoryBackend(employee) {
            const self = this;
            try {
                const confirm = await self.$refs.popup.show({
                    message: self.$t('notice_message.confirm_delete', [employee.inventoryCode]),
                    icon: Enum.ICON.WARNING,
                    okButton: self.$t('confirm_popup.yes'),
                    closeButton: self.$t('confirm_popup.cancel'),
                });
                if (confirm == self.$t('confirm_popup.yes')) {
                    const res = await self.$api.inventory.deleteInventory(employee.inventoryID);
                    if (res.status == Enum.MISA_CODE.SUCCESS) {
                        self.deleteInventoryFrontEnd(employee);
                    } else {
                        self.$root.$toast.error(self.$t('notice_message.delete_fail', [employee.inventoryCode]));
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
            const self = this;
            const { inventoryID, inventoryCode } = data;
            try {
                const index = self.inventoryList.data.findIndex((item) => item.inventoryID === inventoryID);
                if (index !== -1) {
                    self.inventoryList.data.splice(index, 1);
                    self.$root.$toast.success(self.$t('notice_message.delete_success', [inventoryCode]));
                    self.inventoryList.totalRecord -= 1; // Giảm tổng số bản ghi đi 1
                }
            } catch (error) {
                self.$root.$toast.success(self.$t('notice_message.delete_fail', [inventoryCode]));
                console.log(error);
            }
        },
        /**
         * @description: Hàm này đùng để nhận emit từ con nếu thành công thì thêm hàng hóa vào bảng 
         * @param: {Object} employee - Dữ liệu của hàng hóa
         * Author: tttuan 01/10/2022
         */
        insertInventory(inventory) {
            const self = this;
            try {
                self.inventoryList.data.unshift(inventory); // Thêm hàng hóa vào đầu mảng
                self.$root.$toast.success(self.$t('notice_message.insert_success', [inventory.inventoryCode]));
                self.inventoryList.totalRecord += 1; // Tăng tổng số bản ghi lên 1
            } catch (error) {
                self.$root.$toast.error(self.$t('notice_message.insert_fail', [inventory.inventoryCode]));
                console.log(error);
            }
        },
        /**
         * @description: Hàm này dùng để cập nhật hàng hóa ở bên frontend
         * Author: tttuan 05/10/2022
         */
        updateInventory(inventory) {
            const self = this;
            try {
                const index = self.inventoryList.data.findIndex((item) => item.inventoryID === inventory.inventoryID);
                if (index !== -1) {
                    self.inventoryList.data.splice(index, 1);
                    self.inventoryList.data.unshift(inventory);
                    self.$root.$toast.success(self.$t('notice_message.update_success', [inventory.inventoryCode]));
                }
            } catch (error) {
                self.$root.$toast.error(self.$t('notice_message.update_fail', [inventory.inventoryCode]));
                console.log(error);
            }
        },
        /**
         * @description: Hàm này dùng để lấy danh sách hàng hóa
         * Author: tttuan 19/09/2022
         */
        async getInventoryList() {
            const self = this;
            try {
                self.isDataLoaded = false;
                const result = await self.$api.inventory.getInventoriesFilter(self.pagination);
                if (result.status == Enum.MISA_CODE.SUCCESS) {
                    self.inventoryList = result.data;
                    self.isDataLoaded = true;
                    return Promise.resolve(true);
                } else {
                    return Promise.resolve(false);
                }
            } catch (error) {
                self.$refs.popup.showError(self.$t('notice_message.get_employee_list_fail'));
                console.log(error);
                return Promise.reject(false);
            }
        },

    },
    created() { // Hàm này chạy khi component được tạo
        const self = this;
        self.getInventoryList(); // Lấy danh sách hàng hóa
        self.Enum = Enum; // Khởi tạo enum
    },
}
</script>
<style lang="scss" scoped>
:root {
    $height-row-cell: 60px !important;
}
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


</style>