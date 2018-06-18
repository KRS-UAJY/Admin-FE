'use strict';
angular.module('scotchApp')
 
.controller('KelasController', function($compile, $localStorage, $scope, DTOptionsBuilder, DTColumnBuilder) {
    $scope.message = 'Look! I am an about page.';
    $scope.$on('$routeChangeStart', function($event, next, current) { 
        hubConnection.stop();    
      });
    var vm = this;
    let hubUrl = 'http://127.0.0.1:5030/kapasitas';
    let httpConnection = new signalR.HttpConnection(hubUrl);
    let hubConnection = new signalR.HubConnection(httpConnection);
    hubConnection.start();
    hubConnection.on('UpdateKelas', data => {
        var Kuota=parseInt(document.getElementById("sisa"+data.id_kelas).innerHTML);
        if(data.val==true)
        {
            document.getElementById("sisa"+data.id_kelas).innerHTML = Kuota-1;
        }
        else
        {
            document.getElementById("sisa"+data.id_kelas).innerHTML = Kuota+1;
        }
        
      
    });
    closeDetail();
    vm.openDetail = openDetail;
    vm.dtOptions = DTOptionsBuilder
    .newOptions()
    .withOption('scrollX','100%')
    .withOption('scrollY','100%')
    .withOption('ajax', {
        headers: {
            Authorization: 'Bearer ' + $localStorage.currentUser.token
            },
        dataSrc: '',
        url: 'http://localhost:5030/api/kelas',
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
        
        DTColumnBuilder.newColumn(null).withTitle('ID Kelas')
        .renderWith(function(data, type, full, meta) {
            return '<label id="'+"kelas"+data.id_kelas+'">'+data.id_kelas+'</label>';
        }),
        DTColumnBuilder.newColumn('kelas.kode_mk').withTitle('Kode MK'),
        DTColumnBuilder.newColumn('kelas.nama_mk').withTitle('Nama MK'),
        DTColumnBuilder.newColumn('kelas.kelas').withTitle('Kelas'),
        DTColumnBuilder.newColumn(null).withTitle('Tawar')
        .renderWith(function(data, type, full, meta) {
            return '<label id="'+"tawar"+data.id_kelas+'">'+data.kapasitas_tawar+'</label>';
        }),
        DTColumnBuilder.newColumn(null).withTitle('Sisa')
        .renderWith(function(data, type, full, meta) {
            return '<label id="'+"sisa"+data.id_kelas+'">'+data.sisa+'</label>';
        }),
        DTColumnBuilder.newColumn(null).withTitle('Ubah')
        .renderWith(function(data, type, full, meta) {
            return '<button class="tooltip-hover btn btn-info" title="Cek MK Terpilih" id="mk-dipilih" ng-click=\'kelascontroller.openDetail('+JSON.stringify(data)+')\'>Ubah Penawaran Kelas<i class="fa fa-clipboard-check fa-lg"></i></button>';
        }),

    ];


    function openDetail(arg) {
        console.log(arg);
        document.getElementById("tawar_nama_mk").innerHTML=arg.kelas.nama_mk;
        document.getElementById("tawar_kode_mk").innerHTML=arg.kelas.kode_mk;
        document.getElementById("tawar_id_kelas").innerHTML=arg.kelas.id_kelas;
        var x = document.getElementById("popup-mk-dipilih");
        if (x.style.display === "none") {
            x.style.display = "block";
        } else {
            x.style.display = "none";
        }
            
    };
    function closeDetail() {
        document.getElementById("popup-mk-dipilih").style.display = "none";
    };

});

