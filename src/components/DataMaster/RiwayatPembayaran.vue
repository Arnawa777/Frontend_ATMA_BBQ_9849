<template >
  <v-main>
    <template>
      <v-row>
        <v-col cols="12" sm="6" md="7">
          <v-text-field
            v-model="search"
            label="Search"
            class="mx-4"
          ></v-text-field>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="12" sm="6" md="3">

        </v-col>
      </v-row>
    </template>

    <template>
      <v-data-table
        :headers="headers"
        :items="pembayaran"
        :items-per-page="15"
        class="elevation-1"
        fixed-header
        :search="search"
      >

        <template v-slot:[`item.harga`]="{ item }">
          <span class="bold">Sub Total : Rp. 11000</span>
          <br />
          <span class="bold">Layanan :Rp. {{ item.layanan }} </span>
          <br />
          <span class="bold">Pajak :Rp. {{ item.pajak }} </span> <br />
          <span class="bold">Total :Rp. {{ item.total_pembayaran }} </span> <br />
        </template>

        <template v-slot:[`item.tipe_pembayaran`]="{ item }">
          <div>
              {{ item.tipe_pembayaran }}
          </div>
        </template>
      </v-data-table>
    </template>
  </v-main>
</template>

    <script>
export default {
  data() {
    return {
      dialog: false,
      dialogConfirm: false,
      inputType: "",
      search: "",
      snackbar: "",
      loading2: false,
      loadingData: true,
      pembayaran: [],
      pesanandone: [],
      dialogPembayaran: "",
      color: "",
      x: "",
      error_message: "",
      image: "",
      formTitle: "Menu",
      headers: [
        {
          text: "No Pembayaran",
          align: "start",
          value: "no_pembayaran",
        },
        {
          text: "Nama Karyawan",
          align: "start",
          value: "id_karyawan",
          width: "10%",
        },
        {
          text: "ID Pesanan",
          align: "start",
          sortable: false,
          value: "id_pesanan",
          width: "1%",
        },
        { text: "Harga", value: "harga", width: "25%" },
        { text: "Metode", align: "start", value: "tipe_pembayaran" },
        { text: "Tanggal Pembayaran", value: "tanggal_pembayaran" },
      ],

      headersPesanan: [
        {
          text: "No",
          align: "start",
          sortable: false,
          value: "id_pesanan",
          width: "1%",
        },
        { text: "Customer ID", width: "5%", value: "customer_data" },
        { text: "Nama Menu", width: "5%", value: "get_detil_relation" },
        { text: "Jumlah Order", width: "3%", value: "jumlah_order" },
        { text: "Sub Total", width: "3%", value: "sub_total" },
        { text: "Total Price", width: "5%", value: "total_pesanan" },
        { text: "Status Pesanan", width: "5%", value: "status_pesanan" },
        { text: "Pengaturan", width: "1%", value: "pengaturan" },
      ],

      headersDialog: [
        { text: "Nama Menu", width: "5%", value: "get_detil_relation" },
        { text: "Jumlah Order", width: "3%", value: "jumlah_order" },
        { text: "Sub Total", width: "3%", value: "sub_total" },
      ],
      table: new FormData(),
      form: {
        id_karyawan: "",
        id_reservasi: "",
        layanan: "",
        pajak: "",
        total_pembayaran: "",
        tipe_pembayaran: "",
        card_number: "",
        verification_code_pembayaran: "",
        uang_customer: "",
        date_pembayaran: "",
      },
      pesananBayar: [],
    };
  },

  methods: {
    readData() {
      var url = this.$api + "pembayaran";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.pembayaran = response.data.data;
          console.log("pembayaran : " + this.data);
          this.loadingData = false;
        });
    },

    // readDataPesanan() {
    //   var url = this.$api + "pesanan";
    //   this.$http
    //     .get(url, {
    //       headers: {
    //         Authorization: "Bearer " + localStorage.getItem("token"),
    //       },
    //     })
    //     .then((response) => {
    //       this.pesanandone = response.data.pesanan;
    //       console.log(this.pesanandone);
    //     });
    // },
    gantiPesananLunas() {
      let newData = {
        status_pesanan: "lunas",
      };
      var url = this.$api + "pesanan_lunas/" + this.form.id_reservasi;
      console.log(this.form.id_reservasi);
      this.load = true;
      this.$http
        .put(url, newData, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.error_message = response.data.message;
          this.color = "green";
          this.snackbar = true;
          this.load = false;
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },

    readDataPesananBayar() {
      var url = this.$api + "pesanan/" + this.form.id_reservasi;
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.pesananBayar = response.data.pesanan;
          console.log(this.pesananBayar);
          // this.loadingData = false;
        });
    },
    bayar() {
      // console.log(this.form.total_pembayaran);
      this.table.append("tipe_pembayaran", this.form.tipe_pembayaran);
      this.table.append("layanan", this.form.layanan);
      this.table.append("pajak", this.form.pajak);
      this.table.append("total_pembayaran", this.form.total_pembayaran);
      this.table.append("card_number_pembayaran", this.form.card_number);
      this.table.append("id_karyawan", this.form.id_karyawan);
      this.table.append("id_reservasi", this.form.id_reservasi);
      this.table.append(
        "verification_code_pembayaran",
        this.form.verification_code_pembayaran
      );
      this.table.append(
        "verification_code_pembayaran",
        this.form.verification_code_pembayaran
      );
      // console.log(this.table);

      // this.gantiPesananLunas();
      var url = this.$api + "pembayaran";
      this.load = true;
      this.$http
        .post(url, this.table, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.error_message = response.data.message;
          this.color = "green";
          this.snackbar = true;
          this.load = false;
          this.gantiPesananLunas();
          this.resetForm();
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },

    addMenu() {
      this.dialog = true;
      this.loader = "loading2";
      this.inputType = "Tambah";
      // this.save();
    },
    deleteData() {
      //mengahapus data
      var url = this.$api + "/item/" + this.deleteId;
      //data dihapus berdasarkan id
      this.$http
        .delete(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.error_message = response.data.message;
          this.color = "green";
          this.snackbar = true;
          this.load = false;
          this.close();
          this.readData(); //mengambil data
          this.resetForm();
          this.inputType = "Tambah";
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },
    numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    cancel() {
      this.resetForm();
      this.readData();
      this.dialog = false;
      this.inputType = "Tambah";
    },
    getRolesName() {
      return localStorage.getItem("role_pegawai");
    },
    bayarhandler(item) {
      // this.readDataPesananBayar();
      this.form.id_karyawan = item.id_pesanan;
      this.form.id_reservasi = item.id_reservasi;
      this.form.layanan = item.total_pesanan * 0.05;
      this.form.pajak = item.total_pesanan * 0.1;
      this.form.total_pembayaran =
        this.form.layanan + this.form.pajak + item.total_pesanan;
      console.log(this.form.total_pembayaran);
      this.dialogPembayaran = true;
    },
    resetForm() {
      this.image = this.defaultImage;
      this.form = {
        name: "",
        stock_s: 0,
        stock_m: 0,
        stock_l: 0,
        stock_xl: 0,
        active: true,
        description: "",
        price: 0,
        image64: "",
      };
    },
    getColor(status) {
      if (status) return "green";
      else return "red";
    },
  },
  mounted() {
    // this.readDataPesanan();
    this.readData();
  },
};
</script>