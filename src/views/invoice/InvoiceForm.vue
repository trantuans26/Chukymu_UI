<template>
    <div>
        <!-- Khu vực hiển thị dialog form thêm hoặc sửa nhân viên -->
        <v-dialog :isShow="modelValue" @close="closeFormHandle">
            <template #title>
                <div class="row e-header">
                    <div class="e-header__title col font-weight-700">
                        {{ $t('invoice_info.title') }}
                    </div>
                    <div class="col">
                        <v-input type="checkbox" :label_custom="$t('invoice_info.is_collected')"
                            :disabled="this.isCollectedFirst"
                            v-model="invoice.isCollected" :value="false"
                        ></v-input>
                    </div>
                </div>
            </template>
            <template #body>
                <div class="invoice__list grid wide v-max-900" 
                    ref="invoiceForm" 
                >
                    <div class="row">
                        <div class="col l-6 md-6">
                            <div class="row sm-gutter">
                                <div class="form-group col l-12 md-12 c-12 focus">
                                    <v-input :label="$t('invoice_info.customer')" v-model="invoice.customer"
                                        :required="true" :errorLabel="$t('invoice_info.customer')"> 
                                    </v-input>
                                </div>
                                <div class="form-group col l-12 md-12">
                                    <v-input :label="$t('invoice_info.description')" v-model="invoice.description"
                                        :maxLength="255" :errorLabel="$t('invoice_info.description')">
                                    </v-input>
                                </div>
                                <div class="form-group col l-9 md-9">
                                    <div class="v-input__label">
                                        <label @click="handleInputFocus">
                                            <!-- :tooltip="tooltipText" :position="tooltipPosition" -->
                                            {{ $t('inventory_info.inventory') }}:
                                        </label>
                                    </div>

                                    <BCombobox
                                        :url= "url.inventory"
                                        propValue="inventoryID"
                                        propCode="inventoryCode"
                                        propText="inventoryName"
                                        :fieldName="$t('inventory_info.inventory')"
                                        :propPlaceholder="$t('inventory_info.inventory')"
                                        :setID="inventory.inventoryID" 
                                        :setValue="inventory.inventoryName"
                                        @getID="inventory.inventoryID = $event"
                                        @getCode="inventory.inventoryCode = $event"
                                        @getName="inventory.inventoryName = $event"
                                        >
                                    </BCombobox>
                                </div>

                                <div class="form-group col l-3 md-3">
                                    <div class="button--add">
                                        <v-button @click="addInventoryForInvoice()"
                                            tooltipPosition="right"
                                            :tooltip="$t('action_form.add')"
                                            :disabled="invoice.isCollected"
                                        >
                                        {{ $t('action_form.add') }}
                                    </v-button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col l-6 md-6">
                            <div class="row sm-gutter invoice--column">
                                <div class="invoice__item--disable l-5 md-5">
                                    <v-date-picker :label="$t('invoice_info.purchase_date')"
                                        v-model="invoice.purchaseDate" :isLessThanToday="true"
                                        :errorLabel="$t('invoice_info.purchase_date')" :validateCheck="true"
                                        :required="true"
                                    >
                                    </v-date-picker>
                                </div>
                                <div class="invoice__item--disable l-5 md-5">
                                    <v-input :label="$t('invoice_info.invoice_code')"
                                        :required="true"
                                        v-model="invoice.invoiceCode" :validateCheck="true"
                                        :errorLabel="$t('invoice_info.invoice_code')">
                                    </v-input>
                                </div>
                                <div class="fnvoice__item--disable l-5 md-5">
                                    <v-input :label="$t('invoice_info.employee')"
                                        v-model="invoice.createdBy" :validateCheck="true"
                                        :disabled="true"
                                        :errorLabel="$t('invoice_info.employee')">
                                    </v-input>
                                </div>
                                <div class="invoice__item--total">
                                    <div class="invoice__total--label"> {{ $t('invoice_info.total_cost') }} </div>
                                    <div class="invoice__total--value"> {{ formatNumber(invoice.totalCost ? invoice.totalCost : 0) }} </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="grid">
                    <div class="grid__label"> {{ $t('invoice_info.list_products') }}</div>

                    <div class="grid__table">
                            <div class="table__header">
                                <table>
                                    <thead>
                                        <th class="table__col table__col--center table__col--check"> # </th>
                                        <th class="table__col table__col--left table__col--code">{{ $t('invoice_info.code') }}</th>
                                        <th class="table__col table__col--left table__col--name">{{ $t('invoice_info.name') }}</th>
                                        <th class="table__col table__col--left table__col--quantity">{{ $t('invoice_info.quantity') }}</th>
                                        <th class="table__col table__col--left ttable__col--cost">{{ $t('invoice_info.cost') }}</th>
                                        <th class="table__col table__col--left table__col--total">{{ $t('invoice_info.total') }}</th>
                                        <th class="table__col--delete"></th>
                                    </thead>
                                </table>
                            </div>

                            <table class="table__scroll">
                                <div class="grid__table--body">
                                    <table>
                                        <tbody>
                                            <tr 
                                                class="table__row" 
                                                tabindex="1"
                                                v-for="(invoice, index) in this.invoiceDetails"
                                                :key="invoice"   
                                                :class="{'is--disabled': this.invoice.isCollected}"                              
                                            >
                                                <td class="table__col table__col--center table__col--check" :class="{'is--disabled': this.invoice.isCollected}"> {{ index + 1 }}</td>
                                                <td class="table__col table__col--left table__col--code"> 
                                                    <v-tooltip :content="invoice.inventoryCode">
                                                        <p>{{invoice.inventoryCode}}</p> 
                                                    </v-tooltip>
                                                </td>
                                                <td class="table__col table__col--left table__col--name"> 
                                                    <v-tooltip :content="invoice.inventoryName">
                                                        <p>{{invoice.inventoryName}}</p> 
                                                    </v-tooltip>
                                                </td>
                                                <td class="table__col table__col--left table__col--quantity table__col--spinner"> 
                                                    <input class="input--quantity" 
                                                        type="text" 
                                                        v-model="invoice.quantity"
                                                        @change="updateQuantity(invoice.inventoryID)"
                                                        maxlength="3"
                                                        @keypress="this.numbersOnly"
                                                        @paste.prevent                    
                                                    > 

                                                    <i class="icon--spinner"></i>
                                                    <span class="spin spin--up" @click="spinnerAction(invoice.inventoryID, true)"></span>
                                                    <span class="spin spin--down" @click="spinnerAction(invoice.inventoryID)"></span>
                                                </td>
                                                <td class="table__col table__col--left ttable__col--cost"> <p>{{ formatCurrency(invoice.cost ? invoice.cost : 0) }}</p> </td>
                                                <td class="table__col table__col--left table__col--total"> <p>{{ formatCurrency(invoice.totalCost) }}</p> </td>
                                                <td class="table__col--delete"> 
                                                    <div class="icon--delete" 
                                                        @click="deleteInvoiceDetailByInventoryId(invoice.inventoryID)"
                                                    ></div> 
                                                </td>
                                            </tr> 
                                        </tbody>
                                    </table>
                                </div>
                            </table>
                    </div>
                </div>
            </template>
            <template #footer__left>
                <v-button 
                    buttonType="secondary" 
                    @click="closeFormHandle" 
                    className="v-button__button-no-bg border"
                    tooltipPosition="right"
                >
                    {{ $t('action_form.cancel') }}
                </v-button>
                <div style="max-width: 0; max-height: 0; overflow: hidden;">
                    <input @focus="inputFocus()" />
                </div>
            </template>
            <template #footer__right>
                <v-button @click="saveHandler(Enum.ACTION.SAVE_AND_CLOSE)"
                    :disabled="this.isCollectedFirst"                    
                    tooltipPosition="right"
                    :tooltip="$t('action_form.save') + Enum.KEY_DEFINE.CTRL_S">
                    {{ $t('action_form.save') }}
                </v-button>
            </template>
        </v-dialog>
        <!-- Khu vực hiển thị popup cảnh báo -->
        <v-popup ref="popup" :tabIndex="0"></v-popup>
    </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from 'vuex';
