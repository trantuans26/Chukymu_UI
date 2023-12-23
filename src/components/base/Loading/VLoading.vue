<template>
    <transition name="fade">
        <div class="loading" v-if="!isLoaded">
            <div class="loading__content">
                <div class="loading__icon"></div>
                <!-- <div class="loading__text">Đang tải dữ liệu...</div> -->
            </div>
        </div>
    </transition>

</template>
  
<script>
// import { mapState } from "vuex";
export default {
    name: "BaseLoading",
    props: {
        isLoaded: {
            style: Boolean,
            default: false,
        }
    },
};
</script>
<style scoped lang="scss">
@import "@/assets/scss/base/loading.scss";
</style>
