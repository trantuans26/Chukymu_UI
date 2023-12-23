<template>
    <div class="dashboard">
        <div class="dashboard__header">
            <div class="dashboard__title">{{ $t('dashboard_page.title') }}</div>
        </div>
        <div class="dashboard__body">
            <!-- Đơn mua hàng -->
            <div class="dashboard__item dashboard__item--top">
                <div class="item__header item__header--color">
                    <div class="item__title">
                        {{ $t('dashboard_page.invoice') }}
                    </div>

                    <div class="item__function">
                        <div class="item__reset" :tooltip="$t('action.reload_data')" @click="loadSumTotalCosts">
                            <i class="icon icon__reset"></i>
                        </div>
                    </div>
                </div>

                <div class="item__body item__body--invoice">
                    <v-skeleton :loading="isLoadSumTotalCost">
                        <div></div>
                    </v-skeleton>

                    <div class="invoice__item invoice__sum" v-show="!isLoadSumTotalCost">
                        <div class="invoice__label"> {{ $t("dashboard_form.sum_total_cost") }} </div>

                        <div class="invoice__value"> {{ formatCurrency(sumTotalCost) }} </div>
                    </div>

                    <div class="divide-line"></div>

                    <v-skeleton :loading="isLoadSumTotalCost">
                        <div></div>
                    </v-skeleton>

                    <div class="invoice__item" v-show="!isLoadSumTotalCost">
                        <div class="invoice__label"> {{ $t("dashboard_form.is_collected") }} </div>        

                        <div class="invoice__value"> {{ formatCurrency(sumTotalCostIsCollected) }} </div>
                    </div>

                    <div class="divide-line"></div>

                    <v-skeleton :loading="isLoadSumTotalCost">
                        <div></div>
                    </v-skeleton>

                    <div class="invoice__item" v-show="!isLoadSumTotalCost">
                        <div class="invoice__label"> {{ $t("dashboard_form.is_not_collected") }} </div>        
                        
                        <div class="invoice__value"> {{ formatCurrency(sumTotalCostIsNotCollected) }} </div>
                    </div>
                </div>
            </div>
            <!-- End: Đơn mua hàng -->

            <!-- Hàng hóa -->
            <div class="dashboard__item dashboard__item--top">
                <div class="item__header item__header--color">
                    <div class="item__title">
                        {{ $t('dashboard_page.inventory') }}
                    </div>

                    <div class="item__function">
                        <div class="item__reset" :tooltip="$t('action.reload_data')" @click="loadMinQuantity">
                            <i class="icon icon__reset"></i>
                        </div>
                    </div>
                </div>

                <div class="item__body">
                    <v-skeleton :loading="isLoadMinQuantity">
                        <div></div>
                    </v-skeleton>

                    <div class="item__box item__box--warning item__box--left" v-show="!isLoadMinQuantity">
                        <div class="item__icon item__icon--warning">
                            <div class="icon__box--warning"></div>
                        </div>

                        <div class="item__content">
                            <div class="item__value"> {{ lessThanFive }} </div>

                            <div class="item__text"> {{ $t('dashboard_page.inventory_warning') }} </div>
                        </div>
                    </div>

                    <v-skeleton :loading="isLoadMinQuantity">
                        <div></div>
                    </v-skeleton>

                    <div class="item__box item__box--empty" v-show="!isLoadMinQuantity">
                        <div class="item__icon item__icon--empty">
                            <div class="icon__box--empty"></div>
                        </div>

                        <div class="item__content">
                            <div class="item__value"> {{ equalZero }} </div>

                            <div class="item__text"> {{ $t('dashboard_page.inventory_empty') }} </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- End: Hàng hóa -->

            <!-- Doanh thu nhiều nhất -->
            <div class="dashboard__item">
                <div class="item__header">
                    <div class="item__title item__title--black">
                        {{ $t('dashboard_page.revenue') }}
                    </div>

                    <div class="item__function">
                        <div class="item__date">
                        </div>

                        <div class="item__reset" :tooltip="$t('action.reload_data')" @click="loadTopInvoices">
                            <i class="icon icon__reset--spray"></i>
                        </div>
                    </div>
                </div>

                <div class="item__body item__body--statistic">
                    <div class="revenue__list">
                        <div class="revenue__row revenue__head">
                            <div class="revenue__col revenue__col--left revenue__item"> {{ $t('dashboard_form.inventory_code') }} </div>
                            <div class="revenue__col--fill revenue__item"> {{ $t('dashboard_form.inventory_name') }} </div>
                            <div class="revenue__col revenue__col--right revenue__item"> {{ $t('dashboard_form.cost') }} </div>
                        </div>

                        <div class="revenue__body"
                            v-for="item in listTopInvoice"
                            :key="item"
                            v-show="!isLoadTopInvoice"
                        >
                            <div class="revenue__row">
                                <div class="revenue__col revenue__col--left revenue__item"> {{ item.inventoryCode }} </div>
                                <div class="revenue__col--fill revenue__item"> {{ item.inventoryName }} </div>
                                <div class="revenue__col revenue__col--right revenue__item"> {{ formatCurrency(item.cost) }} </div>
                            </div>
                        </div>

                        <div class="revenue__body"
                            v-for="item in listTopInvoice"
                            :key="item"
                            v-show="isLoadTopInvoice"
                        >
                            <div class="revenue__row">
                                <v-skeleton :loading="true">
                                    <div></div>
                                </v-skeleton>

                                <v-skeleton :loading="true">
                                    <div></div>
                                </v-skeleton>

                                <v-skeleton :loading="true">
                                    <div></div>
                                </v-skeleton>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <!-- End: Doanh thu nhiều nhất -->

            <!-- Giá trị hàng hóa -->
            <div class="dashboard__item">
                <div class="item__header">
                    <div class="item__title item__title--black">
                        {{ $t('dashboard_page.inventory_value') }}
                    </div>

                    <div class="item__function">
                        <div class="item__reset"
                            @click="loadTopInventory"
                            :tooltip="$t('action.reload_data')"
                        >
                            <i class="icon icon__reset--spray"></i>
                        </div>
                    </div>
                </div>

                <div class="item__body item__body--statistic">
                    <div class="statistic__total">
                        <v-skeleton :loading="isLoadTopInventory">
                            
                            <div></div>
                        </v-skeleton>
                        <div class="statistic__value" v-show="!isLoadTopInventory">
                            {{ formatCurrency(this.totalCostInventory) }}
                        </div>

                        <div class="statistic__label">
                            {{ $t('dashboard_form.total_cost') }}
                        </div>
                    </div>

                    <div class="statistic__list">
                        <div class="statistic__row statistic__head">
                            <div class="statistic__col--fill statistic__item"> {{ $t('dashboard_form.name') }} </div>
                            <div class="statistic__col statistic__col--right statistic__item"> {{ $t('dashboard_form.quantity') }} </div>
                            <div class="statistic__col statistic__col--right statistic__item"> {{ $t('dashboard_form.cost') }} </div>
                        </div>

                        <div class="statistic__body"
                            v-for="item in listTopInventory"
                            :key="item"
                            v-show="!isLoadTopInventory"
                        >
                            <div class="statistic__row">
                                <div class="statistic__col--fill statistic__item"> {{ item.inventoryName }} </div>
                                <div class="statistic__col statistic__col--right statistic__item"> {{ item.quantity }} </div>
                                <div class="statistic__col statistic__col--right statistic__item"> {{ formatCurrency(item.cost) }} </div>
                            </div>
                        </div>

                        <div class="statistic__body"
                            v-for="item in listTopInventory"
                            :key="item"
                            v-show="isLoadTopInventory"
                        >
                            <div class="statistic__row">
                                <v-skeleton :loading="true">
                                    <div></div>
                                </v-skeleton>
                                <v-skeleton :loading="true">
                                    <div></div>
                                </v-skeleton>
                                <v-skeleton :loading="true">
                                    <div></div>
                                </v-skeleton>                                                                                               
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- End: Giá trị hàng hóa -->
        </div>
    </div>
