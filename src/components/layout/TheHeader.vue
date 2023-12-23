<template>
    <div class="header">
        <div class="d-flex align-items-center flex-shrink">
            <v-tooltip :content="$t('sidebar.menu_action.collapse')" v-if="!collapsed">
                <div class="ms-24 ms-icon ms-icon-three-stripes ml-x-2" @click="toggleSidebar"></div>
            </v-tooltip>
            <v-dropdown icon="ms-16 ms-icon ms-icon-chevron-big-down" :backgroundActive="false"
                :items="[{ 'key': '', 'value': 'CỬA HÀNG CAFÉ THÁI TUẤN' }]">
                <v-tooltip content="CỬA HÀNG CAFÉ THÁI TUẤN">
                    CỬA HÀNG CAFÉ THÁI TUẤN
                </v-tooltip>
            </v-dropdown>
        </div>
        <div class="d-flex align-items-center flex-shrink">
            <v-tooltip style="display: flex;" :content="$t('common.select_lang')">
                <v-dropdown icon="ms-16 ms-icon ms-icon-chevron-big-down" className="pl-l-1" :items="languages"
                    propKey="language" propValue="title" @onSelect="changeLocale" :value="currentLanguage">
                    {{ $t('common.select_lang') }}
                    <template #item="item">
                        <flag :iso="item.option.flag" v-bind:squared=false /> {{ item.option.title }}
                    </template>
                </v-dropdown>
            </v-tooltip>

            <div class="header__user d-flex align-items-center p-x-3 ml-r-3">
                <v-tooltip style="display: flex;" :content="$t('login.view')">
                    <div class="ms-32 ms-icon ms-round ms-icon-small-user ms-l-2" @click="showInformationForm"></div>
                    <div class="m-2 font-weight-600 font-size-13 cursor-pointer" @click="showInformationForm"> {{ authen.employeeName }} </div>
                </v-tooltip>

                <v-tooltip style="display: flex;" :content="$t('login.log_out')">
                    <div class="m-2 font-weight-600 font-size-13 cursor-pointer logout">
                        <router-link to="/dang-nhap">
                            {{ $t('login.log_out') }}
                        </router-link>
                    </div>
                </v-tooltip>
            </div>
        </div>
    </div>

    <the-information 
        v-show="isShowInformationForm" 
        @closeForm="isShowInformationForm = $event"
        @updateEmployee="updateEmployee($event)"
    >
    </the-information>
</template>

<script>
import Enum from '@/utils/enum';
import TheInformation from './TheInformation.vue';
export default {
  components: { TheInformation },
    name: "TheHeader",
    props: {
        collapsed: { // Sidebar có collapsed hay không
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            languages: [
                { flag: 'vn', language: 'vi', title: 'Tiếng Việt' },
                { flag: 'us', language: 'en', title: 'English' }
            ], // Danh sách các ngôn ngữ
            isShowInformationForm: false
        }
    },
    computed: {
        // Lấy ngôn ngữ hiện tại
        currentLanguage() {
            return this.$i18n.locale;
        },

        authen() {
            let authencator = this.$store.getters.getPermission;
            let authencatorFake = {
                employeeName: 'Trần Thái Tuấn'
            };

            if(authencator) {
                return authencator;
            }

            return authencatorFake;
        }
    },
    watch: {
        $store: {
            handler: function (val) {
                if (val.getters.getActionKey === Enum.ACTION.COLLAPSE) { // nếu actionKey = COLLAPSE
                    this.toggleSidebar();
                }
            },
            deep: true
        }
    },
    methods: {
        /**
         * @description: Hàm này dùng để đóng mở sidebar 
         * Author: tttuan 11/10/2022
         */
        toggleSidebar() {
            this.$emit('toggleSidebar')
        },

        /**
         * @description: Hàm này dùng để thay đổi ngôn ngữ
         * Author: tttuan 11/10/2022
         */
        changeLocale(language) {
            // lưu ngôn ngữ vào localstorage
            localStorage.setItem('value-language', language)
            // thay đổi ngôn ngữ
            this.$i18n.locale = language;
        },

        showInformationForm() {
            let me = this;
            me.$store.dispatch('setMode', Enum.FORM_MODE.EDIT);
            me.$store.dispatch('setInformationId', this.$store.getters.getPermission);
            me.isShowInformationForm = true;
            
        },

        /**
         * @description: Hàm này dùng để cập nhật nhân viên ở bên frontend
         * Author: tttuan 05/10/2022
         */
        updateEmployee(check) {
            const self = this;
            try {
                if (check) {
                    self.$root.$toast.success(self.$t('notice_message.update_information_success', ''));
                }
            } catch (error) {
                self.$root.$toast.error(self.$t('notice_message.update_information_failed', ''));
                console.log(error);
            }
        },
    },
}
</script>


<style lang="scss" scoped>
    .logout a {
        color: inherit; /* blue colors for links too */
        text-decoration: inherit; /* no underline */
    }
</style>