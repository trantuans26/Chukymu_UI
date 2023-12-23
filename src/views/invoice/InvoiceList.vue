<template>
    <div class="employee">
        <div class="employee-header">
            <div class="employee-title">{{ $t('invoice_page.title') }}</div>
            <v-button @click="handleAction(Enum.ACTION.ADD)">
                {{ $t('invoice_page.add') }}
            </v-button>
        </div>
        <div class="employee-body">
            <!-- Các action như search, export, reload -->
            <div class="employee-body__toolbar">
                <div class="employee-body__toolbar-left">
                    <slot name="toolbar-left">
                        <div class="v-table__column-filter">
                            <div class="v-table__column-filter--text">
                                {{ $t("invoice_page.filter") }}: 
                            </div>
                        </div>
                        <div class="v-table__column-filter">
                            <div class="row sm-gutter flex--center">
                                <div class="col l-8 md-8">
                                    <v-combobox position="bottom" propKey="key" propValue="value" 
                                        v-model="selectedCollectedOptions" 
                                        :data="listCollectedOptions"
                                        :selectBox="true">
                                    </v-combobox>
                                </div>
                            </div>
                        </div>
                    </slot>
                </div>
                <div class="employee-body__toolbar-right">
                    <slot name="toolbar-right"></slot>
                    <v-input :placeholder="$t('invoice_page.search_function')" icon="ms-16 ms-icon ms-icon-search"
                        v-model="keyword" :outline="true" :styleProps="['width: 240px', 'font-style: italic']"
                        className="v-input__with-icon" :focus="true" 
                    />
                    <div :tooltip="$t('action.reload_data')" class="ms-24 ms-icon ms-icon-reload ms-r-2 ml-l-2"
                        @click="handleAction(Enum.ACTION.RELOAD)">
                    </div>
                </div>
            </div>
            <!-- Table hiển thị danh sách hóa đơn -->
            <v-table v-model:columns="columns" :data="invoiceList.data" @action="handleAction" :actions="tableAction"
                :isDataLoaded="isDataLoaded">
            </v-table>
            <!-- Phân trang -->
            <v-pagination v-model:pageSize="pagination.pageSize" v-model:pageNumber="pagination.pageNumber"
                v-model:totalRecord="invoiceList.totalRecord">
            </v-pagination>
        </div>
        <!-- Form sửa và thêm hóa đơn -->
        <invoice-form v-model="showInvoiceForm" @insertInvoice="insertInvoice" @updateInvoice="updateInvoice"></invoice-form>

        <!-- Khu vực hiển thị popup và toast thông báo -->
        <v-popup ref="popup"></v-popup>
        <v-toast ref="toast" :showProgress="true" :maxMessage="10"></v-toast>
    </div>
