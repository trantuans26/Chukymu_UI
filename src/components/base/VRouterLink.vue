<template>
    <v-tooltip :content="$t(`sidebar.${content}`)">
        <router-link :to="link" class="sidebar__item" @click="resetListId">
            <div class="sidebar__item--icon">
                <div :class="icon"></div>
            </div>
            <div class="sidebar__item--text">
                {{ $t(`sidebar.${content}`) }}
            </div>
        </router-link>
    </v-tooltip>
</template>

<script>
export default {
    name: "VRoutelink",
    props: {
        link: {
            type: String,
            default: ''
        },
        content: {
            type: String,
            default: ''
        },
        icon: {
            type: String,
            default: ''
        },
    },

    methods: {
        resetListId() {
            this.$store.commit('setListIdSelected', []);
        }
    },
}
</script>

<style scoped lang="scss">
.router-link-active {
    border-left-color: $border-left-sidebar;
    background-color: rgb(52, 62, 93);

    .sidebar__item--icon {
        div {
            opacity: 1;
        }
    }

    .sidebar__item--text {
        font-family: 'MISA Fonts Bold';
    }
}
</style>