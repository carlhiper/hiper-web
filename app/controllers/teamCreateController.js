"use strict";
app.controller("teamCreateController", [
    "$scope", "$location", "$timeout", "teamService", function($scope, $location, $timeout, teamService) {

        $scope.savedSuccessfully = false;
        $scope.message = "";

        $scope.creating = {
            teamName: "",
            companyName: "",
            organisationNumber: "",
            billingAddress: "",
            emails: [""],
            password: "",
            teamTypeCode: teamService.teamCreateType
        };

        $scope.teamCreateType = teamService.teamCreateType;

        $scope.removeTeamMembers = function(i) {
            $scope.creating.emails.splice(i, 1);
        };
        $scope.createTeam = function() {

            teamService.createTeam($scope.creating).then(function(response) {

                    $scope.savedSuccessfully = true;
                    $scope.message = "";
                    teamService.currentTeamId = response.teamid;
                    $location.path("/home/team");


                },
                function(response) {
                    var errors = [];
                    for (var key in response.data.modelState) {
                        for (var i = 0; i < response.data.modelState[key].length; i++) {
                            errors.push(response.data.modelState[key][i]);
                        }
                    }
                    $scope.message = "Failed to create team due to:" + errors.join(" ");
                });
        };


    }
]);