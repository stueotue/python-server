const prakiraan_cuaca = {
    5: "Udara Kabur",
    10: "Asap",
    45: "Kabut",
    60: "Hujan Ringan",
    61: "Hujan Sedang",
    63: "Hujan Lebat",
    80: "Hujan Lokal",
    95: "Hujan Petir",
    97: "Hujan Petir",
    100: "Cerah",
    101: "Cerah Berawan",
    102: "Ceran Berawan",
    103: "Berawan",
    104: "Berawan Tebal",
    retVal: function (code) { return this[code] }
};

const prakCuaca = Object.create(prakiraan_cuaca);

const bagian_hari_prakiraan_cuaca = {
    00: "Pagi",
    06: "Siang",
    12: "Malam",
    18: "Dini Hari",
    retVal: function (code) { return this[code]}
};

const bagian_hari = Object.create(bagian_hari_prakiraan_cuaca);

$(document).ready(function () {
    $("#jqGrid").jqGrid({
        colModel: [
            {
                label: 'No',
                name: 'No',
                width: 50,
                align: 'center'
            },
            {
                label: 'Date',
                name: 'Tanggal',
                width: 150,
                align: 'center'
            },
            {
                label: 'Magnitude',
                name: 'Magnitude',
                width: 150,
                align: 'center'
            },
            {
                label: 'Depth',
                name: 'Kedalaman',
                width: 150,
                align: 'center'
            },
            {
                label: 'Coordinate (UTM)',
                name: 'Posisi',
                width: 150,
                align: 'center'
            },
            {
                label: 'Info',
                name: 'Keterangan',
                width: 300,
                align: 'center'
            }
        ],

        viewrecords: true,
        width: 1500,
        height: 345,
        rowNum: 15,
        datatype: 'local',
        pager: "#jqGridPager",
    });

    fetchGridData();

    function fetchGridData() {

        var gridArrayData = [];
        $("#jqGrid")[0].grid.beginReq();
        $.ajax({
            url: "http://localhost:8000/api/gempa",
            success: function (result) {
                for (var i = 0; i < result.Infogempa.gempa.length; i++) {
                    var item = result.Infogempa.gempa[i];
                    gridArrayData.push({
                        No: i+1,
                        Tanggal: item.Tanggal+" "+item.Jam,
                        Magnitude: item.Magnitude,
                        Kedalaman: item.Kedalaman,
                        Posisi: item.Lintang +" - "+ item.Bujur,
                        Keterangan: item.Wilayah
                    });
                }
                $("#jqGrid").jqGrid('setGridParam', { data: gridArrayData});
                $("#jqGrid")[0].grid.endReq();
                $("#jqGrid").trigger('reloadGrid');
            }
        });
    }

});

