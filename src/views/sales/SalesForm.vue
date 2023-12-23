<template>
    <div class="form--inventory">
        <!-- Khu vực hiển thị dialog form thêm hoặc sửa nhân viên -->
        <v-dialog :isShow="modelValue" @close="closeFormHandle">
            <template #title>
                <div class="row e-header">
                    <div class="e-header__title col font-weight-700">
                        {{ $t('inventory_info.title') }}
                    </div>
                </div>
            </template>
            <template #body>
                <div class="grid wide v-max-900" ref="InventoryForm">
                    <div class="row row--inventory">
                        <div class="col l-7 md-7">
                            <div class="row sm-gutter">
                                <div class="form-group col l-5 md-5 c-5 focus">
                                    <v-input :label="$t('inventory_info.code')" v-model="inventory.inventoryCode"
                                        :required="true" :errorLabel="$t('inventory_info.code')">
                                    </v-input>
                                </div>
                                <div class="form-group col l-7 md-7 c-7">
                                    <v-input :label="$t('inventory_info.name')" v-model="inventory.inventoryName"
                                        ref="inventoryName" @validate="setValid('inventoryName', $event)" :maxLength="100"
                                        :required="true" :errorLabel="$t('inventory_info.name')">
                                    </v-input>
                                </div>
                                <div class="form-group col l-12 md-12">
                                    <!-- <BCombobox
                                        :url= "url.inventoryCategory"
                                        propValue="inventoryCategoryID"
                                        propCode="inventoryCategoryCode"
                                        propText="inventoryCategoryName"
                                        :fieldName="$t('inventory_info.inventory_category')"
                                        :propPlaceholder="$t('inventory_info.inventory_category')"
                                        :setID="inventory.inventoryCategoryID" 
                                        :setValue="inventory.inventoryCategoryName"
                                        @getID = "inventory.inventoryCategoryID = $event"
                                        @getCode = "inventory.inventoryCategoryCode = $event"
                                        @getName = "inventory.inventoryCategoryName = $event"
                                        :required="this.isShowValidity.emptyDepartmentID"
                                        @onClick="this.isShowValidity.emptyDepartmentID = $event"
                                        @onBlur="this.isShowValidity.emptyDepartmentID = $event"
                                        :addFocus="this.focusDepartment"
                                        @removeFocus="this.focusDepartment = $event"
                                        @onChange="checkChangeDepartment($event)"
                                        >
                                    </BCombobox> -->
                                    <div class="v-input__label">
                                        <label @click="handleInputFocus">
                                            <!-- :tooltip="tooltipText" :position="tooltipPosition" -->
                                            {{ $t('inventory_info.inventory_category') }} <span> * </span>
                                        </label>
                                    </div>

                                    <BCombobox
                                        :url= "url.inventoryCategory"
                                        propValue="inventoryCategoryID"
                                        propCode="inventoryCategoryCode"
                                        propText="inventoryCategoryName"
                                        :fieldName="$t('inventory_info.inventory_category')"
                                        :propPlaceholder="$t('inventory_info.inventory_category')"
                                        :setID="inventory.inventoryCategoryID" 
                                        :setValue="inventory.inventoryCategoryName"
                                        @getID="inventory.inventoryCategoryID = $event"
                                        @getCode="inventory.inventoryCategoryCode = $event"
                                        @getName="inventory.inventoryCategoryName = $event"
                                        >
                                    </BCombobox>
                                </div>

                                <div class="form-group col l-5 md-5">
                                    <v-input :label="$t('inventory_info.quantity')" v-model="inventory.quantity">
                                    </v-input>
                                </div>
                                <div class="form-group col l-7 md-7">
                                    <v-input :label="$t('inventory_info.cost')" v-model="inventory.cost">
                                    </v-input>
                                </div>

                                <div class="form-group col l-12 md-12">
                                    <v-input :label="$t('inventory_info.description')" v-model="inventory.description">
                                    </v-input>
                                </div>
                            </div>
                        </div>
                        <div class="image col">
                            <div class="image__label v-input__label">
                                <label @click="handleInputFocus">
                                    <!-- :tooltip="tooltipText" :position="tooltipPosition" -->
                                    {{ $t('inventory_info.image') }}
                                </label>
                            </div>
                            <div class="image__contain">
                                <div class="image__item">
                                    <img class="image__file" :src="inventory.image" alt="" @click="selectImage" v-show="inventory.image"> 
                                    <img class="image__file" src="@/assets/img/default-placeholder.png" alt="" @click="selectImage" v-show="!inventory.image"> 
                                </div>
                                <div class="image__input">
                                    <input 
                                        ref="fileImage" 
                                        type="file" 
                                        @input="onUploadImage"
                                        @change="onFileChanged"
                                        title=" "
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
            <template #footer__left>
                <v-button buttonType="secondary" @click="closeFormHandle" className="v-button__button-no-bg border">
                    {{ $t('action_form.cancel') }}
                </v-button>
                <div style="max-width: 0; max-height: 0; overflow: hidden;">
                    <input @focus="inputFocus()" />
                </div>
            </template>
            <template #footer__right>
                <v-button @click="saveHandler(Enum.ACTION.SAVE_AND_CLOSE)" buttonType="secondary"
                    :tooltip="$t('action_form.save') + Enum.KEY_DEFINE.CTRL_S">
                    {{ $t('action_form.save') }}
                </v-button>
                <v-button @click="saveHandler(Enum.ACTION.SAVE_AND_ADD)"
                    :tooltip="$t('action_form.save_and_add') + Enum.KEY_DEFINE.CTRL_SHIFT_S">
                    {{ $t('action_form.save_and_add') }}
                </v-button>
            </template>
        </v-dialog>
        <!-- Khu vực hiển thị popup cảnh báo -->
        <v-popup ref="popup" :tabIndex="0"></v-popup>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Enum from "@/utils/enum";
