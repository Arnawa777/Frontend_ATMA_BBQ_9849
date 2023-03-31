 <template>
  <v-main class="list">
    <h3 class="text-h3 font-weight-medium mb-5">Detail Pesanan</h3>

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
      
      <v-data-table :headers="headers" :items="detail_pesanan" :search="search">
        <template v-slot:[`item.actions`]="{ item }">

          <v-btn small class="mr-2" @click="editHandler(item)"> edit status </v-btn>
        </template>

        <template v-slot:[`item.id_menu`] ="{ item }">
            <tr>
              {{
                 getBahanName(item.id_menu)
              }}
            </tr>
        </template>


      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }} Detail Pesanan</span>
        </v-card-title>

         <v-card-text>
          <v-container>

            <v-select
              v-model="form.status_detail_pesanan"
              label="Status "
              :items="['served', 'ready to served', 'prepared']"
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
 

      headers: [
        {
            text: "ID Pesanan",
            value: "id_pesanan"
        },
        {
          text: "Kuantitas", value: "kuantitas",
        },
        { text: "Harga", value: "harga" },
        { text: "Subtotal", value: "subtotal" },
        { text: "Status", value: "status_detail_pesanan"},
        { text: "Menu", value: "id_menu" },
        { text: 'Actions', value: 'actions' },
      ],
      menu: [],
      detail_pesanan: [],
      form: {
        kuantitas: null,
        harga: null,
        subtotal: null,
        status_detail_pesanan: null,
        id_menu: null,
        
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

    getBahanName(id_menu) {
        return this.menu.find((v) => v.id_menu == id_menu).nama_menu;
    },
    

    readDataMenu() {
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

    //read data pesanan
    readData() {
      this.$http
        .get(this.$api +"detail_pesanan", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.detail_pesanan = response.data.data;
        });
    },
    

    update() {
      var data = {
            status_detail_pesanan: this.form.status_detail_pesanan,
        }
        this.error_message='';
      var url = this.$api + 'detail_pesanan/' + this.editId;
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



    editHandler(item) {
      this.inputType = 'Ubah';
      this.editId = item.id_detail_pesanan;
      this.form.status_detail_pesanan = item.status_detail_pesanan;

      this.dialog = true;
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
          value: e.id_menu,
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
    this.readDataMenu();
  },
};
</script>