<template>
  <v-card
    max-width="255"
    class="mx-auto my-12"
  >
    <v-container>
      <v-row dense>
        <v-col 
        cols="12">
          
          <v-card
            color="#385F73"
            dark
            height="150px"
            width="150px"
          >
            <v-card-title >{{ cards.no_meja }}</v-card-title>

            <v-card-subtitle v-text="cards.status_meja"></v-card-subtitle> 
          </v-card>
        </v-col>

      </v-row>
    </v-container>
  </v-card>
</template>

<script>
  export default {
    data: () => ({
        headers: [
        { text: 'Nomor Meja', 
          value: 'no_meja',
          sortable: true, },
        {  value: 'status_meja' },
      ],
      meja: [],
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
          this.meja = response.data.no_meja;
        });
    },

    mounted() {
    this.readData();
     },

    }),
  }
</script>