//import UploadImage from 'vue-upload-image';

export default {
    name: "InventoryForm",
    props: {
        modelValue: { // dùng để đóng mở form
            type: Boolean,
            default: false
        },
    },
/*     components: {
        UploadImage
    }, */

    data() {
        return {
            inventory: { // dữ liệu nhân viên
                inventoryID: "",
                inventoryCode: "",
                inventoryName: "",
                inventoryCategoryID: "",
                inventoryCategoryCode: "",
                inventoryCategoryName: "",
                cost: 0,
                quantity: 0,
                description: "",
                image: "",
                createdDate: "",
                createdBy: "",
                modifiedDate: "",
                modifiedBy: ""
            },
            attemptSubmit: true, // biến kiểm tra đã submit form chưa
            Enum: Enum, // dùng để gọi Enum trong template 
            isChaged: false, // dùng để check xem có thay đổi dữ liệu hay không
            inventoryList: [], // danh sách phòng ban
            url: {
                inventoryCategory: "http://localhost:59997/api/v1/InventoryCategories"
            },
        };
    },
    computed: {
        ...mapGetters(["getInventoryId"]),
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
        /* 
            Format image
        */
        formatImage: {
/*             return 'data:image/jpeg;base64,' + btoa(
                new Uint8Array(this.inventory.image)
                .reduce((data, byte) => data + String.fromCharCode(byte), '')
            ); */
            get: function() {
                return this.employeeModal.identityNumber;
            },
            
            set: function(number) {
                var num = number;
                
                num = this.preventText(num);
                num = "abc";
                
                this.employeeModal.identityNumber = num;
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
         * @description: Nhận các mode từ bên component inventory-list và xử lý các nghiệp vụ tương ứng
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
                        await me.getInventoryById();
                        me.isChaged = false;
                        break;
                    case Enum.FORM_MODE.DUPLICATE:
                        await me.getInventoryById(true);
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
         * @description: Bắt sự thay đổi của inventory nếu thay đổi thì set isChaged = true
         * Author: tttuan 1/3/2023
         */
        inventory: {
            handler: function () {
                this.isChaged = true;
            },
            deep: true
        },
    },
    methods: {
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
         * @description: Hàm này dùng để cập nhật nhân viên và emit giá trị inventory vừa cập nhật
         * @param: {enum} action: hành động sau khi cập nhật
         * Author: tttuan 19/09/2022
         */
        async updateInventory() {
            let me = this;
            const response = await me.$api.inventory.updateInventory(me.inventory); // gọi api update nhân viên
            if (response.status == Enum.MISA_CODE.SUCCESS) {
                me.$emit("updateInventory", me.inventory); // emit giá trị inventory vừa cập nhật
                return Promise.resolve(true);
            }
        },
        
        /**
        * @description: Hàm này dùng để thêm mới nhân viên và emit giá trị inventory vừa thêm mới
        * @param: {enum} action: hành động sau khi thêm mới
        * Author: tttuan 19/09/2022
        */
        async insertInventory() {
            let me = this;
            const response = await me.$api.inventory.insertInventory(me.inventory);
            if (response.status == Enum.MISA_CODE.CREATED) {
                me.inventory.inventoryID = response.data; // gán giá trị inventoryID vừa thêm mới
                me.$emit("insertInventory", me.inventory); // emit giá trị inventory vừa thêm mới
                return Promise.resolve(true);
            }
        },

        /**
         * @description: Hàm này dùng để reset form về giá trị mặc định
         * @param: {boolean} getNewInventoryCode: có lấy mã nhân viên mới hay không
         * Author: tttuan 22/09/2022
         */
        async resetForm(getNewInventoryCode = true) {
            try { // reset lại form
                let me = this;
                if (!getNewInventoryCode) return;
                me.attemptSubmit = false; // reset lại trạng thái submit
                const response = await me.$api.inventory.getNewInventoryCode(); // lấy mã nhân viên mới
                if (response.status == Enum.MISA_CODE.SUCCESS) {
                    me.inventory = { // gán giá trị mặc định cho inventory
                        inventoryCode: response.data,
                    };
                }
            } catch (error) {
                console.log(error);
            }
        },

        /**
         * @description: Hàm này dùng để lấy thông tin chi tiết nhân viên theo id và gán vào inventory
         * @param {boolean} getNewInventoryCode: có lấy mã nhân viên mới hay không ( phục vụ chức năng nhân bản)
         * Author: tttuan 22/09/2022
         */
        async getInventoryById(getNewInventoryCode = false) {
            try {
                let me = this;
                const response = await me.$api.inventory.getInventoryById(me.getInventoryId);
                if (response.status == Enum.MISA_CODE.SUCCESS) {
                    me.inventory = response.data;
                    if (getNewInventoryCode) {
                        const res = await me.$api.inventory.getNewInventoryCode(); // lấy mã nhân viên mới
                        if (res.status == Enum.MISA_CODE.SUCCESS) {
                            me.inventory.inventoryCode = res.data;
                        }
                    }
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
                    Object.keys(me.inventory).forEach((key) => {
                        // xóa các trường là null hoặc ""
                        if (me.inventory[key] == null || me.inventory[key] === "") {
                            delete me.inventory[key];
                        }
                    });
                    let result = true;
                    switch (me.formMode) {
                        case Enum.FORM_MODE.ADD: // nếu action form là add thì thực hiện insert
                            result = await me.insertInventory();
                            break;
                        case Enum.FORM_MODE.EDIT: // nếu action form là edit thì thực hiện update
                            result = await me.updateInventory();
                            break;
                        case Enum.FORM_MODE.DUPLICATE: // nếu action form là duplicate thì thực hiện duplicate 
                            result = await me.insertInventory();
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
                        let htmlMessage = null;
                        if (data.moreInfo != null && data.moreInfo != undefined) {
                                htmlMessage = Object.values(data.moreInfo).map((item) => {
                                return `${item}`;
                            });
                        }
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
        },

        selectImage() {
            this.$refs.fileImage.click();
        },

        onFileChanged(e) {

            const image = e.target.files[0];
                const reader = new FileReader();
                if (image) {
                    reader.readAsDataURL(image);
                    reader.onload = e =>{
                        this.inventory.image = e.target.result;
                    };
                }
        },
    },
    beforeUnmount() {
        this.formMode = Enum.FORM_MODE.NULL // reset lại formMode
        this.attemptSubmit = false; // reset lại attemptSubmit
        this.$emit("update:modelValue", false); // reset lại modelValue
    },
};
</script>

<style lang="scss" scoped>

.row--inventory {
    display: flex;
}
.v-dialog__header {
    padding-bottom: 32px;
}
.v {
  &-dialog__content {
    width: 444px;
  }
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
        max-width: 572px;
        min-width: 400px;
    }
}

.form--inventory {
    //width: 650px;
}

.image {
    flex: 1;
}

.image__contain {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.image__item {
    width: 200px;
    height: 220px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.image__item img {
    width: 100%;
    height: 100%;
    image-rendering: pixelated;
    object-fit: fill;
}

.image__input {
    margin-top: 16px;
    cursor: pointer;
}

.image__input input {
    width: 71px;
}
</style>