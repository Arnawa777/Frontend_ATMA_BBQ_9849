import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
function importComponent(path) {
    return () => import(`./components/${path}.vue`)
}

Vue.use(VueRouter);

const router = new VueRouter({
    mode: "history",
    routes: [
        {
            path: "/",
            component: importComponent('DashboardLayout'),
            children: [

                //Dashboard
                {
                    path: "/dashboard",
                    name: "Dashboard",
                    meta: {title: 'Dashboard' },
                    component: importComponent('Dashboard'),
                },

                //Karyawan
                {
                    path: '/karyawan',
                    name: 'Karyawan',
                    meta: {title: 'Karyawan' },
                    component: importComponent('DataMaster/Karyawan'),
                },

                //Customer
                {
                    path: '/customer',
                    name: 'Customer',
                    meta: {title: 'Customer' },
                    component: importComponent('DataMaster/Customer'),
                },

                //Meja
                {
                    path: '/meja',
                    name: 'Meja',
                    meta: {title: 'Meja' },
                    component: importComponent('DataMaster/Meja'),
                },

                // Reservasi
                {
                    path: "/reservasi",
                    name: "Reservasi",
                    meta: {title: 'Reservasi' },
                    component: importComponent('DataMaster/Reservasi'),
                },

                //Bahan
                {
                    path: '/bahan',
                    name: 'Bahan',
                    meta: {title: 'Bahan' },
                    component: importComponent('DataMaster/Bahan'),
                },

                // Menu
                {
                    path: "/menu",
                    name: "Menu",
                    meta: {title: 'Menu' },
                    component: importComponent('DataMaster/Menu'),
                },

                // Pesanan
                {
                    path: "/pesanan",
                    name: "Pesanan",
                    meta: {title: 'Pesanan' },
                    component: importComponent('DataMaster/Pesanan'),
                },

                // Pesanan
                {
                    path: "/detailpesanan",
                    name: "Detail Pesanan",
                    meta: {title: 'Detail Pesanan' },
                    component: importComponent('DataMaster/DetailPesanan'),
                },
                
                // Pembayaran
                {
                    path: "/pembayaran",
                    name: "Pembayaran",
                    meta: {title: 'Pembayaran'},
                    component: importComponent('DataMaster/Pembayaran'),
                },

                // Riwayat Pembayaran
                {
                    path: "/riwayatpembayaran",
                    name: "Riwayat Pembayaran",
                    meta: {title: 'Riwayat Pembayaran'},
                    component: importComponent('DataMaster/RiwayatPembayaran'),
                },

                // Riwayat Stok
                {
                    path: "/riwayatstok",
                    name: "Riwayat Stok",
                    meta: {title: 'Riwayat Stok'},
                    component: importComponent('DataMaster/RiwayatStok'),
                },
 
                // Laporan Stok
                {
                    path: "/laporanstok",
                    name: "Laporan Stok",
                    meta: {title: 'Laporan Stok' },
                    component: importComponent('DataMaster/LaporanStok'),
                },

                // Laporan
                {
                    path: "/laporanpendapatan",
                    name: "Laporan Pendapatan",
                    meta: {title: 'Laporan Pendapatan' },
                    component: importComponent('DataMaster/LaporanPendapatan'),
                },
            ]
        },
        //login
        {
            path:"/login",
            name:"login",
            meta:{title: 'Login'},
            component: importComponent('Login'),
        },
        {
            path: '*',
            redirect:'/login',
            component: importComponent('Login'),
        },
    ],
});

router.beforeEach((to, from, next) => {
    document.title = to.meta.title
    next()
});
export default router;