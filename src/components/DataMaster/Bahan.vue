 <template>
  <v-main class="list">
    <h3 class="text-h3 font-weight-medium mb-5">Bahan</h3>

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
      
      <v-data-table :headers="headers" :items="bahan" :search="search">
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn small class="mr-2" @click="editHandler(item)"> edit </v-btn>
          <v-btn small @click="deleteHandler(item.id_bahan)"> delete </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }} bahan</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-text-field
              v-model="form.nama_bahan"
              label="Nama"
              :rules="[rules.required]"
              required
            ></v-text-field>

            <v-text-field
              v-model="form.ukuran_saji"
              label="Ukuran Saji"
              :rules="[rules.required]"
            ></v-text-field>
            
            <v-select
              v-model="form.unit_saji"
              label="Unit Saji"
              :rules="[rules.required]"
              :items="['gram', 'ml']"
              required
            >
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
        <v-card-text> Anda yakin ingin menghapus data bahan? </v-card-text>
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
      rules: {
          required: value => !!value || 'Required.',
          min: v => v.length >= 6 || 'Min 6 characters',
          minTelp: v => v.length >= 10 || 'Min 10 digit',
          maxTelp: v => v.length <= 13 || 'Max 13 digit',
        },

      headers: [
        {
            text: "ID",
            value: "id_bahan"
        },
        {
          text: "Nama",
          align: "start",
          sortable: true,
          value: "nama_bahan",
        },
        { text: "Ukuran Saji", value: "ukuran_saji" },
        { text: "Unit Saji", value: "unit_saji" },
        { text: 'Actions', value: 'actions' },
        
      ],

      bahan: [],
      form: {
        nama_bahan: null,
        ukuran_saji: null,
        unit_saji: null,
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

    //read data bahan
    readData() {
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

    //simpan data bahan
    save() {
      var data = {
            nama_bahan: this.form.nama_bahan,
            ukuran_saji: this.form.ukuran_saji,
            unit_saji: this.form.unit_saji,
        }
      
      
      
      var url = this.$api + "bahan";
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
    //ubah data produk
    update() {
      var newData = {
            nama_bahan: this.form.nama_bahan,
            ukuran_saji: this.form.ukuran_saji,
            unit_saji: this.form.unit_saji,
            
        }
      var url = this.$api + "bahan/" + this.editId;
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

    //hapus data bahan
    deleteData() {
      //mengahapus data
      var url = this.$api + "bahan/" + this.deleteId;
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
    editHandler(item) {
      this.inputType = "Ubah";
      this.editId = item.id_bahan;
      this.form.nama_bahan = item.nama_bahan;
      this.form.ukuran_saji = item.ukuran_saji;
      this.form.unit_saji = item.unit_saji;
      this.dialog = true;
    },
    deleteHandler(id) {
      this.deleteId = id;
      this.dialogConfirm = true;
    },
    close() {
      this.dialog = false;
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
        nama_bahan: null,
        ukuran_saji: null,
        unit_saji: null,
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