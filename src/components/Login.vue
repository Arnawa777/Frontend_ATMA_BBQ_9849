<!--@format -->

<template>
  <main>
    <v-container fluid fill-height class="posisinya">
      <v-layout flex align-center justify-center>
        <v-flex xs12 sm3 elevation-6>
          <v-toolbar class="grey darken-3">
            <v-toolbar-title class="grey--text">
              <h1>Silahkan Login</h1>
            </v-toolbar-title>
          </v-toolbar>

          <v-card loading
                  shaped>

            <v-card-text class="pt-4">
              <div>
                <v-form v-model="valid" ref="form">
                  <v-text-field
                    label="Email"
                    :rules="[rules.required]"
                    v-model="email"
                    filled
                    rounded
                    dense
                  ></v-text-field>

                  <v-text-field
                    :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                    label="Password"
                    :rules="[rules.required, rules.min]"
                    :type="show ? 'text' : 'password'"
                    v-model="password"
                    min="6"
                    filled
                    rounded
                    dense
                    required
                    @click:append="show = !show"
                  ></v-text-field>
                  <v-layout justify-end>
                    <v-btn
                      rounded
                      class="mr-2"
                      @click="submit"
                      :class="{
                        'grey darken-1 white--text': valid,
                        disabled: !valid,
                      }"
                      >Login</v-btn
                    >
                    <v-btn @click="clear" class="grey darken-3 white--text"
                      >Clear</v-btn
                    >
                  </v-layout>
                </v-form>
              </div>
            </v-card-text>
          </v-card>
          <v-snackbar vmodel="snackbar" :color="color" timeout="2000" bottom>
            {{ error_message }}
          </v-snackbar>
        </v-flex>
      </v-layout>
    </v-container>
    <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
    {{error_message}}
     </v-snackbar>
  </main>
</template>

 <style>
@import url("https://fonts.googleapis.com/css?family=Jolly%20Lodger");
.grey--text {
  font-family: "";
}
.posisinya {
  position: absolute;
  top: 20px;
  left: 0px;
  right: 0px;
}
</style>

 <script>
export default {
  name: "Login",
  data() {
    return {
      load: false,
      snackbar: false,
      error_message: "",
      show: false,
      color: "",
      valid: false,
      rules: {
          required: value => !!value || 'Required.',
          min: v => v.length >= 6 || 'Min 6 characters',
        },
     
    };
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        //cek apakah data yang akan dikirim sudah valid
        this.load = true;
        this.$http
          .post(this.$api +"login", {
            email_karyawan: this.email,
            password: this.password,
          })
          .then((response) => {
            //menyimpan id user yang sedang login
            localStorage.setItem("id", response.data.karyawan.id_karyawan);
            //menyimpan role user yang sedang login
            localStorage.setItem("role", response.data.karyawan.role_karyawan);
            //menyimpan auth token
            localStorage.setItem("token", response.data.access_token);
            this.color = "green";
            this.snackbar = true;
            this.load = false;


            this.$router.push({
              name: "Dashboard",

              
            });
          })
          .catch((error) => {
            if(error.response.data.message.email_karyawan)
            this.error_message = error.response.data.message.email_karyawan+"";
            if(error.response.data.message.password)
            this.error_message = error.response.data.message.password+"";
            this.error_message = error.response.data.message;
            if(error.response.data.message.status_akun)
            this.error_message = error.response.data.message.status_akun+"";
            this.color = "red";
            this.snackbar = true;
            localStorage.removeItem("token");
            this.load = false;
          });
      }
    },
    clear() {
      this.$refs.form.reset(); //Clear form login
    },
  },
};
</script> 