</template>
<script>
import InvoiceForm from './InvoiceForm.vue';
import Enum from "@/utils/enum";
import { mapGetters } from 'vuex';
export default {
    components: { InvoiceForm},
    data() {
        return {
            keyword: "", // biến này dùng để lưu từ khóa tìm kiếm
            showInvoiceForm: false, // biến này dùng để hiển thị form thêm mới hoặc cập nhật hóa đơn
            invoiceList: [], // biến này dùng để lưu danh sách hóa đơn
            pagination: {
                pageNumber: 1,
                pageSize: 20,
                keyword: "",
                isCollected: 2,
            }, // biến này dùng để lưu thông tin phân trang và tìm kiếm
            debounce: null, // biến này dùng để lưu hàm debounce,
            isDataLoaded: false, // biến này dùng để kiểm tra dữ liệu đã được load hay chưa
            listCollectedOptions: [
                {'key': 2, 'value': this.$t("filter.all")}, 
                {'key': 1, 'value': this.$t("filter.is_collected")}, 
                {'key': 0, 'value': this.$t("filter.is_not_collected")},
            ],
            selectedCollectedOptions: 2,
        };
    },
    computed: {
        ...mapGetters(['isInvoiceSelected']), // lấy giá trị từ store kiểm tra xem có hóa đơn nào được chọn hay không
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
                        title: this.$t(`invoice_table.code`),
                        key: 'invoiceCode',
                        search: true,
                    },
                    {
                        title: this.$t(`invoice_table.customer`),
                        key: 'customer',
                        search: true,
                    },
                    {
                        title: this.$t(`invoice_table.total_cost`),
                        key: 'totalCost',
                        type: 'currency'
                    },
                    {
                        title: this.$t(`invoice_table.purchase_date`),
                        width: "100px",
                        key: 'purchaseDate',
                        textAlign: 'center',
                        type: 'date',
                    },
                    {
                        title: this.$t(`invoice_table.employee`),
                        key: 'createdBy',
                    },
                    {
                        title: this.$t(`invoice_table.action`),
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
                let permission = this.$store.getters.getPermission;
                
                if(permission && permission.isManager) {
                    return [
                        {
                            'key': Enum.ACTION.EDIT,
                            'value': this.$t('action.edit'),
                        },
                        {
                            'key': Enum.ACTION.DELETE,
                            'value': this.$t('action.delete'),
                        }
                    ]; // Khởi tạo danh sách action trên từng dòng
                } else {
                    return [
                        {
                            'key': Enum.ACTION.EDIT,
                            'value': this.$t('action.edit'),
                        }
                    ]; // Khởi tạo danh sách action trên từng dòng
                }

            }
        }


    },
    watch: {
        selectedCollectedOptions: {
            handler: function (newVal) {
                this.pagination.isCollected = newVal;
                this.getInvoiceList();
                console.log(newVal + ': ', this.invoiceList);
            },
            deep: true,
        },
        
        /**
         * @description: Lắng nghe sự thay đổi khi người dùng thay đổi liên quan tới phân trang
         * Author: tttuan 06/10/2022
         */
        pagination: {
            handler: function (newVal) {
                this.getInvoiceList(newVal);
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
         * @description: Lắng nghe sự kiện khi người dùng thay đổi trạng thái của form thêm mới hoặc cập nhật hóa đơn bằng phím tắt
         * Author: tttuan 10/10/2022
         */
        action: {
            handler: function (newVal) {
                // let curentFocus = document.activeElement; // lấy phần tử đang được active
                switch (newVal) {
                    case Enum.ACTION.ADD: // tổ hợp phím  Ctrl + Alt + A để thêm mới hóa đơn
                        this.handleAction(newVal);
                        break;
                    case Enum.ACTION.DELETE: // phím delete để xóa hóa đơn
                        if (this.isInvoiceSelected) {
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
                        me.showAddInvoiceForm();
                        break;
                    case Enum.ACTION.EDIT: // xem hóa đơn
                        me.showViewInvoiceForm(data);
                        break;
                    case Enum.ACTION.DELETE: // xóa hóa đơn
                        me.deleteInvoice(data);
                        break;
                    case Enum.ACTION.DELETE_MANY: // xóa nhiều hóa đơn
                        me.deleteInvoiceMany(data);
                        break;
                    case Enum.ACTION.INACTIVE:
                        me.$root.$toast.info(me.$t('notice_message.developing'));
                        break;
                    case Enum.ACTION.RELOAD: // Tải lại danh sách hóa đơn
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
         * @description: Hàm này dùng để hiển thị form thêm mới hóa đơn
         * Author: tttuan 07/10/2022
         */
        showAddInvoiceForm() {
            const me = this;
            me.$store.dispatch('setMode', Enum.FORM_MODE.ADD);
            me.showInvoiceForm = true;
        },
        /**
         * @description: Hàm này dùng để sửa hóa đơn
         * @param {object} invoice - Dữ liệu của hóa đơn
         * Author: tttuan 07/10/2022
         */
        showViewInvoiceForm(invoice) {
            const me = this;
            me.$store.dispatch('setMode', Enum.FORM_MODE.EDIT);
            me.$store.dispatch('setInvoiceId', invoice.invoiceID);
            me.showInvoiceForm = true;
        },
        /**
         * @description: Hàm này dùng để xóa hóa đơn
         * @param {object} invoice - Dữ liệu của hóa đơn
         * Author: tttuan 07/10/2022
         */
        deleteInvoice(invoice) {
            const me = this;
            me.deleteInvoiceBackend(invoice);
        },
        /**
         * @description: Hàm này dùng để xóa nhiều hóa đơn
         * Author: tttuan 1/3/2023
         */
        async deleteInvoiceMany() {
            const me = this;
            const confirm = await me.$refs.popup.show({
                message: me.$t('notice_message.confirm_delete_many'),
                icon: Enum.ICON.WARNING,
                okButton: me.$t('confirm_popup.yes'),
                closeButton: me.$t('confirm_popup.cancel'),
            });
            if (confirm == me.$t('confirm_popup.yes')) {
                const result = await me.$store.dispatch('deleteMultipleEmployee');
                if (result > 0) {
                    me.$root.$toast.success(me.$t('notice_message.delete_many_success', [result]));
                    me.getInvoiceList();
                } else {
                    me.$root.$toast.error(me.$t('notice_message.delete_many_fail'));
                }
            }
        },

        /**
         * @description: Hàm này dùng để tải lại danh sách hóa đơn
         * Author: tttuan 07/10/2022
         */
        async reloadData() {
            const me = this;
            const res = await me.getInvoiceList();
            if (res) {
                me.$root.$toast.success(me.$t('notice_message.reload_data_success'));
            } else {
                me.$root.$toast.error(me.$t('notice_message.reload_data_fail'));
            }
        },
        /**
         * @description: Hàm này dùng để xuất danh sách hóa đơn ra file excel
         * Author: tttuan 05/10/2022
         */
        async exportExcel() {
            const me = this;
            try {
                me.$root.$toast.info(me.$t('notice_message.export_excel_processing'));
                const res = await me.$api.invoice.exportInventories(me.pagination); // kiểm tra xem có dữ liệu không
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
         * @description: Hàm này dùng để xóa hóa đơn ở bên backend
         * @param {object} data - Dữ liệu của hóa đơn cần xóa
         * Author: tttuan 19/09/2022
         */
        async deleteInvoiceBackend(employee) {
            const me = this;
            try {
                const confirm = await me.$refs.popup.show({
                    message: me.$t('notice_message.confirm_delete', [employee.invoiceCode]),
                    icon: Enum.ICON.WARNING,
                    okButton: me.$t('confirm_popup.yes'),
                    closeButton: me.$t('confirm_popup.cancel'),
                });
                if (confirm == me.$t('confirm_popup.yes')) {
                    const res = await me.$api.invoice.deleteInvoice(employee.invoiceID);
                    if (res.status == Enum.MISA_CODE.SUCCESS) {
                        me.deleteInvoiceFrontEnd(employee);
                    } else {
                        me.$root.$toast.error(me.$t('notice_message.delete_fail', [employee.invoiceCode]));
                    }
                }
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * @description: Hàm này dùng để xóa hóa đơn trong danh sách ở bên frontend
         * @param: {object} data - Dữ liệu của hóa đơn cần xóa 
         * Author: tttuan 22/09/2022
         */
        deleteInvoiceFrontEnd(data) {
            const me = this;
            const { invoiceID, invoiceCode } = data;
            try {
                const index = me.invoiceList.data.findIndex((item) => item.invoiceID === invoiceID);
                if (index !== -1) {
                    me.invoiceList.data.splice(index, 1);
                    me.$root.$toast.success(me.$t('notice_message.delete_success', [invoiceCode]));
                    me.invoiceList.totalRecord -= 1; // Giảm tổng số bản ghi đi 1
                }
            } catch (error) {
                me.$root.$toast.success(me.$t('notice_message.delete_fail', [invoiceCode]));
                console.log(error);
            }
        },

        /**
         * @description: Hàm này dùng để cập nhật hóa đơn ở bên frontend
         * Author: tttuan 05/10/2022
         */
        updateInvoice(invoice) {
            const me = this;
            try {
                const index = me.invoiceList.data.findIndex((item) => item.invoiceID === invoice.invoiceID);
                if (index !== -1) {
                    me.invoiceList.data.splice(index, 1);
                    me.invoiceList.data.unshift(invoice);
                    me.$root.$toast.success(me.$t('notice_message.update_success', [invoice.invoiceCode]));
                }
            } catch (error) {
                me.$root.$toast.error(me.$t('notice_message.update_fail', [invoice.invoiceCode]));
                console.log(error);
            }
        },

                /**
         * @description: Hàm này dùng để cập nhật hóa đơn ở bên frontend
         * Author: tttuan 05/10/2022
         */
        insertInvoice(invoice) {
            const me = this;
            try {
                me.invoiceList.data.unshift(invoice); // Thêm hàng hóa vào đầu mảng
                me.$root.$toast.success(me.$t('notice_message.insert_success', [invoice.invoiceCode]));
                me.invoiceList.totalRecord += 1; // Tăng tổng số bản ghi lên 1
            } catch (error) {
                me.$root.$toast.error(me.$t('notice_message.insert_fail', [invoice.invoiceCode]));
                console.log(error);
            }
        },

        /**
         * @description: Hàm này dùng để lấy danh sách hóa đơn
         * Author: tttuan 19/09/2022
         */
        async getInvoiceList() {
            const me = this;
            try {
                me.isDataLoaded = false;
                const result = await me.$api.invoice.getInvoicesFilter(me.pagination);
                if (result.status == Enum.MISA_CODE.SUCCESS) {
                    me.invoiceList = result.data;
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
        me.getInvoiceList(); // Lấy danh sách hóa đơn
        me.Enum = Enum; // Khởi tạo enum
    },

    updated() {
        let me = this;
        me.listCollectedOptions = [
            {'key': 2, 'value': this.$t("filter.all")}, 
            {'key': 1, 'value': this.$t("filter.is_collected")}, 
            {'key': 0, 'value': this.$t("filter.is_not_collected")},
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
                justify-content: center;
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
}

.pd--0 {
    padding-bottom: 0 !important;
}
</style>