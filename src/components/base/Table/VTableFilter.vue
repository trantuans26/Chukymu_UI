<template>
    <div v-if="filterPopup.isShow" class="v-table__condition" ref="condition" v-click-outside="closeFilterPopup"
        :style="[{ top: `${filterPopupTemp.top}px` }, { left: `${filterPopupTemp.left}px` }]"
        @keydown.enter="applyFilter">
        <div class="v-table__lock cursor-pointer">
            <div class="ms-24 ms-icon ms-icon-header-pin"></div>
            <span class="ms-l-2">Cố định cột này</span>
        </div>
        <div class="v-table__filter">
            <div class="v-table__column-filter">
                <!-- Hiển thị lọc theo label -->
                <div class="span">Lọc {{ filterPopup.title }}
                </div>
                <!-- Nếu kiểu dữ liệu là text thì hiển thị dropdown các điều kiện -->
                <v-dropdown className="secondary rounded ms-l-3 color-blue" v-if="!isShowCombobox"
                    icon="ms-12 ms-icon-v2 ms-icon-arrow-down-blue" :isTextChange="true" propKey="key" propValue="value"
                    v-model:value="filterPopupTemp.condition" @onSelect="changeConditionName" :items="filterCondition">
                </v-dropdown>
            </div>
            <div class="v-table__input-filter m-t-2">
                <!-- Nếu kiểu dữ liệu là text thì hiển thị input -->
                <v-input placeholder="Nhập giá trị lọc" :type="filterPopup.type" v-model="filterPopupTemp.value"
                    :maxNumber="maxNumber" v-if="!isShowCombobox" :focus="true" :disabled="disableInputCondition">
                </v-input>
                <!-- Nếu kiểu dữ liệu là combobox thì hiển thị combobox -->
                <v-combobox v-else-if="isShowCombobox" position="bottom" propKey="key" propValue="value"
                    v-model="filterPopupTemp.value" v-model:textInput="filterPopupTemp.selectedOption"
                    :data="filterPopup.filterOptions" :focus="true">
                </v-combobox>
            </div>
            <div class="v-table__action-filter d-flex justify-content-between m-t-3">
                <v-button buttonType="secondary" @click="removeFilter()">Bỏ lọc</v-button>
                <v-button @click="applyFilter">Lọc</v-button>
            </div>
        </div>
    </div>
</template>

