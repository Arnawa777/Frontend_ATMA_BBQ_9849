 <template>
  <v-main class="list">
    <h3 class="text-h3 font-weight-medium mb-5">Laporan Stok</h3>

    <br>  
    <v-flex xs12 class="text-xs-center" mt-5>
        <h3>Laporan Stok Bahan ALL ITEM </h3>  <br><v-btn small class="mr-2" color="blue" dark @click="dialog = true"> Print </v-btn>
      </v-flex>

    <v-flex xs12 class="text-xs-center" mt-5>
        <h3>Laporan Stok Bahan Per ITEM </h3>  <br><v-btn small class="mr-2" color="blue" dark @click="dialog = true"> Print </v-btn>
      </v-flex>

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
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="form.start"
                  label="Tanggal Awal"
                  required
                  persistent-hint
                  prepend-icon="mdi-calendar"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="form.start"
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
                  @click="$refs.menu.save(form.start)"
                >
                  Save
                </v-btn></v-date-picker
              >
            </v-menu>

            <v-menu
              ref="menu2"
              v-model="menu2"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="form.end"
                  label="Tanggal Akhir"
                  required
                  persistent-hint
                  prepend-icon="mdi-calendar"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="form.end"
                no-title
                scrollable
              >
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="menu2 = false">
                  Cancel
                </v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="$refs.menu2.save(form.end)"
                >
                  Save
                </v-btn></v-date-picker
              >
            </v-menu>
            


          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancel"> Cancel </v-btn>
          <v-btn color="blue darken-1" text @click="setForm"> Print </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
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
      
      menu: false,
      menu2: false,
      dialogConfirm: false,
      rules: {
          required: value => !!value || 'Required.',
          min: v => v.length >= 6 || 'Min 6 characters',
          minTelp: v => v.length >= 10 || 'Min 10 digit',
          maxTelp: v => v.length <= 13 || 'Max 13 digit',
        },

      form: {
        start: null,
        end: null,
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

    //simpan data customer
    save() {
      
      var url = this.$api + "printStok";
      this.load = true;
      this.$http
        .post(url, {
            start: this.form.start,
            end: this.form.end,        
        }, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          responseType: 'blob',
        })
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'file.pdf');
            document.body.appendChild(link);
            link.click();
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
      this.editId = item.id_customer;
      this.form.nama_customer = item.nama_customer;
      this.form.telp_customer = item.telp_customer;
      this.form.email_customer = item.email_customer;
      this.dialog = true;
    },
    deleteHandler(id) {
      this.deleteId = id;
      this.dialogConfirm = true;
    },
    close() {
      this.dialog = false;
    },
    cancel() {
      this.resetForm();
      this.readData();
      this.dialog = false;
    },
    resetForm() {
      this.form = {
        nama_customer: null,
        telp_customer: null,
        email_customer: null,
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