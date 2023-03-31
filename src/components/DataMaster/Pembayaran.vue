<template >
  <v-main>
    <template>
      <v-row>
        <v-col cols="12" sm="6" md="7">
          <v-text-field
            v-model="search"
            label="Pencarian Data Pembayaran"
            class="mx-4"
          ></v-text-field>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="12" sm="6" md="3"> </v-col>
      </v-row>
    </template>

    <template>
      <v-data-table
        :headers="headersPesanan"
        :items="pesanan_belum_bayar"
        :items-per-page="5"
        class="elevation-1"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn  @click="bayarhandler(item)"> Bayar </v-btn>
          <v-btn class="mr-2" @click="cetakStruk(item)"> Print </v-btn>
        </template>

        <template v-slot:[`item.get_detil_relation`]="{ item }">
          <div v-for="(detail, index) in item.detail_pesanan" :key="index">
            <p class="text-capitalize">
              {{ item.detail_pesanan[index].id_menu }}
            </p>
          </div>
        </template>

        <template v-slot:[`item.jumlah_order`]="{ item }">
          <div v-for="(detail, index) in item.detail_pesanan" :key="index">
            <p class="text-capitalize">
              {{ item.detail_pesanan[index].kuantitas }}
            </p>
          </div>
        </template>

        <template v-slot:[`item.subtotal`]="{ item }">
          <div v-for="(detail, index) in item.detail_pesanan" :key="index">
            <p class="text-capitalize">
              {{ item.detail_pesanan[index].subtotal }}
            </p>
          </div>
        </template>
      </v-data-table>
    </template>

    <v-dialog v-model="dialogPembayaran" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ inputType }} Pembayaran </span>
        </v-card-title>
        <v-card-text>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">Jumlah</th>
                  <th class="text-left">Nama Menu</th>
                  <th class="text-left">Harga</th>
                  <th class="text-left">Sub Total</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in pesananBayar.get_detil_relation"
                  :key="item.get_detil_relation"
                >
                  <td>{{ item.kuantitas }}</td>
                  <td>{{ item.get_detil_relation.id_menu }}</td>
                  <td>{{ item.get_menu_relation.price_menu }}</td>
                  <td>{{ item.subtotal }}</td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td>Sub Total</td>
                  <td>Rp. {{ pesananBayar.total_pesanan }}</td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td>Service 5%</td>
                  <td>Rp. {{ pesananBayar.total_pesanan * 0.05 }}</td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td>Tax 10%</td>
                  <td>Rp. {{ pesananBayar.total_pesanan * 0.1 }}</td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td>Total Harga</td>
                  <td>
                    Rp.
                    {{
                      pesananBayar.total_pesanan 
                      
                    }}
                    <!-- + pesananBayar.total_pesanan * 0.05 +
                      pesananBayar.total_pesanan * 0.1 -->
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          <h4>Metode Pembayaran</h4>
          <v-radio-group v-model="form.tipe_pembayaran" row>
            <v-radio label="Tunai" value="tunai"></v-radio>
            <v-radio label="Debit Card" value="debit_card"> </v-radio>
            <v-radio label="Credit Card" value="credit_card"> </v-radio>
          </v-radio-group>

          <div v-if="form.tipe_pembayaran == 'debit_card'">
            <v-col cols="12" sm="6" md="12">
              <v-text-field
                label="Nomer Kartu"
                v-model="form.card_number"
              ></v-text-field>
              <v-text-field
                label="Verifikasi code pembayaran"
                v-model="form.verification_code_pembayaran"
                required
              ></v-text-field>
              <v-text-field
                label="Uang Customer"
                v-model="form.uang_customer"
                required
              ></v-text-field>
            </v-col>
          </div>
          <div v-else-if="form.tipe_pembayaran == 'credit_card'">
            <v-col cols="12" sm="6" md="12">
              <v-text-field
                label="Nama Pemilik Kartu"
                v-model="form.card_number"
              ></v-text-field>
              <v-text-field
                label="Nomer Kartu"
                v-model="form.card_number"
              ></v-text-field>
              <v-text-field
                label="Verifikasi code pembayaran"
                v-model="form.verification_code_pembayaran"
                required
              ></v-text-field>
              <v-text-field
                label="Uang Customer"
                v-model="form.uang_customer"
                required
              ></v-text-field>
            </v-col>
          </div>
          <div v-else-if="form.tipe_pembayaran == 'tunai'">
            <v-text-field
              label="Uang Customer"
              v-model="form.uang_customer"
              required
            ></v-text-field>
          </div>

          <h5 class="white--text">
            Kembalian : {{ form.uang_customer - form.total_pembayaran }}
          </h5>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red darken-1  white--text"
            @click="dialogPembayaran = false"
          >
            Close
          </v-btn>
          <v-btn color="green darken-1 white--text" @click="bayar()">
            Bayar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogConfirm" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">Warning!</span>
        </v-card-title>
        <v-card-text>
          Apakah anda yakin ingin menonaktifkan akun ini?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogConfirm = false"
            >Cancel
          </v-btn>
          <v-btn color="blue darken-1" text @click="deleteData"> Delete </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
      {{ error_message }}
    </v-snackbar>
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
      reservasi: [],
      menu: [],
      pembayaran: [],
      pesanan_belum_bayar: [],
      pesanan: [],
      detail_pesanan: [],
      dialogPembayaran: "",
      color: "",
      x: "",
      error_message: "",
      image: "",
      formTitle: "Menu",

      headersPesanan: [
        {
          text: "No",
          align: "start",
          sortable: false,
          value: "id_pesanan",
          width: "1%",
        },
        { text: "Reservasi ID", width: "5%", value: "id_reservasi" },
        { text: "Nama Menu", width: "5%", value: "get_detil_relation" },
        { text: "Jumlah Order", width: "3%", value: "jumlah_order" },
        { text: "Sub Total", width: "3%", value: "subtotal" },
        { text: "Total Price", width: "5%", value: "total_pesanan" },
        { text: "Status Pembayaran", width: "5%", value: "status_pembayaran" },
        { text: "Actions", width: "1%", value: "actions" },
      ],

      headersDialog: [
        { text: "Nama Menu", width: "5%", value: "get_detil_relation" },
        { text: "Jumlah Order", width: "3%", value: "jumlah_order" },
        { text: "Sub Total", width: "3%", value: "sub_total" },
      ],

      table: new FormData(),
      form: {
        tipe_pembayaran: "",
        tanggal_pembayaran: "",
        layanan: "",
        pajak: "",
        total_pembayaran: "",
        kode_verifikasi_edc: "",
        uang_customer: "",
        id_info_pembayaran: "",
        id_karyawan: "",
        id_reservasi: "",
      },
      pesananBayar: [],
    };
  },

  methods: {
    // getMenuName(id_menu) {
    //     return this.menu.find((v) => v.id_menu == id_menu).nama_menu;
    // },

    readDataPesanan() {
      var url = this.$api + "pesananBelumBayar";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.pesanan_belum_bayar = response.data.data;
          console.log(this.pesanan_belum_bayar);
        });
    },

    readDataMenu() {
      var url = this.$api + "menu";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.menu = response.data.data;
          console.log(this.menu);
        });
    },

    readDataDetailPesanan() {
      var url = this.$api + "detail_pesanan";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.detail_pesanan = response.data.data;
          console.log(this.detail_pesanan);
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
          this.pesananBayar = response.data.data;
          console.log(this.pesananBayar);
          // this.loadingData = false;
        });
    },

    readDataPembayaran(){
      var url = this.$api + "pembayaran";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.pembayaran = response.data.data;
          console.log(this.pembayaran);
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
    
    bayarhandler(item) {
      this.readDataPesananBayar();
      this.form.id_karyawan = item.id_pesanan;
      this.form.id_reservasi = item.id_reservasi;
      this.form.layanan = item.layanan * 0.05;
      this.form.pajak = item.pajak * 0.1;
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

     cetakStruk(item) {
    let stylesHtml = "";
    for (const node of [
      ...document.querySelectorAll('link[rel="stylesheet"], style'),
    ]) {
      stylesHtml += node.outerHTML;
    }
    var increment = localStorage.getItem("increment");

    if (localStorage.getItem("increment") == null) {
      increment = 1;
      localStorage.setItem("increment", increment);
    } else {
      increment++;
      localStorage.setItem("increment", increment);
    }

    // Open the print window
    const GetWorld = window.open(
      "",
      "",
      "left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0"
    );

    GetWorld.document.write(
      `<!DOCTYPE html>
        <html lang="en" >
        <head>
          <meta charset="UTF-8">
          <title>CodePen - Vue Invoice</title>
          
          ${stylesHtml}
          <style>
        .invoice-box {
          max-width: 800px;
          margin: auto;
          padding: 30px;
          border: 1px solid #eee;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
          font-size: 16px;
          line-height: 24px;
          font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif;
          color: #555;
        }

        .invoice-box table {
          width: 100%;
          line-height: inherit;
          text-align: left;
        }

        .invoice-box table td {
          padding: 5px;
          vertical-align: top;
        }

        .invoice-box table tr td:nth-child(n + 2) {
          text-align: right;
        }

        .invoice-box table tr.top table td {
          padding-bottom: 20px;
        }

        .invoice-box table tr.top table td.title {
          font-size: 45px;
          line-height: 45px;
          color: #333;
        }

        .invoice-box table tr.information table td {
          padding-bottom: 40px;
        }

        .invoice-box table tr.heading td {
          background: #eee;
          border-bottom: 1px solid #ddd;
          font-weight: bold;
        }

        .invoice-box table tr.details td {
          padding-bottom: 20px;
        }

        .invoice-box table tr.item td {
          border-bottom: 1px solid #eee;
        }

        .invoice-box table tr.item.last td {
          border-bottom: none;
        }

        .invoice-box table tr.item input {
          padding-left: 5px;
        }

        .invoice-box table tr.item td:first-child input {
          margin-left: -5px;
          width: 100%;
        }

        .invoice-box table tr.total td:nth-child(2) {
          border-top: 2px solid #eee;
          font-weight: bold;
        }

        .invoice-box input[type="number"] {
          width: 60px;
        }

        @media only screen and (max-width: 600px) {
          .invoice-box table tr.top table td {
            width: 100%;
            display: block;
            text-align: center;
          }

          .invoice-box table tr.information table td {
            width: 100%;
            display: block;
            text-align: center;
          }
        }

        /** RTL **/
        .rtl {
          direction: rtl;
          font-family: Tahoma, "Helvetica Neue", "Helvetica", Helvetica, Arial,
            sans-serif;
        }

        .rtl table {
          text-align: right;
        }

        .rtl table tr td:nth-child(2) {
          text-align: left;
        }
        </style>
        </head>
        <body>
        <!-- partial:index.partial.html -->
        <div class="invoice-box">
          <table cellpadding="0" cellspacing="0">
            <tr class="top">
              <td colspan="4">
                <table>
                  <tr>
                    <td class="title">
                      <img src="` +
                require("@/assets/Daebak.png") +
                `" style="width:100%; max-width:300px;">
                    </td>

                    <td>
                      Receipt # AKB-0` +
                (new Date().getMonth() + 1) +
                `0` +
                new Date().getDate() +
                new Date().getFullYear() +
                `-0` +
                increment +
                `<br>
                   0`+
                new Date().getDate() +
                `/0` +
                new Date().getMonth() +
                `/` +
                new Date().getFullYear() +
                `<br> 
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr class="information">
              <td colspan="4">
                <table>
                  <tr>
                    <td>
                      Jl. Babarsari No.43 Yogyakarta, Atma Korean BBQ FUN PLACE TO GRILL.<br> Telp. (0274) 487711 Jl. Babarsari No.43 Yogyakarta<br> Jl. Babarsari No.43 Yogyakarta,  552181
                    </td>

                    <td>
                      Acme Corp.<br> John Doe<br> john@example.com
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr class="heading">
              <td colspan="3">Payment Method</td>
              <td>Check #</td>
            </tr>

            <tr class="details">
              <td colspan="3">Check</td>
              <td>1000</td>
            </tr>

            <tr class="heading">
              <td>Item</td>
              <td>Unit Cost</td>
              <td>Quantity</td>
              <td>Price</td>
            </tr>`
            );
    var pajak = 0;
    var layanan = 0;
    var total_pembayaran = 0;
    for (let i = 0; i < this.pembayaran.length; i++) {
      if (item.id_pesanan === this.pembayaran[i].id_pesanan) {
        pajak=this.pembayaran[i].pajak
        layanan=this.pembayaran[i].layanan
        total_pembayaran=this.pembayaran[i].total_pembayaran

        for (let j = 0; j < this.detail_pesanan.length; j++) {
          if (this.detail_pesanan[j].id_pesanan === this.pembayaran[i].id_pesanan) {
            GetWorld.document.write(
              `<tr class="item">
              <td>` +
                this.detail_pesanan[j].nama_menu +
                `</td>
              <td>` +
                this.detail_pesanan[j].harga_menu +
                `</td>
              <td>` +
                this.detail_pesanan[j].kuantitas +
                `</td>
              <td>` +
                this.detail_pesanan[j].subtotal +
                `</td>
            
            </tr>`
            );
          }
        }
      }
    }

    GetWorld.document.write(
      `


    <tr class="total">
      <td></td>
      <td></td>
      <td></td>
      <td colspan="3">SubTotal: ` +
        item.total_pesanan +
        `</td>
      
    </tr>
    <tr class="total">
      <td></td>
      <td></td>
      <td></td>
      <td colspan="3">Pajak: ` +
        pajak +
        `</td>
      
    </tr>
    <tr class="total">
      <td></td>
      <td></td>
      <td></td>
      <td colspan="3">Service: ` +
        layanan +
        `</td>
      
    </tr>
    <tr class="total">
      <td></td>
      <td></td>
      <td></td>
      <td colspan="3">Total: ` +
        total_pembayaran +
        `</td>
      
    </tr>
  </table>
</div>
<!-- partial -->


</body>
</html>
`
    );

    GetWorld.document.close();
    GetWorld.focus();
    GetWorld.print();
  },


  },

 

  mounted() {
    this.readDataPesanan();
    this.readDataMenu();
    this.readDataDetailPesanan();
    this.readDataPembayaran();
  },
};
</script>


