<template>
    <div class="employee">
        <div class="employee-header">
            <div class="employee-title">{{ $t('employee_page.title') }}</div>
            <v-button @click="handleAction(Enum.ACTION.ADD)">
                {{ $t('employee_page.add_employee') }}
            </v-button>
        </div>
        <div class="employee-body">
            <!-- Các action như search, export, reload -->
            <div class="employee-body__toolbar">
                <div class="employee-body__toolbar-left">
                    <slot name="toolbar-left">
                        <v-dropdown className="secondary-light border-bold rounded" @onSelect="handleAction"
                            icon="ms-16 ms-icon ms-icon-arrow-down-black opacity-5" :items="bathAction"
                            :isShow="isEmployeeSelected">
                            {{ $t('action.batch_action') }}
                        </v-dropdown>
                    </slot>
                </div>
                <div class="employee-body__toolbar-right">
                    <slot name="toolbar-right"></slot>
                    <v-input :placeholder="$t('employee_page.search_function')" icon="ms-16 ms-icon ms-icon-search"
                        v-model="keyword" :outline="true" :styleProps="['width: 240px', 'font-style: italic']"
                        className="v-input__with-icon" :focus="true" 
                    />
                    <div :tooltip="$t('action.reload_data')" class="ms-24 ms-icon ms-icon-reload ms-r-2 ml-l-2"
                        @click="handleAction(Enum.ACTION.RELOAD)">
                    </div>
                </div>
            </div>
            <!-- Table hiển thị danh sách nhân viên -->
            <v-table v-model:columns="columns" :data="employeeList.data" @action="handleAction" :actions="tableAction"
                :isDataLoaded="isDataLoaded">
            </v-table>
            <!-- Phân trang -->
            <v-pagination v-model:pageSize="pagination.pageSize" v-model:pageNumber="pagination.pageNumber"
                v-model:totalRecord="employeeList.totalRecord">
            </v-pagination>
        </div>
        <!-- Form sửa và thêm nhân viên -->
        <employee-form v-model="showEmployeeForm" @insertEmployee="insertEmployee" @updateEmployee="updateEmployee">
        </employee-form>
        <!-- Khu vực hiển thị popup và toast thông báo -->

        <employee-vote v-model="showEmployeeVote" @insertEmployee="insertEmployee" @updateEmployee="updateEmployee">
        </employee-vote>
        <v-popup ref="popup"></v-popup>
        <v-toast ref="toast" :showProgress="true" :maxMessage="10"></v-toast>
    </div>