<script>
import Enum from '@/utils/enum';
export default {
    name: 'VTableFilter',
    props: {
        filterPopup: {
            type: Object,
            default: () => {
                return {
                    isShow: false,
                    left: 0,
                    top: 0,
                    title: '',
                    key: '',
                    value: '',
                    condition: '',
                    conditionName: '',
                    filterOptions: [],
                    selectedOption: null,
                    type: Enum.FilterType.Text,
                    column: null,
                };
            }
        }
    },
    data() {
        return {
            filterPopupTemp: {},
        };
    },
    watch: {
        'filterPopup.isShow': {
            handler: function (val) {
                if (val) {
                    this.filterPopupTemp = JSON.parse(JSON.stringify(this.filterPopup));
                    // tính lại vị trí của popup
                    this.$nextTick(() => {
                        this.filterPopupTemp.left = this.$refs.condition.offsetLeft - this.$refs.condition.offsetWidth;
                        if (this.filterPopupTemp.left < 0) { // nếu popup vượt quá bên trái thì hiển thị bên phải
                            this.filterPopupTemp.left = 0 + this.$refs.condition.offsetWidth;
                        }
                    });
                }
            },
            deep: true,
        },

    },
    computed: {
        filterText() { // các điều kiện lọc với type là text
            return [
                {
                    key: Enum.FilterConditon.IsNull,
                    value: this.$t('table_filter.is_null')
                },
                {
                    key: Enum.FilterConditon.IsNotNull,
                    value: this.$t('table_filter.is_not_null')
                },
                {
                    key: Enum.FilterConditon.Equal,
                    value: this.$t('table_filter.equal')
                },
                {
                    key: Enum.FilterConditon.NotEqual,
                    value: this.$t('table_filter.not_equal')
                },
                {
                    key: Enum.FilterConditon.Contain,
                    value: this.$t('table_filter.contain')
                },
                {
                    key: Enum.FilterConditon.NotContain,
                    value: this.$t('table_filter.not_contain')
                },
                {
                    key: Enum.FilterConditon.StartWith,
                    value: this.$t('table_filter.start_with')
                },
                {
                    key: Enum.FilterConditon.EndWith,
                    value: this.$t('table_filter.end_with')
                }
            ]
        },
        filterNumber() { // các điều kiện lọc với type là number
            return [
                {
                    key: Enum.FilterConditon.IsNull,
                    value: this.$t('table_filter.is_null')
                },
                {
                    key: Enum.FilterConditon.IsNotNull,
                    value: this.$t('table_filter.is_not_null')
                },
                {
                    key: Enum.FilterConditon.Equal,
                    value: this.$t('table_filter.equal')
                },
                {
                    key: Enum.FilterConditon.NotEqual,
                    value: this.$t('table_filter.not_equal')
                },
                {
                    key: Enum.FilterConditon.GreaterThan,
                    value: this.$t('table_filter.greater_than')
                },
                {
                    key: Enum.FilterConditon.GreaterThanOrEqual,
                    value: this.$t('table_filter.greater_than_or_equal')
                },
                {
                    key: Enum.FilterConditon.LessThan,
                    value: this.$t('table_filter.less_than')
                },
                {
                    key: Enum.FilterConditon.LessThanOrEqual,
                    value: this.$t('table_filter.less_than_or_equal')
                }
            ]
        },
        maxNumber() { // kiểm tra xem giá trị nhập vào có lớn hơn giá trị max của column không
            if (this.filterPopupTemp.column && this.filterPopupTemp.column.maxNumber) {
                return this.filterPopupTemp.column.maxNumber;
            }
            return Number.MAX_SAFE_INTEGER;
        },
        filterCondition() { // lấy ra danh sách lọc theo kiểu dữ liệu
            return this.filterPopup.type === Enum.FilterType.Number ? this.filterNumber : this.filterText;
        },
        /**
         * @description: Điều kiện để hiển thị combobox
         * Author: tttuan 07/11/2022
         */
        isShowCombobox() { // nếu có option thì hiển thị combobox
            return this.filterPopup.filterOptions && this.filterPopup.filterOptions.length > 0;
        },
        /**
         * @description: Disable input điều kiện lọc
         * Author: tttuan 07/11/2022
         */
        disableInputCondition() { // nếu có option là trống hoặc không trống thì disable input điều kiện lọc
            return this.filterPopupTemp.condition === Enum.FilterConditon.IsNull || this.filterPopupTemp.condition === Enum.FilterConditon.IsNotNull;
        },
    },
    methods: {
        /**
         * @description: Hàm này thực hiện thay đổi giá trị của filterConditionName
         * Author: tttuan 27/10/2022
         */
        changeConditionName(key, value) {
            if (this.disableInputCondition) {
                this.filterPopupTemp.value = '';
            }
            this.filterPopupTemp.conditionName = value;
        },
        /**
         * @description: Hàm này thực hiện emit object filterPopupTemp
         * @param: {any} 
         * Author: tttuan 29/10/2022
         */
        applyFilter() {
            this.$emit('applyFilter', this.filterPopupTemp);
        },
        /**
         * @description: Hàm này dùng để đóng popup lọc
         * Author: tttuan 29/10/2022
         */
        closeFilterPopup() {
            if (event.target.closest('.v-table__header-icon') || event.target.closest('.v-select__content')) return;
            this.$emit('closeFilterPopup');
        },
        /**
         * @description: Hàm này dùng để bỏ lọc
         * @param: {any} 
         * Author: tttuan 29/10/2022
         */
        removeFilter() {
            this.$emit('closeFilterPopup', this.filterPopupTemp.key);
        }
    },
}
</script>

<style lang="scss" scoped>
.v {
    &-table__condition {
        position: absolute;
        padding: 22px 17px;
        border: 1px solid #babec5;
        z-index: 10003;
        background: #fff;
        min-width: 350px;
        max-width: 350px;
        width: fit-content;
        font-weight: 400;
        font-size: 13px;
        border-radius: 2px;
        box-shadow: 3px 3px 6px #ddd;

    }

    &-table__lock {
        display: flex;
        align-items: center;
        padding-bottom: 14px;
        border-bottom: 1px solid #ebedf0;

    }

    &-table__filter {}

    &-table__column-filter {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    &-table__input-filter {}

    &-table__action-filter {}
}
</style>