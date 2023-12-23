<template>
    <div class="develop-page">
        <div class="develop-page__content">
            <div class="develop-page__content__title">
                <img :src="require('@/assets/img/development.svg')" alt="error" />
            </div>
            <div class="develop-page__content__description">
                <h1 class="font-weight">{{$t('notice_message.page_developing')}}</h1>
            </div>
            <div class="develop-page__content__button d-flex justify-content-center border-rounded">
                <router-link to="/">
                    <v-button className="border-radius-30">
                        {{$t('action.return')}}
                    </v-button>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.develop-page {

    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;

    .develop-page__content {
        transform: translateY(-48px);
        text-align: center;
        width: 600px;

        .landing-page__content__title {
            img {
                width: 100%;
                max-width: 400px;
            }
        }

        .develop-page__content__description {
            margin: 32px;
            color: #111;
        }
    }
}
</style>