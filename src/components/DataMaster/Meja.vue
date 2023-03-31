<!-- @format -->

<template>
  <v-main class="list">
    <h3 class="text-h3 font-weight-medium mb-5">Meja</h3>

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
      <v-data-table :headers="headers" :items="meja" :search="search">
         <template v-slot:[`item.status_meja`]="{ item }">
            <v-icon v-if="item.status_meja=='1'"
            class="check mr-2"
              >mdi-check
              </v-icon>
              <v-icon v-else
              class="close mr-2"
              >mdi-close
              </v-icon>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn small class="mr-2" @click="editHandler(item)"> edit </v-btn>
          <v-btn small @click="deleteHandler(item.no_meja)"> delete </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }} Meja</span>
        </v-card-title>
        <v-card-text>
          <v-container>

            <v-text-field
              v-model="form.no_meja"
              label="Nomor Meja"
              :rules="[rules.required]"
              required
            ></v-text-field>

            <v-text-field
              v-model="form.kapasitas_meja"
              label="Kapasitas Meja"
              :rules="[rules.required]"
              required
            ></v-text-field>

            <v-select
              v-model="form.status_meja"
              label="Status Meja "
              :rules="[rules.required]"
              :items="['1', '0']"
              required
            >
            <template slot="selection" slot-scope="data">
              <span v-if="data.item==1"
              >Tersedia
              </span>
              <span v-else
              >Tidak Tersedia
              </span>
            </template>
            <template slot="item" slot-scope="data">
              <span v-if="data.item==1"
              >Tersedia
              </span>
              <span v-else
              >Tidak Tersedia
              </span>
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
        <v-card-text> Anda yakin ingin menghapus data meja? </v-card-text>
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
  name: 'List',
  data() {
    return {
      inputType: 'Tambah',
      load: false,
      snackbar: false,
      error_message: '',
      color: '',
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
        { text: 'Nomor Meja', 
          value: 'no_meja',
          sortable: true,
          align: "start",
        },
        { text: 'Kapasitas Meja', value: 'kapasitas_meja' },
        { text: 'Status Meja', value: 'status_meja' },
        { text: 'Actions', value: 'actions' },
      ],

      meja: [],
      form: {
        no_meja: null,
        kapasitas_meja: null,
        status_meja: null,
      },
      deleteId: '',
      editId: '',

      
    };
  },
  methods: {
    setForm() {
      if (this.inputType === 'Tambah') {
        this.save();
      } else {
        this.update();
      }
    },

    //read data Meja
    readData() {
      var url = this.$api + 'meja';
      this.$http
        .get(url, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        })
        .then((response) => {
          this.meja = response.data.data;
        });
    },

    //simpan data Meja
    save() {
        var data = {
            no_meja: this.form.no_meja,
            kapasitas_meja: this.form.kapasitas_meja,
            status_meja: this.form.status_meja,
        }

      var url = this.$api + 'meja/';
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
    //ubah data meja
    update() {
      var data = {
            no_meja: this.form.no_meja,
            kapasitas_meja: this.form.kapasitas_meja,
            status_meja: this.form.status_meja,
        }
        this.error_message='';
      var url = this.$api + 'meja/' + this.editId;
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
      var url = this.$api + 'meja/' + this.deleteId;
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
      this.editId = item.no_meja;
      this.form.no_meja = item.no_meja;
      this.form.kapasitas_meja = item.kapasitas_meja;
      this.form.status_meja = item.status_meja;
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
.close{color: rgb(255, 49, 49) !important;}
</style>