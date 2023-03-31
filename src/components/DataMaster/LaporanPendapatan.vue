<template>
    <v-main>
        <h2>Laporan Pendapatan</h2>

        <v-card class="background">
            <v-flex xs12 class="text-xs-center" mt-5>
        
      </v-flex>

            <v-card-title>
                <v-row>
                    <v-col cols="5">
                        <v-select
                                  v-model="jenisLaporanSelected"
                                  :items="jenisLaporanList"
                                  label="Jenis laporan"
                                  @change="resetForm"></v-select>
                    </v-col>
                    <v-col cols="1" align="left">
                            <v-text-field v-model="tahun_mulai"
                                          label="Tahun"
                                          type="number" @wheel="$event.target.blur()"
                                          :rules="tahunRules" required></v-text-field>
                        </v-col>
                        <v-col cols="1" align="left" v-if="jenisLaporanSelected == 'Tahunan'">
                            <v-text-field v-model="tahun_selesai"
                                          label="Tahun selesai"
                                          type="number" @wheel="$event.target.blur()"
                                          :rules="tahunRules" required></v-text-field>
                        </v-col>

                        <v-col cols="4" align="right">
                            <v-btn color="blue" @click="setForm">Generate Pendapatan</v-btn>
                        </v-col>
                        <v-col v-if="canPrint" cols="2" align="right">
                            <v-btn color="blue" @click="printLaporan">Cetak Pendapatan</v-btn>
                        </v-col>
                </v-row>
            </v-card-title>
            <v-form v-model="valid" ref="form">
                <v-card-title>
                    <v-row>
                        

                        
                        
                        
                    </v-row>
                </v-card-title>
            </v-form>


            <h2>Laporan Pengeluaran</h2>
            <br>
            <br>
            <h2>Laporan </h2>

        </v-card>

        <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
            {{ error_message }}
        </v-snackbar>
    </v-main>
</template>

