 <template>
  <v-main class="list">
    <h3 class="text-h3 font-weight-medium mb-5">Karyawan</h3>

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
      <v-data-table :headers="headers" :items="karyawan" :search="search">
        <template v-slot:[`item.status_akun`]="{ item }">
            <v-icon v-if="item.status_akun=='1'"
              class="check mr-2"
              >mdi-account-check
              </v-icon>
              <v-icon v-else
              class="cancel mr-2"
              >mdi-account-cancel
              </v-icon>
        </template>







        <template v-slot:[`item.actions`]="{ item }">
          <v-btn small class="mr-2" @click="editHandler(item)"> edit </v-btn>
          <v-btn small @click="deleteHandler(item.id_karyawan)"> Inactive </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }} Karyawan</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-text-field
              v-model="form.nama_karyawan"
              label="Nama"
              :rules="[rules.required]"
              required
            ></v-text-field>

            <v-select
              v-model="form.role_karyawan"
              label="Role"
              :rules="[rules.required]"
              :items="['Owner', 'Operational Manager', 'Waiter', 'Cashier', 'Chef']"
              required
            ></v-select>

            <v-select
              v-model="form.jenis_kelamin"
              label="Gender"
              :rules="[rules.required]"
              :items="['Pria', 'Wanita']"
              required
            ></v-select>

            <v-text-field
              v-model="form.email_karyawan"
              label="Email"
              :rules="[rules.required]"
              required
            ></v-text-field>

            <v-text-field
              v-model="form.telp_karyawan"
              label="No. Telepon"
              :rules="[rules.required, rules.minTelp, rules.maxTelp]"
              required
            ></v-text-field>

            <v-select
              v-model="form.status_akun"
              label="Status Akun"
              v-if="inputType!='Tambah'"
              :items="['1', '0']"
              required
            >
            <template slot="selection" slot-scope="data">
              <span v-if="data.item==1"
              >Aktif
              </span>
              <span v-else
              >Non Aktif
              </span>
            </template>
            <template slot="item" slot-scope="data">
              <span v-if="data.item==1"
              >Aktif
              </span>
              <span v-else
              >Non Aktif
              </span>
            </template>
            </v-select>

            <v-text-field 
              v-if="inputType=='Tambah'"
              v-model="form.password"
              label="Password"
              :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[rules.required, rules.min]"
              :type="show ? 'text' : 'password'"
              min="6"
              required
              @click:append="show = !show"
            ></v-text-field>

          
      <v-dialog
        ref="dialog"
        v-model="modal"
        :return-value.sync="date"
        persistent
        width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="date"
            label="Tanggal Bergabung"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="date"
          scrollable
        >
          <v-spacer></v-spacer>
          <v-btn
            text
            color="primary"
            @click="modal = false"
          >
            Cancel
          </v-btn>
          
          <v-btn
            text
            color="primary"
            @click="$refs.dialog.save(date)"
          >
            OK
          </v-btn>
        </v-date-picker>
      </v-dialog>

            

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
        <v-card-text> Anda yakin ingin menonaktifkan data Karyawan? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogConfirm = false">
            Cancel
          </v-btn>
          <v-btn color="blue darken-1" text @click="deleteData"> Inactive </v-btn>
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
      show: false,
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
            value: "id_karyawan"
        },
        {
          text: "Nama",
          align: "start",
          sortable: true,
          value: "nama_karyawan",
        },
        { text: "Role", value: "role_karyawan" },
        { text: "Gender", value: "jenis_kelamin" },
        { text: "Email", value: "email_karyawan" },
        { text: "No. Telepon", value: "telp_karyawan"},
        { text: "Status Akun", value: "status_akun"},
        { text: "Tanggal Bergabung", value: "tanggal_bergabung" },
        { text: 'Actions', value: 'actions' },
        
      ],

      karyawan: [],
      form: {
        nama_karyawan: null,
        role_karyawan: null,
        jenis_kelamin: null,
        email_karyawan: null,
        status_akun: null,
        telp_karyawan: null,
        tanggal_bergabung: null,
      },
      deleteId: "",
      editId: "",

      date: new Date().toISOString().substr(0, 10),
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
    //read data karyawan
    readData() {
      this.$http
        .get(this.$api +"karyawan", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.karyawan = response.data.data;
        });
    },

    //simpan data karyawan
    save() {
      var data = {
            nama_karyawan: this.form.nama_karyawan,
            role_karyawan: this.form.role_karyawan,
            jenis_kelamin: this.form.jenis_kelamin,
            email_karyawan: this.form.email_karyawan,
            telp_karyawan: this.form.telp_karyawan,
            status_akun: 1,
            password: this.form.password,
            tanggal_bergabung: this.date,
        }
      
      var url = this.$api + "karyawan";
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
            nama_karyawan: this.form.nama_karyawan,
            role_karyawan: this.form.role_karyawan,
            jenis_kelamin: this.form.jenis_kelamin,
            email_karyawan: this.form.email_karyawan,
            telp_karyawan: this.form.telp_karyawan,
            status_akun: this.form.status_akun,
            tanggal_bergabung: this.date,
            
        }
      var url = this.$api + "karyawan/" + this.editId;
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

    //hapus data karyawan
    deleteData() {
      //mengahapus data
      var url = this.$api + "karyawan/" + this.deleteId;
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
      this.editId = item.id_karyawan;
      this.form.nama_karyawan = item.nama_karyawan;
      this.form.role_karyawan = item.role_karyawan;
      this.form.email_karyawan = item.email_karyawan;
      this.form.jenis_kelamin = item.jenis_kelamin;
      this.form.status_akun = item.status_akun;
      this.form.telp_karyawan = item.telp_karyawan;
      this.date = item.tanggal_bergabung;
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
        nama_karyawan: null,
        role_karyawan: null,
        jenis_kelamin: null,
        email_karyawan: null,
      };     
      this.date = null;
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

<style scoped>
.check{color: rgb(28, 255, 77) !important;}
.cancel{color: rgb(255, 49, 49) !important;}
</style>