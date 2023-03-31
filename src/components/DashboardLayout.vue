<template>
    <div class="dashboard">
        <v-navigation-drawer class="fullheight deep-purple darken-3" width="256" permanent app fixed>
            <v-list-item>
                <v-list-item-content>
                  <v-img src="https://media.discordapp.net/attachments/651600695849648158/837169232030203904/DaebakW.png?width=702&height=702">
                  
                  </v-img>
                </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

            <v-list dense nav>
                <v-list-item
                    v-for="item in items"
                    :key="item.title"
                    link
                    tag="router-link"
                    :to="item.to"
                >
                    <v-list-item-content>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar app fixed height="75px">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <VSpacer />
      <v-toolbar-items>
        <v-btn text router @click="logout"><v-icon>mdi-power</v-icon></v-btn>
      </v-toolbar-items>
    </v-app-bar>

        <div class="grey darken-4 fullheight pa-10">
            <router-view></router-view>
        </div>
    </div>
</template>
<script>
export default {
    name: "Dashboard",
    methods: {
    logout() {
      this.$http
        .post(
          this.$api + "/logout",
          {},
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        )
        .then(() => {
          localStorage.removeItem("token");

          // remove any other authenticated user data you put in local storage

          // Assuming that you set this earlier for subsequent Ajax request at some point like so:
          // axios.defaults.headers.common['Authorization'] = 'Bearer ' + auth_token ;
          delete this.$http.defaults.headers.common["Authorization"];

          // If using 'vue-router' redirect to login page
          this.$router.push({
            name: "login",
          });
        })
        .catch(() => {
          // If the api request failed then you still might want to remove
          // the same data from localStorage anyways
          // perhaps this code should go in a finally method instead of then and catch
          // methods to avoid duplication.
          localStorage.removeItem("token");
          delete this.$http.defaults.headers.common["Authorization"];
          this.$router.push({
            name: "login",
          });
        });
    },
  },
    data() {
    return {
        drawer: true,
            items: [
                { title: "Dashboard", to: "/dashboard" },
                { title: "Karyawan", to: "/karyawan" },
                { title: "Customer", to: "/customer" },
                { title: "Meja", to: "/meja" },
                { title: "Reservasi", to: "/reservasi" },
                { title: "Bahan", to: "/bahan" },
                { title: "Menu", to: "/menu" },
                { title: "Pesanan", to: "/pesanan" },
                { title: "Detail Pesanan", to: "/detailpesanan" },
                { title: "Pembayaran", to:"/pembayaran"},
                { title: "Riwayat Pembayaran", to:"/riwayatpembayaran"},
                { title: "Riwayat Stok", to:"/riwayatstok"},
                { title: "Laporan Stok", to: "/laporanstok" },
                { title: "Laporan Pendapatan", to: "/laporanpendapatan" },
                
            ],
        };
    },
};
</script>
<style scoped>
.fullheight {
    min-height: 100vh !important;
}
</style>