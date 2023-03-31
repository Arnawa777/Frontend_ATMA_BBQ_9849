<template>
  <v-main>
    <template>
        <h3 class="text-h3 font-weight-medium mb-5">Riwayat Stok</h3>
      <v-row>
        <v-card-title>
          <v-text-field
            v-model="search"
            label="Search"
            class="mx-4"
          ></v-text-field>
        <v-spacer></v-spacer>
          <v-btn
            color="success"
            @click="addStock"
          >
            Tambah Stok
            <template v-slot:loader>
            </template>
          </v-btn>
          </v-card-title>
        <v-col cols="12" sm="6" md="3"> </v-col>
      </v-row>
      
    </template>
    <template v-slot:[`item.actions`]="{ item }">
          <v-btn small class="mr-2" @click="editHandler(item)"> edit </v-btn>
          <v-btn small class="mr-2" @click="deleteHandler(item.id_reservasi)"> delete </v-btn>
      </template>
    
    <template>
      <v-data-table
        :headers="headers"
        :items="stock"
        :items-per-page="15"
        :search="search"
        :loading="loadingData"
        class="elevation-1"
        fixed-header
      >
      </v-data-table>
    </template>
    

    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline"> {{ inputType }} Stok </span>
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
                  v-model="form.tanggal"
                  label="Tanggal"
                  required
                  persistent-hint
                  prepend-icon="mdi-calendar"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="form.tanggal"
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
                  @click="$refs.menu.save(form.tanggal)"
                >
                  Save
                </v-btn></v-date-picker
              >
            </v-menu>


            <v-text-field
              v-model="form.id_bahan"
              label="Bahan"
              required
            ></v-text-field>

            <v-text-field
              v-model="form.stok_masuk"
              label="Stok Masuk"
              required
            ></v-text-field>


            <v-text-field
              v-model="form.keterangan"
              label="Keterangan"
              required
            ></v-text-field>

            <v-text-field
              v-model="form.harga_stok_bahan"
              label="Harga"
              required
            ></v-text-field>

          </v-container>

        </v-card-text>
        <v-card-actions>
            
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="setForm"> Save </v-btn>
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
      dialogDetails: false,
      loader: null,
      loadingData: true,
      inputType: "Tambah",
      snackbar: "",
      riwayat_stok: [],
      table: new FormData(),
      item: [],
      search: "",
      color: "",
      error_message: "",
      deleteId: "",
      bahan: [],
      editId: "",
      filter: null,
      load: false,
      formTitle: "StokBahan",
      headers: [
        {
          text: "ID",
          align: "start",
          sortable: false,
          value: "id_riwayat_stok",
          width: "3%",
        },
        {
          text: "Nama Bahan",
          value: "id_bahan",
          width: "15%",
        },

        {
          text: "Stok Keluar",
          value: "stok_keluar",
          width: "20%",
        },

        {
          text: "Stok Masuk",
          value: "stok_masuk",
          width: "20%",
        },

        {
          text: "Keterangan",
          value: "keterangan",
          width: "20%",
        },

        {
          text: "Jumlah Stok",
          sortable: false,
          value: "jumlah_stok",
          width: "10%",
        },
        
        {
          text: "Harga",
          sortable: false,
          value: "harga_stok_bahan",
        },

        {
          text: "Tanggal",
          sortable: false,
          value: "tanggal",
          width: "20%",
        },
        { text: "Actions", value: "actions" },

      ],
      form: {
        id_riwayat_stok: null,
        sum_stock: null,
        tanggal: null,
      },
    };
  },

  methods: {
    readData() {
      var url = this.$api + "riwayat_stok";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.stock = response.data.data;
          this.loadingData = false;
          console.log(this.data);
        });
    },

    readDataBahan() {
      var url = this.$api + "/bahan";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.bahan = response.data.bahan;
          this.loadingData = false;
          console.log(this.bahan);
        });
    },



    editHandler(item) {
      this.inputType = "Ubah";
      this.editId = item.id_stock;
      console.log(this.editId);
      this.form.id = item.id_stock;
      this.form.booking_date = item.booking_date_stock;
      this.form.status = item.status_stock;
      this.dialog = true;
    },
    deleteHandler(item) {
      this.deleteId = item.id_stock;
      console.log(item.id_stock);
      this.dialogConfirm = true;
    },
    close() {
      this.dialog = false;
      this.dialogConfirm = false;
      this.inputType = "Tambah";
    },
    cancel() {
      // this.resetForm();
      this.readData();
      this.dialog = false;
      this.inputType = "Tambah";
    },
    setForm() {
      if (this.inputType == "Tambah") {
        this.save();
      } else {
        this.update();
      }
    },

    resetForm() {
      // this.image = this.defaultImage;
      this.form = {
        id: "",
        date: new Date().toISOString().substr(0, 10),
        booking_date: "",
        status: "tersedia",
      };
    },
    getColor(status) {
      if (status) return "green";
      else return "red";
    },
  },
  mounted() {
    this.readData();
    this.readDataBahan();
    // console.log(this.today);
  },
};
</script>