</template>
<script>
import Enum from "@/utils/enum";
import { mapGetters } from 'vuex';
import { formatCurrency } from '@/utils/format';
export default {

    created() { // Hàm này chạy khi component được tạo
        const me = this;
        me.getInventoryList(); // Lấy danh sách hàng hóa
        me.Enum = Enum; // Khởi tạo enum

        me.loadFullAPI();

        this.listDate = [
            this.$t('dashboard_page.All'),
            this.$t('dashboard_page.current_year'),
            this.$t('dashboard_page.last_year'),
            this.$t('dashboard_page.current_month'),
            this.$t('dashboard_page.today'),
            this.$t('dashboard_page.yesterday'),
            this.$t('dashboard_page.January'),
            this.$t('dashboard_page.February'),
            this.$t('dashboard_page.March'),
            this.$t('dashboard_page.April'),
            this.$t('dashboard_page.May'),
            this.$t('dashboard_page.June'),
            this.$t('dashboard_page.July'),
            this.$t('dashboard_page.August'),
            this.$t('dashboard_page.September'),
            this.$t('dashboard_page.October'),
            this.$t('dashboard_page.November'),
            this.$t('dashboard_page.December'),
        ];
    },

    data() {
        return {
            keyword: "", // biến này dùng để lưu từ khóa tìm kiếm
            showInventoryForm: false, // biến này dùng để hiển thị form thêm mới hoặc cập nhật hàng hóa
            inventoryList: [], // biến này dùng để lưu danh sách hàng hóa
            pagination: {
                pageNumber: 1,
                pageSize: 20,
                keyword: "",
            }, // biến này dùng để lưu thông tin phân trang và tìm kiếm
            debounce: null, // biến này dùng để lưu hàm debounce,
            isDataLoaded: false, // biến này dùng để kiểm tra dữ liệu đã được load hay chưa
            listDate: [
            ],
            dateSelected: "Tháng này",
            listTopInventory: [],

            /* Hàng hóa */
            totalCostInventory: 0,
            lessThanFive: 0,
            equalZero: 0,
            isLoadTopInventory: false,
            isLoadMinQuantity: false,

            /* Đơn mua hàng */
            isLoadSumTotalCost: false,
            valueInvoiceDate: 13,
            sumTotalCost: 0,
            sumTotalCostIsCollected: 0,
            sumTotalCostIsNotCollected: 0,

            /* Giá trị hóa đơn  */
            listTopInvoice: [],
            isLoadTopInvoice: false,
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
                    },
                    {
                        'key': Enum.ACTION.INACTIVE,
                        'value': this.$t('action.inactive'),
                    }
                ]; // Khởi tạo danh sách action trên từng dòng
            }
        }


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
        formatCurrency, 

        loadFullAPI() {
            let me = this;

            me.loadTopInventory();

            me.loadMinQuantity();

            me.loadSumTotalCosts();

            me.loadTopInvoices();
        },

        async loadTopInvoices() {
            const me = this;
            me.isLoadTopInvoice = true;
            try {
                const result = await me.$api.inventory.getTopInvoices();
                if (result.status == Enum.MISA_CODE.SUCCESS) {
                    me.isLoadTopInvoice = false;
                    me.listTopInvoice = result.data;
                    return Promise.resolve(true);
                } else {
                    return Promise.resolve(false);
                }
            } catch (error) {
                me.$refs.popup.showError(me.$t('notice_message.get_dashboard_list_fail'));
                console.log(error);
                return Promise.reject(false);
            }
        },

        async loadSumTotalCosts() {
            const me = this;
            me.isLoadSumTotalCost = true;
            try {
                const result = await me.$api.inventory.getSumTotalCosts();
                if (result.status == Enum.MISA_CODE.SUCCESS) {
                    me.isLoadSumTotalCost = false;
                    me.sumTotalCost = result.data.sumTotalCost;
                    me.sumTotalCostIsCollected = result.data.sumTotalCostIsCollected;
                    me.sumTotalCostIsNotCollected = result.data.sumTotalCostIsNotCollected;
                    return Promise.resolve(true);
                } else {
                    return Promise.resolve(false);
                }
            } catch (error) {
                me.$refs.popup.showError(me.$t('notice_message.get_dashboard_list_fail'));
                console.log(error);
                return Promise.reject(false);
            }
        },

        async loadMinQuantity() {
            const me = this;
            me.isLoadMinQuantity = true;
            try {
                const result = await me.$api.inventory.getMinQuantity();
                if (result.status == Enum.MISA_CODE.SUCCESS) {
                    me.isLoadMinQuantity = false;
                    me.lessThanFive = result.data.lessThanFive;
                    me.equalZero = result.data.equalZero;
                    return Promise.resolve(true);
                } else {
                    return Promise.resolve(false);
                }
            } catch (error) {
                me.$refs.popup.showError(me.$t('notice_message.get_dashboard_list_fail'));
                console.log(error);
                return Promise.reject(false);
            }
        },

        async loadTopInventory() {
            const me = this;
            me.isLoadTopInventory = true;
            try {
                const result = await me.$api.inventory.getTopInventories();
                if (result.status == Enum.MISA_CODE.SUCCESS) {
                    me.isLoadTopInventory = false;
                    me.listTopInventory = result.data.data;
                    me.totalCostInventory = result.data.total;
                    return Promise.resolve(true);
                } else {
                    return Promise.resolve(false);
                }
            } catch (error) {
                me.$refs.popup.showError(me.$t('notice_message.get_dashboard_list_fail'));
                console.log(error);
                return Promise.reject(false);
            }
        },

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
                me.$refs.popup.showError(me.$t('notice_message.get_dashboard_list_fail'));
                console.log(error);
                return Promise.reject(false);
            }
        },

        formatNumber(number) {
            let val = (number/1).toFixed(0)
            if (number && !isNaN(number)) {
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            } else 
                return number;
        },
    },
}
</script>
<style lang="scss" scoped>
.dashboard {
    width: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;

    &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        box-sizing: border-box;
    }

    &__title {
        font-size: 24px;
        font-family: "MISA Fonts Bold";
    }

    &__body {
        box-sizing: border-box;
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        justify-content: space-between;
        

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

    &__item {
        min-width: 640px;
        width: max-content;
        max-width: 50%;
        border-radius: 4px;
        background-color: rgb(255, 255, 255);
        display: flex;
        flex-direction: column;
        height: 330px;

        &--top {
            height: 180px;
        }
    }
}

