<!-- @format -->

<template>
  <v-main class="list">
    <h3 class="text-h3 font-weight-medium mb-5">{{ title }}</h3>

    <v-card>
      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-btn color="success" dark @click="dialog = true"> Tambah </v-btn>
      </v-card-title>
      <v-data-table :headers="headers" :items="reservasi" :search="search">
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn small class="mr-2" @click="editHandler(item)"> edit </v-btn>
          <v-btn small class="mr-2" @click="deleteHandler(item.id_reservasi)"> delete </v-btn>
          <v-icon medium color="blue" @click="qrHandler(item)">
											mdi-qrcode
										</v-icon>
          <!-- <v-btn small class="mr-2" @click="editHandler(item)">
            <v-icon color="green"> mdi-table-edit </v-icon>
          </v-btn>
          <v-btn small @click="deleteHandler(item.id_reservasi)">
            <v-icon color="red"> mdi-delete </v-icon>
          </v-btn> -->
        </template>
        <template v-slot:[`item.id_customer`] ="{ item }">
            <tr>
              {{
                 getCustomerName(item.id_customer)
              }}
            </tr>
        </template>
        <template v-slot:[`item.id_karyawan`] ="{ item }">
            <tr>
              {{
                 getKaryawanName(item.id_karyawan)
              }}
            </tr>
        </template>

      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }} Reservasi</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            

            <v-menu
              ref="menu"
              v-model="menu"
              :close-on-content-click="false"
              :return-value.sync="date"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="form.tanggal_reservasi"
                  label="Tanggal Reservasi"
                  required
                  persistent-hint
                  prepend-icon="mdi-calendar"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="form.tanggal_reservasi"
                no-title
                scrollable
              >
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="menu = false">
                  Cancel
                </v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="$refs.menu.save(form.tanggal_reservasi)"
                >
                  Save
                </v-btn></v-date-picker
              >
            </v-menu>

            <v-menu
              ref="jam"
              v-model="jam"
              :close-on-content-click="false"
              :return-value.sync="form.jam_reservasi"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="form.jam_reservasi"
                  label="Jam Reservasi"
                  required
                  persistent-hint
                  prepend-icon="mdi-calendar-clock"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-time-picker
                v-model="form.jam_reservasi"
                format="24hr"
                use-seconds
                @change="checkSesion()"
              >
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="jam = false">
                  Cancel
                </v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="$refs.jam.save(form.jam_reservasi)"
                >
                  Save
                </v-btn></v-time-picker
              >
            </v-menu>

            <v-select
              v-model="form.no_meja"
              label="ID Meja "
              :items="meja"
              item-text="no_meja"
              required
            ></v-select>

            <v-select
              v-model="form.id_customer"
              label="Nama Customer "
              :items="customer"
              item-text="id_customer"
              required
            >
              <template slot="selection" slot-scope="name">
                {{ name.item.nama_customer }}
              </template>
              <template slot="item" slot-scope="name">
                {{ name.item.id_customer }} - {{ name.item.nama_customer }}
              </template>
            </v-select>
     
            <v-select
              v-model="form.id_karyawan"
              label="Karyawan"
              :items="karyawan"
              item-text="id_karyawan"
              required
            >
            <template slot="selection" slot-scope="name">
                {{ name.item.nama_karyawan }}
              </template>
              <template slot="item" slot-scope="name">
                {{ name.item.nama_karyawan }}
              </template>
            
            </v-select>

          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancel"> Cancel </v-btn>
          <v-btn color="blue darken-1" text @click="setForm"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogConfirm" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">warning!</span>
        </v-card-title>
        <v-card-text>
          Anda yakin ingin menghapus data reservasi ini?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogConfirm = false">
            Cancel
          </v-btn>
          <v-btn color="blue darken-1" text @click="deleteData"> Delete </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

     <v-dialog v-model="dialogqr" persistent max-width="400px">
			<v-card>
				<v-card-title><span class="headline">Cetak QR Code Customer</span></v-card-title>
				

				<qrcode :value="form.id_reservasi + '; ' 
								+ form.sesi + '; ' + form.tanggal_reservasi" 
				ref="qr" :options="{ width: 400 }"></qrcode>

			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn color="white darken-1" text @click="dialogqr = false">
					Kembali
				</v-btn>
				<v-btn color="red darken-1" text @click="exportPDF">
					Cetak
				</v-btn>
				
				</v-card-actions>
			</v-card>
		</v-dialog>


    <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
      {{ error_message }}
    </v-snackbar>
  </v-main>
