<template>
    <div class="login">
        <div class="login__container">
            <div class="login__header">
                <div class="login__title"> {{ $t('login.title') }}</div>
            </div>

            <div class="login__body">
                <div class="login__form">
                    <div class="login__input login__input--user" 
                        ref="user"
                        :tooltip="`${requiredUsername ? $t('login.error_tooltip.user') : ''}`" 
                        :error="requiredUsername"
                        :class="{'login__input--error': requiredUsername}"
                    >
                        <input type="text" 
                            :placeholder="$t('login.placeholder.user')" 
                            v-model="username"
                            @blur="checkUsername"
                            @focus="requiredUsername = false"
                        >
                    </div>
                    <div class="login__input login__input--password"
                        :tooltip="`${requiredPassword ? $t('login.error_tooltip.password') : ''}`" 
                        :error="requiredPassword"
                        :class="{'login__input--error': requiredPassword}"
                    >
                        <input type="password" 
                            :placeholder="$t('login.placeholder.password')" 
                            v-model="password"
                            @blur="checkPassword"
                            @focus="requiredPassword = false"
                        >
                    </div>
                </div>

                <div class="login__button" @click="login">
                    <button> {{ $t('login.button') }} </button>
                </div>

                <div class="login__forgot" @click="showForgotPassword">
                    {{ $t('login.forgot_password') }}
                </div>
            </div>
        </div>

        <div class="popup-box" v-show="showDialog">
            <div class="v-popup">
                <div class="v-popup__body">
                    <div class="v-popup__icon" @mousemove="stopDrag">
                        <div :class="`ms-48 ms-icon ms-icon-error`"></div>
                    </div>
                    <div class="v-popup__text">
                        <span> {{ messageError }}</span>
                        <slot name="body"></slot>
                    </div>
                </div>
                <div class="v-line"></div>
                <div class="v-popup__footer">
                    <div class="footer__left">
                        <v-button v-show="false"  className="secondary" @click="_close" :text="closeButton"
                            :focus="true" />
                    </div>
                    <div class="footer__right">
                        <v-button :focus="true" @click="close">{{ $t('confirm_popup.close') }}</v-button>
                    </div>
                </div>
            </div>
        </div>

        <ForgotPassword v-model="isShowForgotPassword" @resetPasswordSuccess="resetPasswordSuccess"></ForgotPassword>
        <v-toast ref="toast" :showProgress="true" :maxMessage="10"></v-toast>
    </div>
</template>