</template>
<script>
import EmployeeForm from './EmployeeForm.vue';
import EmployeeVote from './EmployeeVote.vue';
import Enum from "@/utils/enum";
import { mapGetters } from 'vuex';
export default {
    components: { EmployeeForm, EmployeeVote},
    data() {
        return {
            keyword: "", // biến này dùng để lưu từ khóa tìm kiếm
            showEmployeeForm: false, // biến này dùng để hiển thị form thêm mới hoặc cập nhật nhân viên
            showEmployeeVote: false, // biến này dùng để hiển thị form thêm mới hoặc cập nhật nhân viên
            employeeList: [], // biến này dùng để lưu danh sách nhân viên
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
                {'key': 1, 'value': this.$t("filter.is_manager")}, 
                {'key': 0, 'value': this.$t("filter.is_employee")}
            ],
            selectedOptions: 2,
        };
    },
    computed: {
        ...mapGetters(['isEmployeeSelected']), // lấy giá trị từ store kiểm tra xem có nhân viên nào được chọn hay không
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
                        key: 'employeeID',
                        fixed: true,
                        checkbox: true,
                        type: 'checkbox',
                        width: "40px",
                    },
                    {
                        title: this.$t(`employee_table.code`),
                        key: 'employeeCode',
                        search: true,
                    },
                    {
                        title: this.$t(`employee_table.name`),
                        key: 'employeeName',
                        width: "200px",
                        search: true,
                    },
                    {
                        title: this.$t(`employee_table.gender`),
                        key: 'gender',
                        type: 'gender',
                    },
                    {
                        title: this.$t(`employee_table.date_of_birth`),
                        key: 'dateOfBirth',
                        textAlign: 'center',
                        type: 'date',

                    },
                    {
                        title: this.$t(`employee_table.phone_number`),
                        key: 'phone',
                    },
                    {
                        title: this.$t(`employee_table.identity_card`),
                        key: 'identityNumber',
                    },
                    {
                        title: this.$t(`employee_table.vote_status`),
                        key: 'voteStatus',
                        type: 'voteStatus'
                    },
                    {
                        title: this.$t(`employee_table.action`),
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
                        'key': Enum.ACTION.VOTE,
                        'value': this.$t('action.vote'),
                    },
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

        employeesSelectedByID: {
            get() {
                return this.$store.getters.getListIdSelected;
            },
        }
    },
    watch: {
        selectedOptions: {
            handler: function (newVal) {
                this.pagination.filter = newVal;
                this.getEmployeeList();
                console.log(newVal + ': ', this.employeeList);
            },
            deep: true,
        },

        employeesSelectedByID: {
            handler: function (newVal) {
                this.$store.commit('setEmployeeSelected', newVal);
            },
            deep: true,
        },

        /**
         * @description: Lắng nghe sự thay đổi khi người dùng thay đổi liên quan tới phân trang
         * Author: tttuan 06/10/2022
         */
        pagination: {
            handler: function (newVal) {
                this.getEmployeeList(newVal);
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
         * @description: Lắng nghe sự kiện khi người dùng thay đổi trạng thái của form thêm mới hoặc cập nhật nhân viên bằng phím tắt
         * Author: tttuan 10/10/2022
         */
        action: {
            handler: function (newVal) {
                // let curentFocus = document.activeElement; // lấy phần tử đang được active
                switch (newVal) {
                    case Enum.ACTION.ADD: // tổ hợp phím  Ctrl + Alt + A để thêm mới nhân viên
                        this.handleAction(newVal);
                        break;
                    case Enum.ACTION.DELETE: // phím delete để xóa nhân viên
                        if (this.isEmployeeSelected) {
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
                    case Enum.ACTION.ADD: // thêm mới nhân viên
                        me.showAddEmployeeForm();
                        break;
                    case Enum.ACTION.VOTE: // thêm mới nhân viên
                        me.showVoteEmployeeForm(data);
                        break;
                    case Enum.ACTION.EDIT: // sửa nhân viên
                        me.showEditEmployeeForm(data);
                        break;
                    case Enum.ACTION.DELETE: // xóa nhân viên
                        me.deleteEmployee(data);
                        break;
                    case Enum.ACTION.DELETE_MANY: // xóa nhiều nhân viên
                        me.deleteManyEmployee(data);
                        break;
                    case Enum.ACTION.DUPLICATE: // Nhân bản nhân viên
                        me.duplicateEmployee(data);
                        break;
                    case Enum.ACTION.INACTIVE:
                        me.$root.$toast.info(me.$t('notice_message.developing'));
                        break;
                    case Enum.ACTION.RELOAD: // Tải lại danh sách nhân viên
                        me.reloadData();
                        break;
                }
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * @description: Hàm này dùng để hiển thị form thêm mới nhân viên
         * Author: tttuan 07/10/2022
         */
        showAddEmployeeForm() {
            const me = this;
            me.$store.dispatch('setMode', Enum.FORM_MODE.ADD);
            me.showEmployeeForm = true;
        },
        /**
         * @description: Hàm này dùng để hiển thị form thêm mới nhân viên
         * Author: tttuan 07/10/2022
         */
        showVoteEmployeeForm(employee) {
            const me = this;
            me.$store.dispatch('setMode', Enum.FORM_MODE.VOTE);
            me.$store.dispatch('setEmployeeId', employee.employeeID);
            me.showEmployeeVote = true;
        },
        /**
         * @description: Hàm này dùng để sửa nhân viên
         * @param {object} employee - Dữ liệu của nhân viên
         * Author: tttuan 07/10/2022
         */
        showEditEmployeeForm(employee) {
            const me = this;
            me.$store.dispatch('setMode', Enum.FORM_MODE.EDIT);
            me.$store.dispatch('setEmployeeId', employee.employeeID);
            me.showEmployeeForm = true;
        },
        /**
         * @description: Hàm này dùng để xóa nhân viên
         * @param {object} employee - Dữ liệu của nhân viên
         * Author: tttuan 07/10/2022
         */
        deleteEmployee(employee) {
            const me = this;
            me.deleteEmployeeBackend(employee);
        },
        /**
         * @description: Hàm này dùng để xóa nhiều nhân viên
         * Author: tttuan 1/3/2023
         */
        async deleteManyEmployee() {
            const me = this;
            const confirm = await me.$refs.popup.show({
                message: me.$t('notice_message.confirm_delete_many'),
                icon: Enum.ICON.WARNING,
                okButton: me.$t('confirm_popup.yes'),
                closeButton: me.$t('confirm_popup.cancel'),
            });
            if (confirm == me.$t('confirm_popup.yes')) {
                const result = await me.$store.dispatch('deleteMultipleEmployee');
                if (result != null) {
                    this.$store.commit('setListIdSelected', []);
                    me.$root.$toast.success(me.$t('notice_message.delete_many_success'));
                    me.getEmployeeList();
                } else {
                    me.$root.$toast.error(me.$t('notice_message.delete_many_fail'));
                }
            }
        },
        /**
         * @description: Hàm này dùng để nhân bản nhân viên
         * @param {object} employee - Dữ liệu của nhân viên
         * Author: tttuan 07/10/2022
         */
        async duplicateEmployee(employee) {
            const me = this;
            me.$store.dispatch('setMode', Enum.FORM_MODE.DUPLICATE);
            me.$store.dispatch('setEmployeeId', employee.employeeID);
            me.showEmployeeForm = true;
        },
        /**
         * @description: Hàm này dùng để tải lại danh sách nhân viên
         * Author: tttuan 07/10/2022
         */
        async reloadData() {
            const me = this;
            const res = await me.getEmployeeList();
            if (res) {
                me.$root.$toast.success(me.$t('notice_message.reload_data_success'));
            } else {
                me.$root.$toast.error(me.$t('notice_message.reload_data_fail'));
            }
        },
        /**
         * @description: Hàm này dùng để xóa nhân viên ở bên backend
         * @param {object} data - Dữ liệu của nhân viên cần xóa
         * Author: tttuan 19/09/2022
         */
        async deleteEmployeeBackend(employee) {
            const me = this;
            try {
                const confirm = await me.$refs.popup.show({
                    message: me.$t('notice_message.confirm_delete', [employee.employeeCode]),
                    icon: Enum.ICON.WARNING,
                    okButton: me.$t('confirm_popup.yes'),
                    closeButton: me.$t('confirm_popup.cancel'),
                });
                if (confirm == me.$t('confirm_popup.yes')) {
                    const res = await me.$api.employee.deleteEmployee(employee.employeeID);
                    if (res.status == Enum.MISA_CODE.SUCCESS) {
                        me.deleteEmployeeFrontEnd(employee);
                    } else {
                        me.$root.$toast.error(me.$t('notice_message.delete_fail', [employee.employeeCode]));
                    }
                }
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * @description: Hàm này dùng để xóa nhân viên trong danh sách ở bên frontend
         * @param: {object} data - Dữ liệu của nhân viên cần xóa 
         * Author: tttuan 22/09/2022
         */
        deleteEmployeeFrontEnd(data) {
            const me = this;
            const { employeeID, employeeCode } = data;
            try {
                const index = me.employeeList.data.findIndex((item) => item.employeeID === employeeID);
                if (index !== -1) {
                    me.employeeList.data.splice(index, 1);
                    me.$root.$toast.success(me.$t('notice_message.delete_success', [employeeCode]));
                    me.employeeList.totalRecord -= 1; // Giảm tổng số bản ghi đi 1
                }
            } catch (error) {
                me.$root.$toast.success(me.$t('notice_message.delete_fail', [employeeCode]));
                console.log(error);
            }
        },
        /**
         * @description: Hàm này đùng để nhận emit từ con nếu thành công thì thêm nhân viên vào bảng 
         * @param: {Object} employee - Dữ liệu của nhân viên
         * Author: tttuan 01/10/2022
         */
        insertEmployee(employee) {
            const me = this;
            try {
                me.employeeList.data.unshift(employee); // Thêm nhân viên vào đầu mảng
                me.$root.$toast.success(me.$t('notice_message.insert_success', [employee.employeeCode]));
                me.employeeList.totalRecord += 1; // Tăng tổng số bản ghi lên 1
            } catch (error) {
                me.$root.$toast.error(me.$t('notice_message.insert_fail', [employee.employeeCode]));
                console.log(error);
            }
        },
        /**
         * @description: Hàm này dùng để cập nhật nhân viên ở bên frontend
         * Author: tttuan 05/10/2022
         */
        updateEmployee(employee) {
            const me = this;
            try {
                const index = me.employeeList.data.findIndex((item) => item.employeeID === employee.employeeID);
                if (index !== -1) {
                    me.employeeList.data.splice(index, 1);
                    me.employeeList.data.unshift(employee);
                    me.$root.$toast.success(me.$t('notice_message.update_success', [employee.employeeCode]));
                }
            } catch (error) {
                me.$root.$toast.error(me.$t('notice_message.update_fail', [employee.employeeCode]));
                console.log(error);
            }
        },
        /**
         * @description: Hàm này dùng để lấy danh sách nhân viên
         * Author: tttuan 19/09/2022
         */
        async getEmployeeList() {
            const me = this;
            try {
                me.isDataLoaded = false;
                const result = await me.$api.employee.getEmployeesFilter(me.pagination);
                if (result.status == Enum.MISA_CODE.SUCCESS) {
                    me.employeeList = result.data;
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
        me.getEmployeeList(); // Lấy danh sách nhân viên
        me.Enum = Enum; // Khởi tạo enum
    },

    updated() {
        let me = this;
        me.employeesSelectedByID = this.$store.getters.getListIdSelected;
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