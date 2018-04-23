(function () {
    'use strict';

    angular
        .module('scotchApp')
        .controller('LoginController', Controller);

    function Controller($location, AuthenticationService) {
        var vm = this;

        vm.login = login;

        initController();

        function initController() {
            // reset login status
            AuthenticationService.Logout();
        };

        function login() {
            vm.loading = true;
            
            console.log('Sudah Login');

            AuthenticationService.Login(vm.username, vm.password, function (result) {

                console.log(result);
                if (result === true) {
                    $location.path('/dashboard');
                } else {
                    vm.error = 'Username or password is incorrect';
                    vm.loading = false;
                }
            });
        };
    }

})();