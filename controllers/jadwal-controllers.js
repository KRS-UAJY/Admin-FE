'use strict';
angular.module('scotchApp')

.controller('JadwalController', function($compile, $localStorage, $scope, DTOptionsBuilder, DTColumnBuilder) {

    var vm = this;
    vm.openDetail = openDetail;
    vm.deleteJadwal = deleteJadwal;
    vm.addJadwal = addJadwal;
    vm.editJadwal = editJadwal;
    vm.dtInstance = {};
    vm.dtOptions = DTOptionsBuilder
    .newOptions()
    .withOption('scrollX','100%')
    .withOption('scrollY','100%')
    .withOption('ajax', {
        headers: {
            Authorization: 'Bearer ' + $localStorage.currentUser.token
            },
        dataSrc: '',
        url: 'http://localhost:5010/api/schedule',
        type: 'GET',
        error: function () {
            // remove the token from localStorage and redirect to the auth state
        }
    })
      .withOption('createdRow', function(row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        })
        .withOption('headerCallback', function(header) {
            if (!vm.headerCompiled) {
                // Use this headerCompiled field to only compile header once
                vm.headerCompiled = false;
                $compile(angular.element(header).contents())($scope);
            }
        })
        .withDOM('frtip')
        .withPaginationType('full_numbers')

    vm.dtColumns = [
        
        DTColumnBuilder.newColumn(null).withTitle('ID')
        .renderWith(function(data, type, full, meta) {
            return '<label id="'+"jadwal"+data.id_jadwal+'">'+data.id_jadwal+'</label>';
        }),
        DTColumnBuilder.newColumn('id_prodi').withTitle('Prodi'),
        DTColumnBuilder.newColumn('kode_angkatan').withTitle('Angkatan'),
        DTColumnBuilder.newColumn('mulai').withTitle('Mulai'),
        DTColumnBuilder.newColumn('selesai').withTitle('Selesai'),
        DTColumnBuilder.newColumn(null).withTitle('Ubah')
        .renderWith(function(data, type, full, meta) {
            return '<button class="tooltip-hover btn btn-warning" title="Cek MK Terpilih" id="mk-dipilih" ng-click=\'jadwalcontroller.openDetail('+JSON.stringify(data)+')\'>Ubah Jadwal KRS<i class="fa fa-pencil fa-lg"></i></button>';
        }),
        DTColumnBuilder.newColumn(null).withTitle('Hapus')
        .renderWith(function(data, type, full, meta) {
            return '<button class="tooltip-hover btn btn-danger" title="Cek MK Terpilih" id="mk-dipilih" ng-click=\'jadwalcontroller.deleteJadwal('+JSON.stringify(data)+')\'>Hapus Jadwal KRS<i class="fa fa-pencil fa-lg"></i></button>';
        }),
    ];

    function openDetail(arg) {
        console.log(arg);
        
        document.getElementById("edit_tanggal_mulai").valueAsDate = new Date(arg.mulai);
        document.getElementById("edit_tanggal_selesai").valueAsDate = new Date(arg.selesai);
        var dmulai = new Date(arg.mulai),        
        hmulai = dmulai.getHours(),
        mmulai = dmulai.getMinutes();
        if(hmulai==0)
        {
            document.getElementById("edit_waktu_mulai").value = '00'+':'+mmulai;
        }
        if(mmulai==0)
        {
            document.getElementById("edit_waktu_mulai").value = hmulai+':'+'00';
        }
        if(mmulai==0&&hmulai==0)
        {
            document.getElementById("edit_waktu_mulai").value = '00'+':'+'00';
        }
        if(mmulai!=0&&hmulai!=0)
        {
            document.getElementById("edit_waktu_mulai").value = hmulai+':'+mmulai;
        }
        var dselesai = new Date(arg.selesai),        
        hselesai = dselesai.getHours(),
        mselesai = dselesai.getMinutes();
        if(hmulai==0)
        {
            document.getElementById("edit_waktu_selesai").value = '00'+':'+mselesai;
        }
        if(mmulai==0)
        {
            document.getElementById("edit_waktu_selesai").value = hselesai+':'+'00';
        }
        if(mselesai==0&&hselesai==0)
        {
            document.getElementById("edit_waktu_selesai").value = '00'+':'+'00';
        }
        if(mselesai!=0&&hselesai!=0)
        {
            document.getElementById("edit_waktu_selesai").value = hselesai+':'+mselesai;
        }
        document.getElementById("edit_angkatan").value=arg.kode_angkatan;
        document.getElementById("edit_prodi").value=arg.id_prodi;
        document.getElementById("edit_kesempatan").value = arg.kesempatan;
        document.getElementById("id_edit").value = arg.id_jadwal;
        var x = document.getElementById("popup-edit-tgl");
        if (x.style.display === "none") {
            x.style.display = "block";
        } else {
            x.style.display = "none";
        }
            
    };
    function deleteJadwal(arg) {
        console.log(arg);
        swal({
            title: "Konfirmasi",
            text: "Apakah anda yakin ingin menghapus jadwal ini ?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                var store = JSON.parse(localStorage.getItem('ngStorage-currentUser'));
                console.log(store.token)
                let axiosConfig = {
                            headers: {
                                'Content-Type': 'application/json;charset=UTF-8',
                                "Authorization" : "Bearer "+store.token,
                                "Access-Control-Allow-Origin": "*",
                            }
                          };
                         axios.delete('http://127.0.0.1:5010/api/schedule/'+arg.id_jadwal, axiosConfig)  
                         .then((result) => {
                         console.log("RESPONSE RECEIVED: ", result);
                         document.getElementById("popup-add-tgl").style.display = "none";
                         vm.dtInstance.reloadData();
                         swal("Hapus Jadwal Berhasil !", {
                            icon: "success",
                         });
                           

              });
            } else {
              swal("Hapus Jadwal Dibatalkan");
            }
          });
            
    };

    function addJadwal() {
    
        var tanggal_mulai=document.getElementById("add_tanggal_mulai").value;
        var waktu_mulai=document.getElementById("add_waktu_mulai").value;
        var tanggal_selesai=document.getElementById("add_tanggal_selesai").value;
        var waktu_selesai=document.getElementById("add_waktu_selesai").value;
        var angkatan=document.getElementById("add_angkatan").value;
        var prodi=document.getElementById("add_prodi").value;
        var kesempatan=document.getElementById("add_kesempatan").value;
        
        var kapasitas_kelas=10; 
        let data = {
        "mulai": tanggal_mulai+" "+waktu_mulai,
        "selesai": tanggal_selesai+" "+waktu_selesai,
        "kode_angkatan": angkatan,
        "id_prodi": prodi,
        "kesempatan": kesempatan
    }
        console.log(data);
        var store = JSON.parse(localStorage.getItem('ngStorage-currentUser'));
        let axiosConfig = {
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8',
                        "Authorization" : "Bearer "+store.token,
                        "Access-Control-Allow-Origin": "*",
                    }
                  };
                 axios.post('http://127.0.0.1:5010/api/schedule', data, axiosConfig)  
                 .then((result) => {
                 console.log("RESPONSE RECEIVED: ", result);
                 document.getElementById("popup-add-tgl").style.display = "none";
                 swal("Berhasil", "Jadwal Ditambah", "success");
                 vm.dtInstance.reloadData();
                 });
                 
    };
    
    function editJadwal() {
        
        var id_jadwal=document.getElementById("id_edit").value;
        var tanggal_mulai=document.getElementById("edit_tanggal_mulai").value;
        var waktu_mulai=document.getElementById("edit_waktu_mulai").value;
        var tanggal_selesai=document.getElementById("edit_tanggal_selesai").value;
        var waktu_selesai=document.getElementById("edit_waktu_selesai").value;
        var angkatan=document.getElementById("edit_angkatan").value;
        var prodi=document.getElementById("edit_prodi").value;
        var kesempatan=document.getElementById("edit_kesempatan").value;
        
        var kapasitas_kelas=10; 
        let data = {
        "id_jadwal": id_jadwal,
        "mulai": tanggal_mulai+" "+waktu_mulai,
        "selesai": tanggal_selesai+" "+waktu_selesai,
        "kode_angkatan": angkatan,
        "id_prodi": prodi,
        "kesempatan": kesempatan
    }
        console.log(data);
        var store = JSON.parse(localStorage.getItem('ngStorage-currentUser'));
        let axiosConfig = {
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8',
                        "Authorization" : "Bearer "+store.token,
                        "Access-Control-Allow-Origin": "*",
                    }
                  };
                 axios.put('http://127.0.0.1:5010/api/schedule', data, axiosConfig)  
                 .then((result) => {
                 console.log("RESPONSE RECEIVED: ", result);
                 document.getElementById("popup-edit-tgl").style.display = "none";
                 swal("Berhasil", "Jadwal Diubah", "success");
                 vm.dtInstance.reloadData();
                 });                 
    };

});

