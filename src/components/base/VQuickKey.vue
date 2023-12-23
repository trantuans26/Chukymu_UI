<template>
    <v-dialog :isShow="isShow" @close="isShow = false" :line="false">
        <template #title>
            <div class="max-content">
                <h1> {{$t('quick_key.info.description')}}</h1>
            </div>
        </template>
        <template #body>
            <table class="v-table">
                <thead>
                    <tr>
                        <th>{{$t('quick_key.info.key')}}</th>
                        <th>{{$t('quick_key.info.action')}}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in listKey" :key="item.key">
                        <td><b>{{ item.key }}</b></td>
                        <td>{{ item.value }}</td>
                    </tr>
                </tbody>
            </table>
        </template>
    </v-dialog>
</template>

<script>
/* eslint-disable */
import Enum from '@/utils/enum';
import vi from '@/locales/vi';
export default {
    name: 'VQuickKey',
    computed: {
        action: {
            get() {
                return this.$store.getters.getActionKey;
            },
            set(value) {
                this.$store.commit('setActionKey', value);
            }
        },
        listKey() {
            // get list $t
            let listKey = [];
            for (let key in vi.quick_key.key) {
                listKey.push({
                    key: this.$t(`quick_key.key.${key}`),
                    value: this.$t(`quick_key.key_label.${key}`)
                })
            }
            return listKey;
        },
    },
    data() {
        return {
            isShow: false, // hiển thị các phím tắt hiện có hay không
        }
    },
    methods: {
        /**
         * @description: Hàm này dùng để xử lý các phím tắt từ bàn phím và gán vào action  
         * @param: {Object} event 
         * Author: tttuan 11/10/2022
         */
        quickKeyHandle(e) {
            const self = this;
            let isUse = false;
            if (e.ctrlKey) { // nếu có phím ctrl
                switch (e.keyCode) {
                    case Enum.KEY_CODE.S: // Ctrl + S => Cất và đóng form
                        e.preventDefault();
                        self.action = Enum.ACTION.SAVE_AND_CLOSE;
                        isUse = true;
                        break;
                    case Enum.KEY_CODE.F1: // F1 => Hiển thị các phím tắt
                        e.preventDefault();
                        self.isShow = true;
                        isUse = true;
                        break;
                    case Enum.KEY_CODE.R: // Ctrl + R => Reload lại table
                        e.preventDefault();
                        self.action = Enum.ACTION.RELOAD;
                        isUse = true;
                        break;
                    default:
                        break;
                }
            }
            if (e.ctrlKey && e.shiftKey) { // nếu có phím ctrl và shift
                switch (e.keyCode) {
                    case Enum.KEY_CODE.S: // Ctrl + Shift + S => Cất và thêm mới
                        e.preventDefault();
                        self.action = Enum.ACTION.SAVE_AND_ADD;
                        isUse = true;
                        break;
                    default:
                        break;
                }
            }
            if (e.ctrlKey && e.altKey) { // nếu có phím ctrl và alt
                switch (e.keyCode) {
                    case Enum.KEY_CODE.E: // Ctrl + Alt + E => Xuất excel
                        e.preventDefault();
                        self.action = Enum.ACTION.EXPORT;
                        isUse = true;
                        break;
                    case Enum.KEY_CODE.A: // Ctrl + Alt + A => Thêm mới
                        e.preventDefault();
                        self.action = Enum.ACTION.ADD;
                        isUse = true;
                        break;
                    case Enum.KEY_CODE.C: // Ctrl + Alt + C => Collapse sidebar
                        e.preventDefault();
                        self.action = Enum.ACTION.COLLAPSE;
                        isUse = true;
                        break;
                    case Enum.KEY_CODE.L: // Ctrl + Alt + L => Thay đổi ngôn ngữ
                        e.preventDefault();
                        const oldLang = self.$i18n.locale;
                        self.$i18n.locale = oldLang === Enum.LANGUAGE.VI ? Enum.LANGUAGE.EN : Enum.LANGUAGE.VI;
                        // Lưu lại ngôn ngữ đã chọn vào localStorage
                        localStorage.setItem('value-language', self.$i18n.locale);
                        isUse = true;
                        break;
                    default:
                        break;
                }
            }
            switch (e.keyCode) {
                case Enum.KEY_CODE.ESC: // Esc => Đóng form
                    e.preventDefault();
                    self.action = Enum.ACTION.CLOSE;
                    if (self.isShow) {
                        self.isShow = false;
                    }
                    isUse = true;
                    break;
                case Enum.KEY_CODE.DELETE: // Delete => Xóa
                    e.preventDefault();
                    self.action = Enum.ACTION.DELETE;
                    isUse = true;
                    break;
                default:
                    break;
            }
            if (isUse) {
                e.preventDefault();
                setTimeout(() => {
                    self.action = null;
                }, 100);
            }
        },
    },
    mounted() {
        window.addEventListener('keydown', this.quickKeyHandle);
    },
}
</script>

<style scoped lang="scss">
.max-content {
    width: 500px;
}

.v-table {
    width: 100%;
    border-collapse: border-collapse;
    border-spacing: 0;
    border: 1px solid #ddd;

    th,
    td {
        padding: 8px;
        text-align: left;
        border-bottom: 1px solid #ddd;
        border-right: 1px solid #ddd;
        border-left: 1px solid #ddd;
    }

    th {
        background-color: #f2f2f2;
    }

    tr:hover {
        background-color: #f5f5f5;
    }

}
</style>