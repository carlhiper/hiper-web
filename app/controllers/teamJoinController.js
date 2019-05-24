"use strict";
app.controller("teamJoinController", [
    "$scope", "$location", "$timeout", "teamService", function($scope, $location, $timeout, teamService) {

        $scope.savedSuccessfully = false;
        $scope.message = "";


        $scope.join = {
            teamName: "",
            password: "",
            adminEmail: ""
        };
        $scope.joinTeam = function() {

            teamService.joinTeam($scope.join).then(function(response) {


                    $scope.savedSuccessfully = true;
                    $scope.message = "Your application has been sent";
                    startTimer();


                },
                function(response) {
                    var errors = [];
                    for (var key in response.data.modelState) {
                        for (var i = 0; i < response.data.modelState[key].length; i++) {
                            errors.push(response.data.modelState[key][i]);
                        }
                    }
                    $scope.message = "Failed to join team due to:" + errors.join(" ");
                });
        };
        var startTimer = function() {
            var timer = $timeout(function() {
                $timeout.cancel(timer);
                $location.path("/home/team");
            }, 2000);
        };
    }
]);