<script>
import Enum from "@/utils/enum";
import ForgotPassword from './ForgotPassword.vue';
export default {
    name: "LoginForm",
    components: { ForgotPassword },
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
            username: "",
            password: "",
            requiredUsername: false,
            requiredPassword: false,
            messageError: "",
            showDialog: false,
            isShowForgotPassword: false,
        };
    },
    computed: {
     
    },

    watch: {
    
    },
    methods: {
        resetPasswordSuccess() {
            const self = this;
            try {
                self.$root.$toast.success(self.$t('notice_message.sendmail_success', [""]));
            } catch (error) {
                self.$root.$toast.error(self.$t('notice_message.sendmail_fail', [""]));
                console.log(error);
            }
        },

        showForgotPassword() {
            this.isShowForgotPassword = true;
        },

        close() {
            let me =this;

            me.showDialog = false;

            me.$nextTick(() => {
                me.$refs.user.focus();
            })
        },
        
        checkUsername() {
            if(!this.username && this.username !== 0) {
                this.requiredUsername = true;
            } else {
                this.requiredUsername = false;
            }
        },

        checkPassword() {
            if(!this.password && this.password !== 0) {
                this.requiredPassword = true;
            } else {
                this.requiredPassword = false;
            }
        },

        async login() {
            let me = this;
            let pass = true;

            try {
                if(me.requiredUsername || (!this.username && this.username !== 0)) {
                    me.messageError = me.$t('login.error_message.user');
                    me.showDialog = true;
                    pass = false;
                    me.requiredUsername = true;
                } 
                if (me.requiredPassword || (!this.password && this.password !== 0)) {
                    me.messageError = me.$t('login.error_message.password');
                    me.showDialog = true;
                    pass = false;
                    me.requiredPassword = true;
                }
                if (me.requiredPassword &&  me.requiredUsername) {
                    me.messageError = me.$t('login.error_message.userAndPassword');
                    me.showDialog = true;
                    pass = false;
                }

                if (pass) {
                    const response = await me.$api.authen.login(me.username, me.password);
                    if (response && response.status == Enum.MISA_CODE.SUCCESS) {  
                        this.$store.commit('setPermission', response.data);              
                        this.$router.push('/tong-quan')
                    } else {
                        me.messageError = me.$t('login.error_message.userAndPassword');
                        me.showDialog = true;
                    }
                }
            } catch (e) {
                me.messageError = me.$t('login.error_message.notExists');
                me.showDialog = true;
                console.log(e);
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
    .login {
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 100vh;
        position: fixed;
        background-image: url(@/assets/img/login-bg.png);
        background-size: cover;
        z-index: 1;

        display: flex;
        justify-content: center;

        font-family: -apple-system,system-ui,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif;
        line-height: 1.5;
        color: #212b35;
    }

    .login__container {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        width: 565px;

    }

    .login__header {
        margin-top: 80px;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 1rem;
        width: 100%;
    }

    .login__logo {
        height: 76px;
        width: 100%;
    }
    .login__logo img {
        width: 100%;
        height: 100%;
    }

    .login__title {
        margin-top: 40px;
        font-size: 30px;
        line-height: 30px;
        font-weight: 500;
    }

    .login__body {
        margin-top: 1.5rem;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .login__form {
        width: 100%;
    }

    .login__input {
        width: 100%;
        margin-bottom: 1rem;
    }

    .login__input input {
        background-image: none!important;
        border: thin solid #d3d5d7;
        border-radius: 40px;
        height: 48px;
        line-height: 1;
        color: #363636;
        font-size: .895rem;
        padding: 0 20px;
        width: 100%;
        outline: none;
        font-weight: 400;
    }

    .login__input input:hover {
        border: $bg-green-hover 1px solid;
    }

    .login__input input:active,
    .login__input input:focus{
        border: $bg-green-active 1px solid;
    }
    .login__input--error input,
    .login__input--error:hover input {
        border: rgb(230, 0, 0) 1px solid;
    }

    .login__button {
        width: 279px;
        height: 70px;
        margin-top: 50px;
        margin-bottom: 16px;
        display: flex;
        justify-content: center;
    }

    .login__button a {
        width: 100%;
    }

    .login__button button {
        width: 100%;
        border: none;
        border-radius: 50px;
        line-height: 64px;
        font-weight: 500;
        white-space: nowrap;
        font-size: 24px;
        transition: all .5s ease;
        background-color:  $bg-green;
        color: white;
        cursor: pointer;
        box-sizing: border-box;
    }

    .login__button button:hover {
        background-color:  $bg-green-hover;
    }

    .login__button button:active {
        background-color:  $bg-green-active;
    }


    @import "@/assets/scss/base/popup.scss";
    .popup-box{
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 16px rgba(169, 169, 171, 0.078);
        background-color: rgba(0,0,0,0.4);
    }

    .v-popup {
        background-color: rgb(255, 255, 255);
        border: 1px solid rgb(255, 255, 255);
        box-sizing: border-box;
        border-radius: 4px;
        animation: popFromCenter 200ms ease-in-out forwards;
    }
    
    .v-popup__text {
        font-size: 14px;
        font-weight: 400;
        font-family: Roboto;
    }
    @keyframes popFromCenter {
    0% {
    opacity: 0;
    transform: scale(0);
    }

    80% {
    opacity: 1;
    transform: scale(1.1);
    }

    100% {
    opacity: 1;
    transform: scale(1);
    }
}

.login__forgot {
    font-weight: 400;
}

.login__forgot:hover {
    color: rgb(66, 75, 177);
    text-decoration:underline;
    cursor: pointer;
}
</style>