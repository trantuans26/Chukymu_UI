<template>
    <div class="error-page">
        <div class="error-page__content">
            <div class="error-page__content__title">
                <img :src="require('@/assets/img/bg_404.svg')" alt="error" />
            </div>
            <div class="error-page__content__description">
                <h1 class="font-weight">Không tìm thấy trang</h1>
            </div>
            <div class="error-page__content__button d-flex justify-content-center border-rounded">
                <router-link to="/">
                    <v-button className="border-radius-30">
                        Quay lại
                    </v-button>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ErrorPage',
    data() {
        return {
            description: 'Page not found',
        }
    }

}
</script>

<style lang="scss" scoped>
.error-page {

    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;

    .error-page__content {
        transform: translateY(-48px);
        text-align: center;

        .error-page__content__title {
            img {
                width: 100%;
                max-width: 400px;
            }
        }

        .error-page__content__description {
            margin: 32px;
            color: #111;
        }
    }
}
</style>