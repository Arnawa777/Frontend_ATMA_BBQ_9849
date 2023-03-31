 <template>
  <v-main class="list">
    <h3 class="text-h3 font-weight-medium mb-5">Pesanan</h3>

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
        
      </v-card-title>
      
      <v-data-table :headers="headers" :items="pesanan" :search="search">
        
        <template v-slot:[`item.actions`]="{ item }">

          <v-btn small class="mr-2" @click="editHandler(item)"> edit status </v-btn>
        </template>
        <template v-slot:[`item.id_bahan`] ="{ item }">
            <tr>
              {{
                 getBahanName(item.id_bahan)
              }}
            </tr>
        </template>


      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }} Status</span>
        </v-card-title>

        <v-card-text>
          <v-container>

            <v-text-field
              v-model="form.jumlah_item"
              v-if="formTitle!=='Ubah'"
              label="Jumlah Item"
              :rules="[rules.required]"
              required
            ></v-text-field>

            <v-text-field
              v-model="form.total_pesanan"
              v-if="formTitle!=='Ubah'"
              label="Total Pesanan"
              :rules="[rules.required]"
              required
            ></v-text-field>

            <v-select
              v-model="form.status_pesanan"
              label="Status Pesanan "
              :rules="[rules.required]"
              :items="['served', 'ready to served', 'prepared']"
              required
            >
            </v-select>

            <v-text-field
              v-model="form.id_reservasi"
              v-if="formTitle!=='Ubah'"
              label="Reservasi"
              :rules="[rules.required]"
              required
            ></v-text-field>

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
        <v-card-text> Anda yakin ingin menghapus data pesanan? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogConfirm = false">
            Cancel
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
  name: "List",
  data() {
    return {
      inputType: "Tambah",
      load: false,
      snackbar: false,
      error_message: "",
      color: "",
      search: null,
      dialog: false,
      dialogConfirm: false,
      menu: false,
      rules: {
          required: value => !!value || 'Required.',
          min: v => v.length >= 6 || 'Min 6 characters',
        },

      headers: [
        {
            text: "ID",
            value: "id_pesanan"
        },
        {
          text: "Jumlah Item",
          align: "start",
          sortable: true,
          value: "jumlah_item",
        },
        { text: "Total Pesanan", value: "total_pesanan" },
        { text: "Status Pesanan", value: "status_pesanan" },
        { text: "Reservasi", value: "id_reservasi" },
        { text: 'Actions', value: 'actions' },
        
      ],
      pesanan: [],
      form: {
        jumlah_item: null,
        total_pesanan: null,
        status_pesanan: null,
        id_reservasi: null,
        
      },
      deleteId: "",
      editId: "",

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

    getBahanName(id_bahan) {
        return this.bahan.find((v) => v.id_bahan == id_bahan).nama_bahan;
    },
    
    readDataBahan() {
      this.$http
        .get(this.$api +"bahan", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.bahan = response.data.data;
        });

    },

    //read data pesanan
    readData() {
      this.$http
        .get(this.$api +"pesanan", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.pesanan = response.data.data;
        });
    },

    //simpan data pesanan
    save() {
        var data = {
            jumlah_item: this.form.jumlah_item,
            total_pesanan: this.form.total_pesanan,
            id_reservasi: this.form.id_reservasi,
            status_pesanan: this.form.status_pesanan,
            harga_menu: this.form.harga_menu,
            id_bahan: this.form.id_bahan,
        }
        this.error_message='fuck u';

      var url = this.$api + 'pesanan/';
      this.load = true;
      this.$http
        .post(url, data, {
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
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = 'red';
          this.snackbar = true;
          this.load = false;
        });
    },
    //ubah data pesanan
    update() {
      var data = {
            jumlah_item: this.form.jumlah_item,
            total_pesanan: this.form.total_pesanan,
            id_reservasi: this.form.id_reservasi,
            status_pesanan: this.form.status_pesanan,
            harga_menu: this.form.harga_menu,
            id_bahan: this.form.id_bahan,
        }
        this.error_message='';
      var url = this.$api + 'pesanan/' + this.editId;
      this.load = true;
      this.$http
        .put(url, data, {
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
    //hapus data karyawan
    deleteData() {
      //mengahapus data
      var url = this.$api + 'pesanan/' + this.deleteId;
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
    editHandler(item) {
      this.inputType = 'Ubah';
      this.editId = item.id_pesanan;
      this.form.status_pesanan = item.status_pesanan;

      this.dialog = true;
    },
    deleteHandler(id) {
      this.deleteId = id;
      this.dialogConfirm = true;
    },
    close() {
      this.dialog = false;
      this.dialogConfirm = false;
      this.inputType = 'Tambah';
    },
    cancel() {
      this.resetForm();
      this.readData();
      this.dialog = false;
      this.inputType = 'Tambah';
    },
    resetForm() {
      this.form = {
        no_meja: null,
        kapasitas_meja: null,
        status_meja: null,
      };
    },
  },
  
  computed: {

    bahanList(){
      let bahanList = [];

       this.bahan.forEach((e)=> {
        bahanList.push({
          text: e.nama_bahan,
          value: e.id_bahan,
        });
      });
      return bahanList;
    },

    formTitle() {
      return this.inputType;
    },
  },
  
  mounted() {
    this.readData();
    this.readDataBahan();
  },
};
</script>