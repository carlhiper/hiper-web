"use strict";
app.controller("teamController", [
    "$scope", "$state", "$location", "ngAuthSettings", "$timeout", "teamService", "scoreboardService", "goalService", function($scope, $state, $location, ngAuthSettings, $timeout, teamService, scoreboardService, goalService) {
        scoreboardService.selectedTeamUser = "";
        goalService.goalTeamsSelected = [];

        $scope.joinTeam = function() {
            $location.path("/teamJoin");
        };

        $scope.createTeamBuisiness = function() {
            teamService.teamCreateType = "Business";
            $location.path("/teamCreate");
        };
        $scope.createTeamStartup = function() {
            teamService.teamCreateType = "Startup";
            $location.path("/teamCreate");
        };
        $scope.joinLater = function() {
            $state.transitionTo("home");
        };
        $scope.isAdmin = function() {
            return teamService.adminForCurrentTeam;
        };
        $scope.currentTeam = {
            userList: ""
        };
        $scope.maxMemberCount = "";
        $scope.addGoal = function() {

        };
        $scope.selectedTeams = [];
        $scope.toggleSelection = function toggleSelection(item) {
            var idx = $scope.selectedTeams.indexOf(item);

            // is currently selected
            if (idx > -1) {
                $scope.selectedTeams.splice(idx, 1);
            }
// is newly selected
            else {
                $scope.selectedTeams.push(item);

            }
            teamService.selectedTeamMembers = $scope.selectedTeams;
            goalService.goalTeamsSelected = $scope.selectedTeams;
        };


        $scope.addTeamMember = function() {};
        $scope.openScoreboard = function(userName) {
            scoreboardService.selectedTeamUser = userName;
            $state.transitionTo("home.scoreboard");
        };
        $scope.getTeamList = function() {
            teamService.getTeamById(teamService.currentTeamId).then(function(result) {
                $scope.currentTeam.userList = result.profileList;
                teamService.maxMemberCount = result.maxMemberCount;
                teamService.memberCount = $scope.currentTeam.userList.length;

                angular.forEach($scope.currentTeam.userList, function(teamMember) {
                    teamMember.picture = ngAuthSettings.apiServiceBaseUri + teamMember.picture + "?" + new Date;
                });
            });
        };
        $scope.getTeamList();

        $scope.$watch(function() {
            return teamService.teamListOperation;
        }, function() {
            if (teamService.teamListOperation) {

                $scope.getTeamList();

                $scope.selectedTeams = [];
                teamService.selectedTeamMembers = $scope.selectedTeams;
                goalService.goalTeamsSelected = $scope.selectedTeams;


            }
        });


        $scope.$watch(function() {
            return teamService.currentTeamId;
        }, function() {
            $scope.getTeamList();

        });


    }
]);