$(document).ready(function () {
    $("#jqGrid2").jqGrid({
        colModel: [
            {
                label: 'No',
                name: 'No',
                width: 50,
                align: 'center'
            },
            {
                label: 'Date',
                name: 'Tanggal',
                width: 150,
                align: 'center'
            },
            // {
            //     label: 'Bagian Hari',
            //     name: 'bagianhari',
            //     width: 80,
            //     align: 'center'
            // },
            {
                label: 'Humidity',
                name: 'Humidity',
                width: 150,
                align: 'center'
            },
            {
                label: 'Temperature',
                name: 'Temperature',
                width: 150,
                align: 'center'
            },
            {
                label: 'Weather',
                name: 'Weather',
                width: 150,
                align: 'center'
            },
            {
                label: 'Wind Direction',
                name: 'WD',
                width: 150,
                align: 'center'
            },
            {
                label: 'Wind Speed',
                name: 'WS',
                width: 300,
                align: 'center'
            }
        ],

        viewrecords: true,
        width: 1500,
        height: 280,
        rowNum: 15,
        datatype: 'local',
        pager: "#jqGridPager2",
    });
    fetchGridData();

    function fetchGridData() {

        var gridArrayData = [];
        $("#jqGrid2")[0].grid.beginReq();
        $.ajax({
            url: "http://localhost:8000/api/cuaca",
            success: function (result) {

                var goString = JSON.stringify(result[7]);
                goString = goString.replace(/@/g,'');
                goString = goString.replace(/#/g,'');
                var result = JSON.parse(goString)
                for (var i = 0; i < 12; i++){
                    var time = result.parameter[0].timerange[i].datetime;
                    var year = time.slice(0,4);
                    var month = time.slice(4,6);
                    var day = time.slice(6,8);
                    var hour = time.slice(8,10)
                    var minute = time.slice(10,12)
                    var fulldate = day+"/"+month+"/"+year+"-"+hour+":"+minute+" WITA";
                    var wsspeed = Number(result.parameter[8].timerange[i].value[3].text);
                    gridArrayData.push({
                        No: i+1,
                        // bagianhari: bagian_hari.retVal(hour),
                        Tanggal: fulldate,
                        Humidity: result.parameter[0].timerange[i].value.text+"%",
                        Temperature: result.parameter[5].timerange[i].value[0].text+"° C",
                        Weather: prakCuaca.retVal(result.parameter[6].timerange[i].value.text),
                        WD: result.parameter[7].timerange[i].value[0].text+"° C [ "+result.parameter[7].timerange[i].value[1].text+" ]" ,
                        WS: wsspeed.toFixed(2)+" m/s"
                            });
                    

                }
                $("#jqGrid2").jqGrid('setGridParam', { data: gridArrayData});
                $("#jqGrid2")[0].grid.endReq();
                $("#jqGrid2").trigger('reloadGrid');
    
    }
    });
 }

});

// $(document).ready(function () {
//     $("#jqGrid3").jqGrid({
//         colModel: [
//             {
//                 label: 'Arah Angin',
//                 name: 'arah_dari',
//                 width: 150,
//                 align: 'center'
//             },
//             {
//                 label: 'Kec. Angin',
//                 name: 'maxminangin',
//                 width: 150,
//                 align: 'center'
//             },
//             {
//                 label: 'Cuaca',
//                 name: 'cuaca',
//                 width: 100,
//                 align: 'center'
//             },
//             {
//                 label: 'Gelombang',
//                 name: 'gelombang',
//                 width: 100,
//                 align: 'center'
//             },
//             {
//                 label: 'Hari ke-',
//                 name: 'hari',
//                 width: 60,
//                 sorttype: 'int',
//                 align: 'center'
//             },
//             {
//                 label: 'Peringatan Dini',
//                 name: 'peringatan_dini',
//                 width: 325,
//                 align: 'center'
//             },
//             {
//                 label: 'Status',
//                 name: 'status',
//                 width: 80,
//                 align: 'center'
//             },
//             {
//                 label: 'Informasi Valid (Dari > Sampai)',
//                 name: 'validasi',
//                 width: 300,
//                 align: 'center'
//             },
//         ],

//         viewrecords: true,
//         width: 1500,
//         height: 100,
//         rowNum: 15,
//         datatype: 'local',
//         pager: "#jqGridPager3",
//     });

//     fetchGridData();

//     function fetchGridData() {

//         var gridArrayData = [];
//         $("#jqGrid3")[0].grid.beginReq();
//         $.ajax({
//             url: "http://localhost:8000/api/cuaca_maritim",
//             success: function (result) {
//                 for (var i = 0; i <= 3; i++) {
//                     var item = result.xml.kategoris.kategori[i];
//                     const hey = () =>{
//                         if ((item.hari != "besok") && (item.hari != "hari_ini")){ return Number(item.hari[3])}
//                         else { return item.hari} }
//                     gridArrayData.push({
//                         arah_dari: item.angin_from +" -> "+ item.angin_to,
//                         maxminangin: item.angin_speed_min+" - "+item.angin_speed_max+" Knots",
//                         cuaca: item.cuaca,
//                         gelombang: item.gelombang_min+" - "+item.gelombang_max+" m",
//                         hari: hey(),   
//                         Posisi: item.Posisi,
//                         peringatan_dini: item.peringatan_dini,
//                         status: item.status_warning,
//                         validasi: item.valid_from+" s/d "+item.valid_to
//                     });
//                 }
//                 $("#jqGrid3").jqGrid('setGridParam', { data: gridArrayData});
//                 $("#jqGrid3")[0].grid.endReq();
//                 $("#jqGrid3").trigger('reloadGrid');
//             }
//         });
//     }

// });