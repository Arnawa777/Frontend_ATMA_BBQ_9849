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
      
      <v-data-table :headers="headers" :items="menu" :search="search">
        
        <template v-slot:[`item.actions`]="{ item }" 
                
                 >

  <!--  -->

          <v-btn small class="mr-2" @click="editHandler(item)"> edit </v-btn>
          <v-btn small @click="deleteHandler(item.id_menu)"> delete </v-btn>
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
          <span class="headline">{{ formTitle }} menu</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-text-field
              v-model="form.nama_menu"
              label="Nama"
              :rules="[rules.required]"
              required
            ></v-text-field>

            
            <v-select
              v-model="form.kategori_menu"
              label="Kategori "
              :rules="[rules.required]"
              :items="['Utama', 'Side Dish', 'Minuman']"
              required
            >
            </v-select>

            <v-text-field
              v-model="form.deskripsi_menu"
              label="Deskripsi"
              :rules="[rules.required]"
              required
            ></v-text-field>


            <v-select
              v-model="form.unit_menu"
              label="Unit "
              :rules="[rules.required]"
              :items="['Plate', 'Bowl', 'Mini Bowl', 'Bottle', 'Glass']"
              required
            >
            </v-select>
            

            <v-text-field
              v-model="form.harga_menu"
              label="Harga"
              :rules="[rules.required]"
            ></v-text-field>

            <v-select
              v-model="form.id_bahan"
              label="Bahan "
              :rules="[rules.required]"
              :items="bahanList"
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
        <v-card-text> Anda yakin ingin menghapus data menu? </v-card-text>
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
        },

      headers: [
        {
            text: "ID",
            value: "id_menu"
        },
        {
          text: "Nama",
          align: "start",
          sortable: true,
          value: "nama_menu",
        },
        { text: "Kategori", value: "kategori_menu" },
        { text: "Deskripsi", value: "deskripsi_menu" },
        { text: "Unit", value: "unit_menu" },
        { text: "Harga", value: "harga_menu" },
        { text: "Bahan", value: "id_bahan"},
        { text: 'Actions', value: 'actions' },
        
      ],
      bahan:[],
      menu: [],
      form: {
        nama_menu: null,
        kategori_menu: null,
        deskripsi_menu: null,
        unit_menu: null,
        harga_menu: null,
        id_bahan: null,
        
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

    //read data menu
    readData() {
      this.$http
        .get(this.$api +"menu", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.menu = response.data.data;
        });
    },

    //simpan data menu
    save() {
        var data = {
            nama_menu: this.form.nama_menu,
            kategori_menu: this.form.kategori_menu,
            deskripsi_menu: this.form.deskripsi_menu,
            unit_menu: this.form.unit_menu,
            harga_menu: this.form.harga_menu,
            id_bahan: this.form.id_bahan,
        }
        this.error_message='Nothing here';

      var url = this.$api + 'menu/';
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
    //ubah data menu
    update() {
      var data = {
            nama_menu: this.form.nama_menu,
            kategori_menu: this.form.kategori_menu,
            deskripsi_menu: this.form.deskripsi_menu,
            unit_menu: this.form.unit_menu,
            harga_menu: this.form.harga_menu,
            id_bahan: this.form.id_bahan,
        }
        this.error_message='';
      var url = this.$api + 'menu/' + this.editId;
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
      var url = this.$api + 'menu/' + this.deleteId;
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
      this.editId = item.id_menu;
      this.form.nama_menu = item.nama_menu;
      this.form.kategori_menu = item.kategori_menu;
      this.form.deskripsi_menu = item.deskripsi_menu;
      this.form.unit_menu = item.unit_menu;
      this.form.harga_menu = item.harga_menu;
      this.form.id_bahan = item.id_bahan;

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