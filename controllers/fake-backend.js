(function () {
    'use strict';

    angular
        .module('scotchApp')
        .run(setupFakeBackend);

    // setup fake backend for backend-less development
    function setupFakeBackend($httpBackend) {
        // pass through any urls not handled above so static files are served correctly
        $httpBackend.whenGET(/^\w+.*/).passThrough();
    }
})();