import Enum from "@/utils/enum";
import { formatCurrency } from '@/utils/format';

export default {
    name: "InvoiceForm",
    props: {
        modelValue: { // dùng để đóng mở form
            type: Boolean,
            default: false
        },
    },
    created() {
        this.purchaseDate = this.getNow();
    },
    mounted() {
        this.getAllInventories();

    },
    data() {
        return {
            invoice: { // dữ liệu nhân viên
                invoiceID: "",
                invoiceCode: "",
                customer: "",
                totalCost: 0,
                description: "",
                purchaseDate: '',
                createdBy: "",
                isCollected: false,
            },
            invoiceDetails: [],
            isCollectedFirst: false,
            inventory: {
                inventoryID: "",
                inventoryCode: "",
                inventoryName: "",
            },
            inventories: [],
            attemptSubmit: true, // biến kiểm tra đã submit form chưa
            Enum: Enum, // dùng để gọi Enum trong template 
            isChaged: false, // dùng để check xem có thay đổi dữ liệu hay không
            departmentList: [], // danh sách phòng ban
            url: {
                inventory: "http://localhost:59997/api/v1/Inventories"
            },
        };
    },
    computed: {
        ...mapGetters(["getInvoiceId"]),
        /**
         * @description: Get và set trạng thái của form lưu trữ trong store 
         * Author: tttuan 08/10/2022
         */
        formMode: {
            set(val) {
                this.$store.dispatch('setMode', val);
            },
            get() {
                return this.$store.getters.getMode;
            },
        },
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
                        textAlign: 'center',
                    },
                    {
                        title: this.$t(`inventory_table.cost`),
                        key: 'cost',
                        type: 'currency'
                    },
                    {
                        title: this.$t(`invoice_table.total_cost`),
                        key: 'totalCost',
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
         * @description: Khai báo các action thực hiện trên từng dòng của table
         * Author: tttuan 11/10/2022
         */
        tableAction: {
            get() {
                return [
                    {
                        'key': Enum.ACTION.DELETE,
                        'value': this.$t('action.delete'),
                    }
                ]; // Khởi tạo danh sách action trên từng dòng
            }
        },

        quantityFormat: {
            get: function() {
                if (this.inventory.quantity == null || this.inventory.quantity == 0 || this.inventory.quantity == "") return 0;
                return this.convertQuantity(parseInt(this.inventory.quantity));
            },
                // setter
            set: function(number) {
                number = this.formatNum(number);
                this.inventory.quantity = number;
                
            }
        },
    },
    watch: {
        /**
         * @description: Xử lý khi form được mở sau khi đóng thì set mode lại là null
         * Author: tttuan 08/10/2022
         */
        modelValue: {
            handler(val) {
                if (!val) {
                    this.formMode = Enum.FORM_MODE.NULL;
                }
            },
            deep: true
        },
        /**
         * @description: Nhận các mode từ bên component employee-list và xử lý các nghiệp vụ tương ứng
         * Author: tttuan 1/3/2023
         */
        formMode: {
            handler: async function (formMode) {
                const me = this;
                switch (formMode) {
                    case Enum.FORM_MODE.ADD:
                        await me.resetForm();
                        break;
                    case Enum.FORM_MODE.EDIT:
                        await me.getMasterDetailInvoiceByID();
                        me.isChaged = false;
                        break;
                    default:
                        break;
                }
                me.inputFocus();
            },
            deep: true,
        },
        /**
         * @description: Lấy ra các action key (phím tắt) và xử lý các nghiệp vụ tương ứng
         * Author: tttuan 1/3/2023
         */
        action: {
            handler: async function (action) {
                const me = this;
                if (me.formMode !== Enum.FORM_MODE.NULL) {
                    switch (action) {
                        case Enum.ACTION.CLOSE:
                            me.closeFormHandle();
                            break;
                        case Enum.ACTION.SAVE_AND_CLOSE:
                            me.saveHandler(action);
                            break;
                        case Enum.ACTION.SAVE_AND_ADD:
                            me.saveHandler(action);
                            break;
                        default:
                            break;
                    }
                }
            },
            deep: true,
        },
        /**
         * @description: Bắt sự thay đổi của employee nếu thay đổi thì set isChaged = true
         * Author: tttuan 1/3/2023
         */
        employee: {
            handler: function () {
                this.isChaged = true;
            },
            deep: true
        },
    },
    methods: {
        formatCurrency, 

        numbersOnly(evt) {
            evt = (evt) ? evt : window.event;
            var charCode = (evt.which) ? evt.which : evt.keyCode;
            if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
                evt.preventDefault();
            } else {
                return true;
            }
        },

        convertQuantity(value) {
            if (value == null || value == 0 || value == "") return "0";
            let num = this.formatNum(value + "") + "";
            return num.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        },

        formatNum(value) {
            if (value == null || value == 0 || value == "") return "0";
            let num = value.replace(/[^0-9-]+/g, "");
            return parseInt(num);
        },

        getNow() {
            const today = new Date();
            const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            const dateTime = date +' '+ time;
            return dateTime;
        },

        updateQuantity(inventoryID) {
            let me = this;
            me.invoiceDetails.forEach((element, index) => {
                if(element.inventoryID == inventoryID) {
                    let num = me.formatNum(me.invoiceDetails[index].quantity);

                    if(me.invoiceDetails[index].quantity != 0 && me.invoiceDetails[index].quantity) {
                        me.inventories.forEach((inventory) => {
                            if(inventory.inventoryID == inventoryID) {
                                if(inventory.quantity < num) {
                                    num = inventory.quantity;
                                }
                            }
                        });

                        me.invoiceDetails[index].quantity = num;
                        me.updateCost(index);
                    } else  {
                        me.invoiceDetails[index].quantity = 1;
                        me.updateCost(index);
                    }
                }
            });
        },

        spinnerAction(inventoryID, spinUp = false) {
            let me = this;
            if(me.invoiceDetails && Array.isArray(me.invoiceDetails)) {
                me.invoiceDetails.forEach((element, index) => {
                    if(element.inventoryID == inventoryID) {
                        if(spinUp && me.invoiceDetails[index].quantity != null && me.invoiceDetails[index].quantity != undefined) {
                            me.inventories.forEach((inventory) => {
                                if(inventory.inventoryID == inventoryID)
                                {
                                    if(me.invoiceDetails[index].quantity < inventory.quantity) {
                                        me.invoiceDetails[index].quantity += 1;
                                    }
                                }
                            });
                            me.updateCost(index);
                        } else if(me.invoiceDetails[index].quantity && me.invoiceDetails[index].quantity > 1) {
                            me.invoiceDetails[index].quantity -= 1; 
                            me.updateCost(index);
                        } else if(spinUp) {
                            me.invoiceDetails[index].quantity = 1;
                            me.updateCost(index);

                        }
                    }
                });
            }
        },

        updateCost(index) {
            let me = this;

            if(index != null && index != undefined) {
                me.invoiceDetails[index].totalCost =  me.invoiceDetails[index].quantity *  me.invoiceDetails[index].cost;
            }

            me.invoice.totalCost = 0;

            me.invoiceDetails.forEach(element => {
                if (element.quantity) {
                    me.invoice.totalCost += element.totalCost;
                }
            });
        },

        getAllInventories() {
            let me = this;
            try {
                axios
                .get(me.url.inventory)
                .then((resource) => {
                    me.inventories = resource.data;
                })
                .catch((error) => {
                    console.log('error: ', error.status);
                })
            } catch (e) {
                console.log(e);
            }
        },

        addInventoryForInvoice() {
            let me = this;

            if(me.inventory && !me.invoice.isCollected) {
                me.inventories.forEach(element => {
                    if(element.inventoryID == me.inventory.inventoryID) {
                        let invoiceDetail = {
                            invoiceID: me.invoice.invoiceID,
                            invoiceCode: me.invoice.invoiceCode,
                            inventoryID: element.inventoryID,
                            inventoryCode: element.inventoryCode,
                            inventoryName: element.inventoryName,
                            cost: element.cost,
                            quantity: 1,
                            totalCost: element.cost,
                            createdDate: me.invoice.createdDate,
                            createdBy: me.invoice.createdBy,
                            modifiedDate: me.invoice.modifiedDate,
                            modifiedBy: me.invoice.modifiedBy
                        };
                        let checkEmpty = true;
                        
                        if (me.invoiceDetails && Array.isArray(me.invoiceDetails)) {
                            if(me.invoiceDetails.length > 0) {
                                me.invoiceDetails.forEach((e, i) => {
                                    if(e.inventoryID == element.inventoryID) {
                                        me.invoiceDetails[i].quantity += 1;
                                        me.updateCost(i);
                                        checkEmpty = false;
                                    }
                                });
                                
                                if(checkEmpty) {
                                    me.invoiceDetails.push(invoiceDetail);
                                    me.updateCost();
                                }
                            } else {
                                me.invoiceDetails.push(invoiceDetail);
                                me.updateCost();
                            }
                        } 
                    }
                });
            }
        },

        deleteInvoiceDetailByInventoryId(inventoryID) {
            let me = this;
            if(me.invoiceDetails && me.invoiceDetails.length > 0) {
                me.invoiceDetails.forEach((invoiceDetail, index) => {
                    if(invoiceDetail.inventoryID == inventoryID) {
                       me.invoiceDetails.splice(index, 1); 
                    }
                });
            }
        },

        formatNumber(number) {
            let val = (number/1).toFixed(0)
            if (number && !isNaN(number)) {
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            } else 
                return number;
        },

        /**
         * @description: Hàm xử lý sự kiện đóng form nhân viên
         * @param {boolean} foceClose: có bắt buộc đóng form hay không
         * Author: tttuan 22/09/2022
         */
        async closeFormHandle(forceClose = false) {
            try {
                const me = this;
                if (forceClose || !me.isChaged) {
                    me.resetForm(false);
                    me.$emit("update:modelValue", false);
                    me.$store.dispatch("setMode", null);
                    return;
                }
                if (me.isChaged) {
                    const confirm = await me.$refs.popup.show({
                        message: me.$t("notice_message.confirm_data_close"),
                        icon: Enum.ICON.INFO,
                        okButton: me.$t("confirm_popup.yes"),
                        cancelButton: me.$t("confirm_popup.no"),
                        closeButton: me.$t("confirm_popup.cancel"),
                    }); // hiển thị popup cảnh báo
                    switch (confirm) {
                        case me.$t("confirm_popup.yes"):
                            me.saveHandler(Enum.ACTION.SAVE_AND_CLOSE);
                            break;
                        case me.$t("confirm_popup.no"):
                            me.$emit("update:modelValue", false);
                            break;
                        default:
                            break;
                    }
                }
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * @description: Hàm này dùng để cập nhật nhân viên và emit giá trị employee vừa cập nhật
         * @param: {enum} action: hành động sau khi cập nhật
         * Author: tttuan 19/09/2022
         */
        async updateInvoice() {
            let me = this;
            let invoiceMasterDetail = {
                invoiceMaster: me.invoice,
                invoiceDetails: me.invoiceDetails
            };

            const response = await me.$api.invoice.updateInvoice(invoiceMasterDetail); // gọi api update nhân viên
            if (response.status == Enum.MISA_CODE.SUCCESS) {
                me.$emit("updateInvoice", me.invoice); // emit giá trị invoice vừa cập nhật
                return Promise.resolve(true);
            }
        },
        /**
        * @description: Hàm này dùng để thêm mới nhân viên và emit giá trị invoice vừa thêm mới
        * @param: {enum} action: hành động sau khi thêm mới
        * Author: tttuan 19/09/2022
        */
        async insertInvoice() {
            let me = this;
            let invoiceMasterDetail = {
                invoiceMaster: me.invoice,
                invoiceDetails: me.invoiceDetails
            };

            const response = await me.$api.invoice.insertInvoice(invoiceMasterDetail);
            if (response.status == Enum.MISA_CODE.CREATED) {
                me.invoice.invoiceID = response.data; // gán giá trị invoiceID vừa thêm mới
                me.$emit("insertInvoice", me.invoice); // emit giá trị invoice vừa thêm mới
                return Promise.resolve(true);
            }
        },
        /**
         * @description: Hàm này dùng để reset form về giá trị mặc định
         * @param: {boolean} getNewInvoiceCode: có lấy mã nhân viên mới hay không
         * Author: tttuan 22/09/2022
         */
        async resetForm(getNewInvoiceCode = true) {
            try { // reset lại form
                let me = this;
                if (!getNewInvoiceCode) return;
                me.attemptSubmit = false; // reset lại trạng thái submit
                const response = await me.$api.invoice.getNewInvoiceCode(); // lấy mã nhân viên mới
                if (response.status == Enum.MISA_CODE.SUCCESS) {
                    let name = 'Trần Thái Tuấn';

                    if(this.$store.getters.getPermission && this.$store.getters.getPermission.employeeName) {
                        name = this.$store.getters.getPermission.employeeName;
                    }

                    me.invoice = { // gán giá trị mặc định cho invoice
                        invoiceCode: response.data,
                        purchaseDate: me.getNow(),
                        createdBy: name
                    };
                    me.invoiceDetails = [];
                    me.inventory = {
                        inventoryID: '',
                        inventoryCode: '',
                        inventoryName: '',
                    };
                    me.isCollectedFirst = false;
                }
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * @description: Hàm này dùng để lấy thông tin chi tiết nhân viên theo id và gán vào invoice
         * @param {boolean} getNewInvoiceCode: có lấy mã nhân viên mới hay không ( phục vụ chức năng nhân bản)
         * Author: tttuan 22/09/2022
         */
        async getInvoiceById(getNewInvoiceCode = false) {
            try {
                let me = this;
                const response = await me.$api.invoice.getInvoiceById(me.getInvoiceId);
                if (response.status == Enum.MISA_CODE.SUCCESS) {
                    me.invoice = response.data;
                    if (getNewInvoiceCode) {
                        const res = await me.$api.invoice.getNewInvoiceCode(); // lấy mã nhân viên mới
                        if (res.status == Enum.MISA_CODE.SUCCESS) {
                            me.invoice.invoiceCode = res.data;
                        }
                    }
                }
            } catch (error) {
                console.log(error);
            }
        },

        async getMasterDetailInvoiceByID() {
            try {
                let me = this;
                const response = await me.$api.invoice.getMasterDetailInvoiceByID(me.getInvoiceId);
                if (response.status == Enum.MISA_CODE.SUCCESS) {
                    me.invoice = response.data.invoiceMaster;
                    me.invoiceDetails = response.data.invoiceDetails;
                    me.isCollectedFirst = me.invoice.isCollected;
                    console.log(me.invoiceDetails);
                }
            } catch (error) {
                console.log(error);
            }
        },

        setValid(fieldName, valid) {
            console.log(fieldName, valid);
        },
        /**
         * @description: Hàm này dùng để xử lý sự kiện cất
         * @param: {string} action: hành động sau khi cất
         * Author: tttuan 19/09/2022
         */
        async saveHandler(action) {
            let me = this;
            try {
                me.attemptSubmit = true; // set trạng thái submit
                const validateResult = await me.$nextTick(async () => { // đợi cho khi các ô input validate xong thì mới tìm class error
                    const errorClass = me.$el.querySelectorAll(".error");
                    if (errorClass.length > 0) { // nếu có lỗi thì focus vào phần tử đầu tiên
                        let count = 1;
                        let htmlMessage = Array.from(errorClass).map((item) => {
                            return `${count++}. ${item.getAttribute("data-error")}`;
                        }).join('<br/>');
                        await me.$refs.popup.show({
                            message: htmlMessage,
                            icon: Enum.ICON.ERROR,
                            hideButton: 'true',
                        }).then(() => {
                            me.inputFocus(true);
                        });
                        return false;
                    } else {
                        return true;
                    }
                });
                if (validateResult) {
                    Object.keys(me.invoice).forEach((key) => {
                        // xóa các trường là null hoặc ""
                        if (me.invoice[key] == null || me.invoice[key] === "") {
                            delete me.invoice[key];
                        }
                    });
                    let result = true;
                    switch (me.formMode) {
                        case Enum.FORM_MODE.ADD: // nếu action form là add thì thực hiện insert
                            result = await me.insertInvoice();
                            break;
                        case Enum.FORM_MODE.EDIT: // nếu action form là edit thì thực hiện update
                            result = await me.updateInvoice();
                            break;
                    }
                    if (result) { // nếu insert thành công thì xử lý action form
                        switch (action) {
                            case Enum.ACTION.SAVE_AND_CLOSE: // nếu nhấn cất
                                me.closeFormHandle(true);
                                break;
                            case Enum.ACTION.SAVE_AND_ADD: // nếu nhấn cất và thêm
                                me.formMode = Enum.FORM_MODE.NULL;
                                me.formMode = Enum.FORM_MODE.ADD;
                                break;
                            default:
                                break;
                        }
                    }
                }
            } catch (error) {
                if (error.response) {
                    let { status, data } = error.response;
                    if (status == Enum.MISA_CODE.VALIDATE) {
                        let htmlMessage = Object.values(data.moreInfo).map((item) => {
                            return `${item}`;
                        });
                        await me.$refs.popup.showError(htmlMessage);
                    }
                } else {
                    me.$refs.popup.showError(me.$t("notice_message.unknown_error"));
                }
            }
        },
        /**
        * @description: Hàm này dùng để focus vào trường input đầu tiên hoặc là trường lỗi đầu tiên
        * @param: {boolean} isFocusError: có focus vào trường lỗi đầu tiên hay không
        * Author: tttuan 5/3/2023
        */
        inputFocus(isFocusError = false) {
            try {
                let me = this;
                if (isFocusError) {
                    const errorClass = me.$el.querySelector(".error");
                    if (errorClass) {
                        if (errorClass.tagName === "INPUT") {
                            errorClass.focus();
                        }
                        if (errorClass.tagName === "DIV") {
                            errorClass.querySelector("input").focus();
                        }
                    }
                } else {
                    const focusFirst = me.$el.querySelector(".focus").querySelector("input");
                    if (focusFirst) {
                        focusFirst.focus();
                    }
                }
            } catch (error) {
                // console.log(error);
            }
        }
    },
    beforeUnmount() {
        this.formMode = Enum.FORM_MODE.NULL // reset lại formMode
        this.attemptSubmit = false; // reset lại attemptSubmit
        this.$emit("update:modelValue", false); // reset lại modelValue
    },
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/tableCustom.css";

.v-dialog__header {
    padding-bottom: 32px;
}

.e-header {
    align-items: center;
    &__title {
        font-size: 24px;
        font-weight: 700;
    }
}

.e-body {
    &__gender {
        height: 32px;
        align-items: center;
    }
}

.v-max-900 {
    &.wide {
        margin: 20px 0;
        max-width: 800px;
        min-width: 400px;
    }
}

.invoice__list {
}
.invoice__item--checkbox {
    display: flex;
    padding-top: 32px;
    padding-left: 40px;
    width: 136px;
}

.invoice--column {
    display: flex;
    flex-direction: column;
    position: relative;
}

.invoice__item--disable {
    margin-bottom: 16px;
}

.invoice__item--total {
    position: absolute;
    right: 0;
    top: 20px;
    text-align: right;
}

.invoice__total--label {
    font-size: 14px;
}

.invoice__total--value {
    font-size: 36px;
    font-weight: 700;
}

.grid {

}

.grid__label {
    font-weight: 700;
    font-size: 16px;
}

.grid__table {
    margin-top: 10px;
}

.button--add {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-end;
}

.spin {
    position: absolute;
    right: 8px;
    width: 8px;
    height: 8px;
    opacity: 0;
    cursor: pointer;
}

.spin--up {
    top: 21%;
}

.spin--down {
    bottom: 21%;
}

.table__col--spinner {
    position: relative;
}

.icon--spinner {
    background: url('@/assets/img/qlts-icon.svg') no-repeat -204px -332px;
	width: 8px;
	height: 16px;
    position: absolute;
    top: 9px;
    right: 10px;
    opacity: 0.8;
}

.input--quantity {
    border: 1.5px solid rgb(189, 189, 189);
    border-radius: 4px;
    height: 24px;
    width: 60px;
    outline: none;
    padding-left: 6px;

    &:focus {
        border: 1.5px solid rgb(0, 98, 204);
    }
}

.is--disabled {
    pointer-events: none;
    background-color: rgb(229, 229, 229) !important;
    opacity: 0.6;
}

</style>