"use strict";
app.controller("scoreboardController", [
    "$scope", "$state", "$location", "ngAuthSettings", "$timeout", "$interval", "scoreboardService", "authService", "goalService", "teamService", "feedService", function($scope, $state, $location, ngAuthSettings, $timeout, $interval, scoreboardService, authService, goalService, teamService, feedService) {
        $scope.achivedGoals = 0;
        $scope.notAchivedGoals = "";
        $scope.canceledGoals = "";
        $scope.hadEnTime = "";
        $scope.hadEnResource = "";
        $scope.hadEnSupport = "";
        $scope.hadRightSkills = "";
        $scope.ratio = "";

        goalService.goalSelected = "";
        goalService.teamGoal = false;
        $scope.hipe = function(goalId, isHiped) {
            if (!isHiped) {
                scoreboardService.hipeGoal(goalId).then(function(response) {
                    for (var i = 0; i < $scope.goals.length; i++) {
                        if ($scope.goals[i].goalId == goalId) {
                            $scope.goals[i].hipes = $scope.goals[i].hipes + 1;
                            $scope.goals[i].isHiped = true;
                        }
                    }
                    for (var i = 0; i < $scope.adminGoals.length; i++) {
                        if ($scope.adminGoals[i].goalId == goalId) {
                            $scope.adminGoals[i].hipes = $scope.adminGoals[i].hipes + 1;
                            $scope.adminGoals[i].isHiped = true;
                        }
                    }
                });
            }
        };

        $scope.applyFilter = function() {
            if ($state.includes("home.scoreboardHistory")) {
                while (feedService.checkFilterLastFirstEquals(feedService.feedFilter)) {
                    if (feedService.feedFilter.firstLoad) {
                        feedService.feedFilter.firstLoad = false;
                        console.log("from controller FIRST LOAD");

                    }
                    feedService.sendFilterHistory(feedService.feedFilter).then(function(response) {
                        if (feedService.checkFilterLastFirstEquals(feedService.feedFilter)) {
                            console.log("from controller after receive filter not stable");
                            $scope.applyFilter();
                        } else {
                            $scope.goals = response;
                            feedService.isFilterSended = false;

                            console.log("from controller after receive filter stable");
                            console.log(feedService.isFilterSended);
                        }

                    });
                }
            }
            if ($state.includes("home.scoreboardStatistics")) {
                while (feedService.checkFilterLastFirstEquals(feedService.feedFilter)) {
                    if (feedService.feedFilter.firstLoad) {
                        feedService.feedFilter.firstLoad = false;
                        console.log("from controller FIRST LOAD");

                    }
                    feedService.sendFilterStatistics(feedService.feedFilter).then(function(response) {
                        if (feedService.checkFilterLastFirstEquals(feedService.feedFilter)) {
                            console.log("from controller after receive filter not stable");
                            $scope.applyFilter();
                        } else {

                            $scope.achivedGoals = response.achivedGoals;


                            $scope.notAchivedGoals = response.notAchivedGoals;

                            $scope.canceledGoals = response.canceledGoals;
                            $scope.hadEnTime = response.hadEnTime;
                            $scope.hadEnResource = response.hadEnResource;
                            $scope.hadEnSupport = response.hadEnSupport;
                            $scope.hadRightSkills = response.hadRightSkills;
                            $scope.ratio = response.ratio;
                            $scope.piePoints = [{ "ACHIEVED GOALS:": $scope.achivedGoals, "NOT ACHIEVED GOALS:": $scope.notAchivedGoals, "CANCELLED:": $scope.canceledGoals }];


                            feedService.isFilterSended = false;

                            console.log("from controller after receive filter stable");
                            console.log(feedService.isFilterSended);
                        }

                    });
                }
            }


        };

        $scope.firstLoad = function() {
            feedService.feedFilter.firstLoad = true;
            $scope.applyFilter();


        };

        $scope.getGoalsForPie = function() {


            $scope.piePoints = [{ "ACHIEVED GOALS:": 30, "NOT ACHIEVED GOALS:": 30, "CANCELLED:": 30 }];
            $scope.pieColumns = [
                { "id": "ACHIEVED GOALS:", "type": "pie", "color": "#ff7562" },
                { "id": "NOT ACHIEVED GOALS:", "type": "pie", "color": "#959595" },
                { "id": "CANCELLED:", "type": "pie", "color": "#fff" }
            ];

            $scope.handleCallback = function(chartObj) {
                $scope.theChart = chartObj;
            };

            $scope.legendIsShown = true;
            $scope.toggleLegend = function() {
                if ($scope.legendIsShown) {
                    $scope.theChart.legend.hide();
                } else {
                    $scope.theChart.legend.show();
                }
                $scope.legendIsShown = !$scope.legendIsShown;
                $scope.theChart.flush();
            };

            $scope.clicked = {};
            $scope.showClick = function(data) {
                $scope.clicked = data;
            };

            $scope.formatDonut = function(value, ratio, id) {
                return d3.format("$")(value);
            };
        };

        $scope.goals = [];
        $scope.adminGoals = [];
        $scope.loadGoals = function() {

            if (scoreboardService.selectedTeamUser == "")
                scoreboardService.selectedTeamUser = authService.authentication.userName;
            scoreboardService.getScoreboardGoals(scoreboardService.selectedTeamUser, teamService.currentTeamId).then(function(response) {
                $scope.goals = [];
                $scope.adminGoals = [];
                for (var i = 0; i < response.length; i++) {
                    if (response[i].isTeamGoal) {
                        $scope.adminGoals.push(response[i]);
                    } else {
                        $scope.goals.push(response[i]);
                    }
                }


                if ((teamService.adminForCurrentTeam)) {
                    $scope.adminGoals.push($scope.addEmptyTeamGoalSlot());
                }
                if ((scoreboardService.selectedTeamUser == authService.authentication.userName)) {
                    $scope.goals.push($scope.addEmptyGoalSlot());
                }

            });
        };
        $scope.addEmptyGoalSlot = function() {
            var emptyGoal = {
                deadline: "",
                description: "",
                goalId: -1,
                hipes: null,
                title: "Empty"
            };
            return emptyGoal;
        };
        $scope.addEmptyTeamGoalSlot = function() {
            var emptyGoal = {
                deadline: "",
                description: "",
                goalId: -1,
                hipes: null,
                title: "EmptyTeam"
            };
            return emptyGoal;
        };
        $scope.loadScoreboard = function() {
            if ($state.includes("home.scoreboard")) {
                $scope.loadGoals();
            } else if ($state.includes("home.scoreboardHistory")) {
                $scope.firstLoad();
            } else if ($state.includes("home.scoreboardStatistics")) {

                $scope.getGoalsForPie();
                $scope.firstLoad();
            }
        };

        $scope.loadScoreboard();
        $scope.openGoal = function(goalId) {
            if ((teamService.adminForCurrentTeam || scoreboardService.selectedTeamUser == authService.authentication.userName)) {
                if (goalId > -1) {

                    goalService.teamGoal = false;
                    goalService.goalSelected = goalId;
                    $state.transitionTo("home.goal");
                } else {
                    $state.transitionTo("home.goalCreate");
                }
            }
        };
        $scope.openAdminGoal = function(goalId) {
            if ((teamService.adminForCurrentTeam || scoreboardService.selectedTeamUser == authService.authentication.userName)) {
                goalService.teamGoal = true;
                if (goalId > -1) {


                    goalService.goalSelected = goalId;


                    $state.transitionTo("home.goal");
                } else {

                    goalService.goalParticipantSelected = true;
                    goalService.goalTeamsSelected = [];
                    goalService.goalTeamsSelected.push(scoreboardService.selectedTeamUser);
                    $state.transitionTo("home.goalCreate");

                }
            }
        };
        $scope.$watch(function() {
            return teamService.currentTeamId;
        }, function() {

            feedService.feedFilter.teamId = teamService.currentTeamId;

            if ($state.includes("home.scoreboard")) {
                $scope.loadGoals();
            } else if ($state.includes("home.scoreboardHistory")) {
                $scope.applyFilter();
            } else if ($state.includes("home.scoreboardStatistics")) {

                $scope.applyFilter();
            }


        });


        $scope.$watch(function() {
            return feedService.feedFilter.status.last;
        }, function() {


            if (!feedService.isFilterSended && feedService.checkFilterLastFirstEquals(feedService.feedFilter)) {
                feedService.isFilterSended = true;
                $scope.applyFilter();
            }


        });
        $scope.$watch(function() {
            return feedService.feedFilter.teamMember.last;
        }, function() {


            if (!feedService.isFilterSended && feedService.checkFilterLastFirstEquals(feedService.feedFilter)) {
                feedService.isFilterSended = true;
                $scope.applyFilter();
            }


        });
        $scope.$watch(function() {
            return feedService.feedFilter.timeFrom.last;
        }, function() {


            if (!feedService.isFilterSended && feedService.checkFilterLastFirstEquals(feedService.feedFilter)) {
                feedService.isFilterSended = true;
                $scope.applyFilter();
            }


        });
        $scope.$watch(function() {
            return feedService.feedFilter.timeTo.last;
        }, function() {


            if (!feedService.isFilterSended && feedService.checkFilterLastFirstEquals(feedService.feedFilter)) {
                feedService.isFilterSended = true;
                $scope.applyFilter();
            }


        });
        $scope.$watch(function() {
            return feedService.feedFilter.typeOfGoal.last;
        }, function() {


            if (!feedService.isFilterSended && feedService.checkFilterLastFirstEquals(feedService.feedFilter)) {
                feedService.isFilterSended = true;
                $scope.applyFilter();
            }


        });
        $scope.$watch(function() {
            return feedService.feedFilter.feedback.last;
        }, function() {


            if (!feedService.isFilterSended && feedService.checkFilterLastFirstEquals(feedService.feedFilter)) {
                feedService.isFilterSended = true;
                $scope.applyFilter();
            }


        });


    }
]);