<script>
    import moment from 'moment';
    import 'moment/locale/id' 
    import jsPDF from 'jspdf';

    export default {

        data() {
            return {
                canAccess: false,
                valid: false,
                snackbar: false,
                error_message: '',
                color: '',
                search: null,
                dialog: false,
                dialogConfirm: false,
                editId: '',

                canPrint: false,
                headers: [],
                itemList: [],
                laporanData: new FormData,

                jenisLaporanSelected: 'Bulanan',
                jenisLaporanList: ['Bulanan', 'Tahunan'],

                tahun_mulai: new Date().toISOString().substr(0, 4),
                tahun_selesai: new Date().toISOString().substr(0, 4),
                tahunRules: [
                    (v) => !!v || "Tahun tidak boleh kosong",
                    (v) => ( v && v >= 0 ) || "Tahun tidak boleh negatif"
                ],
            };
        },
        methods: {
            setForm() {
                if(this.jenisLaporanSelected == 'Bulanan') {
                    this.generateBulanan();
                }
            },
            
            generateBulanan() {
                if (this.$refs.form.validate()) {
                    this.laporanData.append('tahun', this.tahun_mulai);

                    var url = this.$api + 'printPendapatanBulanan'
                    this.$http.post(url, this.laporanData, {
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                        }
                    }).then(response => {
                        this.error_message = response.data.message;

                        this.headers = [
                            {
                                text: "Bulan",
                                align: "start",
                                sortable: true,
                                value: "bulan"
                            },
                            { text: "Makanan", value: "makanan" },
                            { text: "Side Dish", value: "side_dish" },
                            { text: "Minuman", value: "minuman" },
                            { text: "Total Pendapatan", value: "total_pendapatan" },
                        ];
                        this.itemList = response.data.data;
                        if (this.itemList.length > 0) {
                            this.canPrint = true;
                        }
                        this.color = "blue";
                        this.snackbar = true;
                    }).catch(error => {
                        this.error_message = error.response.data.message;
                        this.color = "error";
                        this.snackbar = true;
                    })
                }
            },

            resetForm() {
                this.headers = [];
                this.itemList = [];
                this.tahun_mulai = new Date().toISOString().substr(0, 4);
                this.canPrint = false;
            },
            printLaporan() {
                var y = 24;
                var normalSpacing = 6;
                var smallSpacing = 4;
                var doc = new jsPDF();

                var logo = require('@/assets/Daebak.png');
                
                doc.addImage(logo, 'png', 25, 10, 45, 45);
                doc.setFontSize(30);
                doc.setFont("helvetica", "bold");
                doc.text("ATMA KOREAN BBQ", 130, y, null, null, "center");

                y += 8;
                doc.setFontSize(12);
                doc.setFont("helvetica", "normal");
                doc.text("FUN PLACE TO GRILL", 130, y, null, null, "center");

                y += normalSpacing;
                doc.text("Jl. Babarsari No. 43 Yogyakarta", 130, y, null, null, "center");

                y += normalSpacing;
                doc.text("552181", 130, y, null, null, "center");

                y += normalSpacing;
                doc.text("Telp. (0274) 487711", 130, y, null, null, "center");

                y += normalSpacing;
                doc.setLineWidth(0.1);
                doc.setDrawColor(0, 0, 0);
                doc.setLineDash([2.5]);
                doc.line(10, y, 200, y);

                y += normalSpacing;
                doc.setFontSize(14);
                doc.setFont("helvetica", "bold");
                doc.text("LAPORAN PENDAPATAN " + this.jenisLaporanSelected.toUpperCase(), 105, y, null, null, "center");

                var tahun = '';
                if (this.jenisLaporanSelected == 'Bulanan') {
                    tahun = this.tahun_mulai;
                }
                else {
                    tahun = this.tahun_mulai + " s/d " + this.tahun_selesai;
                }
                
                y += normalSpacing;
                doc.setFontSize(12);
                doc.setFont("helvetica", "normal");
                doc.text("TAHUN: " + tahun, 20, y);
                
                y += 5;
                doc.setLineDash([0]);
                doc.line(10, y, 200, y);
                y += 1;
                doc.line(10, y, 200, y);

                var nomor = 0;
                var i = 0;

                if (this.jenisLaporanSelected == 'Bulanan') {
                    y += 5;
                    doc.text("No", 20, y);
                    doc.text("Bulan", 30, y);
                    doc.text("Makanan", 80, y, null, null, "right");
                    doc.text("Side Dish", 120, y, null, null, "right");
                    doc.text("Minuman", 160, y, null, null, "right");
                    doc.text("Total Pendapatan", 200, y, null, null, "right");

                    y += 2;
                    doc.setLineDash([0]);
                    doc.line(10, y, 200, y);

                    doc.setFontSize(10);
                    doc.setFont("helvetica", "normal");

                    nomor = 0;
                    for (i = 0; i < this.itemList.length; i++) {
                        nomor++;
                        y += 5;
                        doc.text("" + nomor, 20, y);
                        doc.text(this.namaBulan(this.itemList[i].bulan), 30, y);
                        doc.text("Rp " + this.itemList[i].makanan, 80, y, null, null, "right");
                        doc.text("Rp " + this.itemList[i].side_dish, 120, y, null, null, "right");
                        doc.text("Rp " + this.itemList[i].minuman, 160, y, null, null, "right");
                        doc.text("Rp " + this.itemList[i].total_pendapatan, 200, y, null, null, "right");
                    }
                }
                y += 2;
                doc.setLineDash([0]);
                doc.line(10, y, 200, y);
                y += 1;
                doc.line(10, y, 200, y);

                y += 8;
                doc.setFont("helvetica", "bold");
                doc.text("Printed on " + moment(new Date()).format('DD MMMM YYYY HH:mm:ss'), 105, y, null, null, "center");

                y += smallSpacing;
                doc.setFontSize(8);
                doc.setFont("helvetica", "normal");
                doc.text("Printed by: " + localStorage.getItem('nama'), 105, y, null, null, "center");
                

                doc.autoPrint();
                const hiddFrame = document.createElement('iframe');
                hiddFrame.style.position = 'fixed';

                // "visibility: hidden" would trigger safety rules in some browsers like safari，
                // in which the iframe display in a pretty small size instead of hidden.

                hiddFrame.style.width = '1px';
                hiddFrame.style.height = '1px';
                hiddFrame.style.opacity = '0.01';
                const isSafari = /^((?!chrome|android).)*safari/i.test(window.navigator.userAgent);
                if (isSafari) {
                    // fallback in safari
                    hiddFrame.onload = () => {
                        try {
                            hiddFrame.contentWindow.document.execCommand('print', false, null);
                        } catch (e) {
                            hiddFrame.contentWindow.print();
                        }
                    };
                }
                hiddFrame.src = doc.output('bloburl');
                document.body.appendChild(hiddFrame);
            },
            namaBulan(angka) {
                return moment(angka, "M").format("MMMM")
            }
        },
        watch: {
            dialogBahan(val) {
                val || this.closeBahanDialog()
            },
        },
        computed: {
            
        },
        mounted() {
            this.checkCanAccess();
            moment.locale('id');
        },
};
</script>