</template>
<script>
import jsPDF from 'jspdf'
export default {
  name: "List",
  data() {
    return {
      title: "Reservasi",
      inputType: "Tambah",
      load: false,
      snackbar: false,
      error_message: "",
      color: "",
      search: null,
      dialogqr: false,
      dialog: false,
      dialogConfirm: false,
      headers: [
        {
          text: "ID Reservasi",
          align: "start",
          sortable: true,
          value: "id_reservasi",
        },
        { text: "Tanggal Reservasi", value: "tanggal_reservasi" },
        { text: "Jam Reservasi", value: "jam_reservasi" },
        { text: "Sesi", value: "sesi" },
        { text: "No Meja", value: "no_meja" },
        { text: "Customer", value: "id_customer" },
        { text: "Karyawan", value: "id_karyawan" },
        { text: "Actions", value: "actions" },
      ],
      reservasi: [],
      meja: [],
      customer: [],
      karyawan: [],
      id_reservasi: "",
      form: {
        jam_reservasi: null,
        tanggal_reservasi: null,
        sesi: null,
        no_meja: null,
        id_customer: null,
        id_karyawan: null,
      },
      deleteId: "",
      editId: "",
      date: "",
      menu: false,
      jam: false,
      modal: false,
    };
  },
  methods: {
    setForm() {
      if (this.inputType === "Tambah") {
        this.save();
      } else {
        this.update();
      }
    },


    getCustomerName(id_customer) {
        return this.customer.find((v) => v.id_customer == id_customer).nama_customer;
    },

    getKaryawanName(id_karyawan) {
        return this.karyawan.find((v) => v.id_karyawan == id_karyawan).nama_karyawan;
    },

    //read data reservasi
    readData() {
      var url = this.$api + "reservasi";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.reservasi = response.data.data;
        });
      url = this.$api + "meja";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.meja = response.data.data;
        });
      url = this.$api + "customer";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.customer = response.data.data;
        });
        url = this.$api + "karyawan";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.karyawan = response.data.data;
        });
    },
    //simpan data reservasi
    save() {
      var data = {
        tanggal_reservasi: this.form.tanggal_reservasi,
        jam_reservasi: this.form.jam_reservasi,
        sesi: this.form.sesi,
        no_meja: this.form.no_meja,
        id_customer: this.form.id_customer,
        id_karyawan: this.form.id_karyawan,
      };

      var url = this.$api + "reservasi/";
      this.load = true;
      this.$http
        .post(url, data, {
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
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },


   //ubah data reservasi
    update() {
      var data = {
        jam_reservasi: this.form.jam_reservasi,
        tanggal_reservasi: this.form.tanggal_reservasi,
        sesi: this.form.sesi,
        no_meja: this.form.no_meja,
        id_customer: this.form.id_customer,
        id_karyawan: this.form.id_karyawan,
        
      };
      this.error_message = "";
      var url = this.$api + "reservasi/" + this.editId;
      this.load = true;
      this.$http
        .put(url, data, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.checkSesion();
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
    checkSesion() {
      var t = new Date("01/01/1970 " + this.form.jam_reservasi);

      if (t.getHours() >= 11 && t.getHours() < 16) {
        this.form.sesi = "Lunch";
        console.log("if1");
        //  alert(this.sesion_reservasi);
      } else if (t.getHours() >= 17 && t.getHours() <= 21) {
        this.form.sesi = "Dinner";
        console.log("if2");
        //  alert(this.sesion_reservasi);
      }
    },
    //hapus data reservasi
    deleteData() {
      //mengahapus data
      var url = this.$api + 'reservasi/' + this.deleteId;
      //data dihapus berdasarkan id
      this.$http
        .delete(url, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        })
        .then((response) => {
          this.error_message = response.data.message;
          this.color = 'green';
          this.snackbar = true;
          this.load = false;
          this.close();
          this.readData(); //mengambil data
          this.resetForm();
          this.inputType = 'Tambah';
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = 'red';
          this.snackbar = true;
          this.load = false;
        });
    },

    qrHandler(item) {
			this.form.id_reservasi = item.id_reservasi;
			//this.form.id_customer = item.id_customer;
			//this.form.nama_customer= item.nama_customer;
			this.form.sesi= item.sesi;
			//this.form.id_meja = item.id_meja;
			//this.from.no_meja= item.no_meja;
			this.form.tanggal_reservasi = item.tanggal_reservasi;
			
			this.dialogqr = true;
		},

    exportPDF () {
			const doc = new jsPDF() 
			const contentHtml = this.$refs.qr.$el
			const image = contentHtml.toDataURL('image/jpeg', 0.8)

			doc.setLineWidth(0.01).line(0.5, 1.1, 8.0, 1.1);
			doc.text("Selamat Datang di Atma BBQ Lur", 55, 30);    
			doc.addImage(image, 'JPEG', 80, 100)
			doc.save('QR.pdf')
		},

    editHandler(item) {
      this.inputType = "Ubah";
      this.editId = item.id_reservasi;
      this.form.jam_reservasi = item.jam_reservasi;
      this.form.tanggal_reservasi = item.tanggal_reservasi;
      
      this.form.sesi = item.sesi;
      this.form.no_meja = item.no_meja;
      this.form.id_customer = item.id_customer;
      this.form.id_karyawan = item.id_karyawan;
      this.dialog = true;
    },
    deleteHandler(id) {
      this.deleteId = id;
      this.dialogConfirm = true;
    },
    close() {
      this.dialog = false;
      this.dialogConfirm = false;
      this.inputType = "Tambah";
    },
    cancel() {
      this.resetForm();
      this.readData();
      this.dialog = false;
      this.inputType = "Tambah";
    },
    resetForm() {
      this.form = {
        jam_reservasi: null,
        tanggal_reservasi: null,
        sesi: null,
        no_meja: null,
        id_customer: null,
        id_karyawan: null,
        qr_code : "",
      };
    },
  },
  computed: {
    formTitle() {
      return this.inputType;
    },
  },
  mounted() {
    this.readData();
  },
};
</script>