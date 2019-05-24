"use strict";
app.controller("indexController", [
    "$scope", "$state", "$location", "authService", "localeService", function($scope, $state, $location, authService, localeService) {


        $scope.logOut = function() {
            authService.logOut();
            $location.path("/login");
        };
        $scope.checkWhiteBackState = function() {
            return $state.includes("teamCreateJoin") || $state.includes("teamCreate") || $state.includes("teamJoin") || $state.includes("signup") || $state.includes("login") || $state.includes("confirmation");
        };
        $scope.isActiveHeader = function(viewLocation) {
            var s = false;
            if ($location.path().indexOf(viewLocation) != -1) {
                s = true;
            }
            return s;
        };
        $scope.authentication = authService.authentication;

    }
]);