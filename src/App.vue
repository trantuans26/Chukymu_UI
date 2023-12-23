
<template>
  <div class="main">
    <div class="menu-container">
      <TheSidebar :collapsed="collapsed" @toggleSidebar="toggleSidebar" />
    </div>
    <div class="content-area">
      <div class="content">
        <router-view />
      </div>
    </div>
    <v-quick-key></v-quick-key>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      collapsed: false
    };
  },
  methods: {
    /**
     * Đóng mở sidebar
     * Author: tttuan 10/09/2022
     */
    toggleSidebar() {
      this.collapsed = !this.collapsed;
    }
  }
}
</script>
