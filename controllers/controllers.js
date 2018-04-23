'use strict';
angular.module('scotchApp')
    // create the controller and inject Angular's $scope
    .controller('mainController', function($scope) {
        // create a message to display in our view
        $scope.message = 'Everyone come and see how good I look!';
        var self = this;
        self.Login = Login;
        

        function Login() {
            console.log('Login');
        }
    })

.controller('TablesController', function($compile, $scope, DTOptionsBuilder, DTColumnBuilder) {
    $scope.message = 'Look! I am an about page.';
    var vm = this;
    var table = $('#tabel').DataTable();
    let hubUrl = 'http://localhost:5001/kapasitas';
    let httpConnection = new signalR.HttpConnection(hubUrl);
    let hubConnection = new signalR.HubConnection(httpConnection);
    hubConnection.start();
    vm.selected = {};
    vm.selectAll = false;
    vm.toggleOne = toggleOne;
    vm.dtOptions = DTOptionsBuilder
    .newOptions()
    .withOption('scrollX','100%')
    .withOption('scrollY','100%')
    .withOption('ajax', {
        headers: {
            Authorization: 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMTAxMTM3NTUiLCJqdGkiOiIzZmM3ZmEwNC05YjBlLTQ2ZjAtYmVkMS00NjU3OTQ2ZGJkYmEiLCJuYmYiOjE1MTg5Mzg2MDcsImV4cCI6MTUxODk0OTQwNywiaXNzIjoiQXV0aC5TZXJ2aWNlcyIsImF1ZCI6IktSUyBTZXJ2aWNlcyJ9.SurWFX7jlkOSDH8Orwl0X07ly4L4-pQtPUfffznMyMA'
            },
        dataSrc: '',
        url: 'http://localhost:5003/api/kelas/02',
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
        // Active Buttons extension
        // .withButtons([
        //     'columnsToggle',
        //     'colvis',
        //     'copy',
        //     'print',
        //     'excel',
        //     'pdf',
        //     {
        //         text: 'Some button',
        //         key: '1',
        //         action: function(e, dt, node, config) {
        //             alert('Button activated');
        //         }
        //     }
        // ]);
    vm.dtColumns = [
        
        
        DTColumnBuilder.newColumn('kelas.kode_mk').withTitle('KODE'),
        DTColumnBuilder.newColumn('kelas.nama_mk').withTitle('MK'),
        DTColumnBuilder.newColumn('kelas.kelas').withTitle('Kelas'),
        DTColumnBuilder.newColumn('kelas.dosen1.nama_dosen').withTitle('Dosen'),
        DTColumnBuilder.newColumn('kelas.sks').withTitle('SKS'),
        DTColumnBuilder.newColumn('kelas').withTitle('Kuota')
        .renderWith(function(kelas, type, full, meta) {
            return '<label id="'+kelas.id_kelas+'">'+kelas.kapasitas_kelas+'</label>';
        }),
        DTColumnBuilder.newColumn('kelas.id_kelas').withTitle('Pilih').notSortable()
            .renderWith(function(data, type, full, meta) {
                vm.selected[full.id] = false;
                return '<label class="switch"><input id="P'+data+'" type="checkbox" ng-model="tables.selected[' + data + ']" ng-click="tables.toggleOne(' + data + ')"><span class="slider round"></span></label>';
            })
    ];
    hubConnection.on('UpdateKelas', data => {
        console.log(data);
        var Kuota=parseInt(document.getElementById(data.id_kelas).innerHTML);
        if(data.val==true)
        {
            document.getElementById(data.id_kelas).innerHTML = Kuota-1;
        }
        else
        {
            document.getElementById(data.id_kelas).innerHTML = Kuota+1;
        }
        
      
    });
    function toggleOne (selectedItems) {
        console.log(selectedItems);
        if(document.getElementById('P'+selectedItems).checked){
            console.log('checked');
            hubConnection.invoke('UpdateKapasitas',selectedItems,true);
        }
        else
        {
            console.log('Unchecked');
            hubConnection.invoke('UpdateKapasitas',selectedItems,false);
        }
        
    }
    
    
        
    

});

// .controller('contactController', function($scope) {
// 	$scope.message = 'Contact us! JK. This is just a demo.';
// })