.item {
    &__header {
        padding: 16px 16px;
        display: flex;
        justify-content: space-between;
        border-radius: 4px 4px 0 0;
        
        &--color {
            background-color: rgb(13, 24, 61);
            padding: 8px 16px;
        }
    }

    &__title {
        font-size: 16px;
        font-weight: 600;
        color: #fff;

        &--black {
            color: black;
        }
    }

    &__function {
        display: flex;
        align-items: center;
    }

    &__date {
        margin-right: 8px;
    }

    &__body {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;

        &--statistic {
            display: block;
            padding: 0 16px 16px 16px;
        }

        &--invoice {
            display: block;
            padding: 16px 16px 16px 16px;
        }
    }
    
    &__box {
        width: 50%;
        padding: 10px 32px;
        display: flex;

        &--left {
            border-right: 1px solid rgb(180, 180, 180);
        }
    }
    
    &__icon {
        width: 80px;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        border: 3px solid white;

        &--warning {
            &:hover { 
                border: 3px solid rgba(255, 127, 44, .4);
            }
        }

        &--empty {
            &:hover { 
                border: 3px solid rgba(235, 29, 29, .4);
            }
        }
    }
    
    &__content {
        font-weight: 700;
        padding-left: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    &__value {
        font-size: 26px;
    }

    &__text {
        font-size: 16px;
    }
}

.statistic {
    &__total {
        margin-bottom: 20px;
    }

    &__value {
        font-size: 26px;
        font-weight: 700;
    }

    &__label {
        text-transform: uppercase;
        color: rgba(151, 150, 167, 1);
    }

    &__row {
        display: flex;
        margin-bottom: 12px;
    }
    
    &__col {
        width: 150px;
        max-width: 150px;
        min-width: 150px;
    }

    &__col--fill {
        flex: 1;
        width: auto;
        max-width: auto;
        min-width: auto;
    }

    &__col--left {
        text-align: left;
    }

    &__col--right {
        text-align: right;        
    }

    &__head {
        margin-bottom: 10px;
        color: #98a9bc;
        font-size: 12px;
        font-weight: 600;
    }
}


.revenue {
    &__total {
        margin-bottom: 20px;
    }

    &__value {
        font-size: 26px;
        font-weight: 700;
    }

    &__label {
        text-transform: uppercase;
        color: rgba(151, 150, 167, 1);
    }

    &__row {
        display: flex;
        margin-bottom: 12px;
    }
    
    &__col {
        width: 150px;
        max-width: 150px;
        min-width: 150px;
    }

    &__col--fill {
        flex: 1;
        width: auto;
        max-width: auto;
        min-width: auto;
    }

    &__col--left {
        text-align: left;
    }

    &__col--right {
        text-align: right;        
    }

    &__head {
        margin-bottom: 10px;
        color: #98a9bc;
        font-size: 12px;
        font-weight: 600;
    }
}

.invoice {
    &__item {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    &__value {
        font-size: 15px;
        font-weight: 700;
    }
}
.icon {
    display: block;
    cursor: pointer;
}
.icon__reset {
    background: url("@/assets/img/Sprites.d78db031.svg") no-repeat -619px -76px;
	width: 22px;
	height: 24px;
    transform: scale(0.8);
}

.icon__reset--spray {
    background: url("@/assets/img/Sprites.d78db031.svg") no-repeat -1024px -29px;
	width: 22px;
	height: 24px;
    transform: scale(0.8);
}

.icon__box--warning {
    background: url("@/assets/img/Sprites.d78db031.svg") no-repeat -256px -1322px;
	width: 70px;
	height: 70px;
         

}

.icon__box--empty {
    background: url("@/assets/img/Sprites.d78db031.svg") no-repeat -358px -1322px;
	width: 70px;
	height: 70px;
}

.divide-line {
    border-bottom: 1px dashed #d4d7dc;
    margin-bottom: 12px;
    margin-top: 8px;
}
</style>