"use strict";
app.controller("goalController", [
    "$scope", "$state", "authService", "$location", "$timeout", "teamService", "goalService", "scoreboardService", "modalService", function($scope, $state, authService, $location, $timeout, teamService, goalService, scoreboardService, modalService) {
        $scope.goal = {
            title: "",
            description: "",
            goalTypeId: "",
            reachedAmount: "",
            targetAmount: "",
            repeatId: "",
            deadLine: "",
            hipes: "",
            statusOfGoalId: "",
            surveysId: ""


        };
        $scope.surveysAllChecked = true;
        $scope.surveyErrorMessage = "";
        $scope.clickedSave = false;
        $scope.today = function() {
            $scope.goal.deadLine = new Date();
        };
        $scope.today();

        $scope.clear = function() {
            $scope.goal.deadLine = null;
        };
        $scope.editEnabled = function() {
            if (teamService.adminForCurrentTeam) {
                return false;
            } else if (scoreboardService.selectedTeamUser == authService.authentication.userName && !$scope.isAdmin()) {
                return false;
            }
            return true;
        };
        $scope.showTeamList = function() {
            return teamService.adminForCurrentTeam && goalService.teamGoal;
        };
        $scope.isAdmin = function() {
            return goalService.teamGoal;
        }; // Disable weekend selection
        $scope.disabled = function(date, mode) {
            return (mode && (date.getDay() === 0 || date.getDay() === 6));
        };

        $scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
        };
        $scope.toggleMin();
        $scope.maxDate = new Date(2020, 5, 22);

        $scope.open = function($event) {
            $scope.status.opened = true;
        };

        $scope.setDate = function(year, month, day) {
            $scope.goal.deadLine = new Date(year, month, day);
        };

        $scope.dateOptions = {
            formatYear: "yy",
            startingDay: 1
        };

        $scope.formats = ["dd-MMMM-yyyy", "yyyy/MM/dd", "dd.MM.yyyy", "shortDate"];
        $scope.format = $scope.formats[0];

        $scope.status = {
            opened: false
        };

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var afterTomorrow = new Date();
        afterTomorrow.setDate(tomorrow.getDate() + 2);
        $scope.events =
        [
            {
                date: tomorrow,
                status: "full"
            },
            {
                date: afterTomorrow,
                status: "partially"
            }
        ];

        $scope.getDayClass = function(date, mode) {
            if (mode === "day") {
                var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

                for (var i = 0; i < $scope.events.length; i++) {
                    var currentDay = new Date($scope.events[i].date).setHours(24, 0, 0, 0);

                    if (dayToCheck === currentDay) {
                        return $scope.events[i].status;
                    }
                }
            }

            return "";
        };
        $scope.updateGoal = function() {
            if ($scope.statusOfGoals.selected.id != 1) {


                var modalDefaults = {
                    backdrop: true,
                    keyboard: true,
                    modalFade: true,
                    templateUrl: "/app/views/popups/surveyModal.html",
                    scope: $scope
                };

                var modalOptions = {
                    actionButtonText: "Done",
                    headerText: "",
                    bodyText: "Are you sure?",
                    list: $scope.surveys.options
                };
                $scope.checkSurveys = function() {
                    if ($scope.selectedSurveysNo.length + $scope.selectedSurveysYes.length == 4) {

                        modalService.okClick();
                        $scope.surveyErrorMessage = "";
                        $scope.surveysAllChecked = true;
                    } else {
                        $scope.surveyErrorMessage = "All points should be checked";
                        $scope.surveysAllChecked = false;
                    }

                };
                modalService.showSurveyModal(modalDefaults, modalOptions).then(function(result) {

                    $scope.updateGoalApp();

                });
            } else {
                $scope.updateGoalApp();
            }


        };
        $scope.cancel = function() {
            $state.transitionTo("home.scoreboard");
        };
        $scope.selectedSurveysYes = [];
        $scope.selectedSurveysNo = [];

        $scope.toggleSelection = function toggleSelection(item, ifYes) {
            if (ifYes) {
                var idx = $scope.selectedSurveysYes.indexOf(item);

                // is currently selected
                if (idx > -1) {
                    $scope.selectedSurveysYes.splice(idx, 1);
                    $scope.selectedSurveysNo.push(item);
                }
                // is newly selected
                else {
                    var idxNo = $scope.selectedSurveysNo.indexOf(item);
                    if (idxNo > -1) {
                        $scope.selectedSurveysNo.splice(idx, 1);
                    }
                    $scope.selectedSurveysYes.push(item);
                }
            } else {
                var idx = $scope.selectedSurveysNo.indexOf(item);

                // is currently selected
                if (idx > -1) {
                    $scope.selectedSurveysNo.splice(idx, 1);
                    $scope.selectedSurveysYes.push(item);
                }
                // is newly selected
                else {
                    var idxNo = $scope.selectedSurveysYes.indexOf(item);
                    if (idxNo > -1) {
                        $scope.selectedSurveysYes.splice(idx, 1);
                    }
                    $scope.selectedSurveysNo.push(item);
                }
            }


        };

        $scope.getParticipantsForSave = function() {
            var result = [];
            for (var i = 0; i < $scope.participants.length; i++) {
                result.push($scope.participants[i].userName);
            }
            return result;

        };
        $scope.updateGoalApp = function() {
            $scope.goal.statusOfGoalId = $scope.statusOfGoals.selected.id;
            $scope.goal.repeatId = $scope.repeats.selected.id;
            $scope.goal.goalTypeId = $scope.typesOfGoals.selected.id;
            $scope.goal.deadLine = new Date($scope.goal.deadLine.getTime() - $scope.goal.deadLine.getTimezoneOffset() * 60000);
            $scope.goal.userName = scoreboardService.selectedTeamUser;
            $scope.goal.surveysId = $scope.selectedSurveysYes;
            $scope.goal.teamUsers = $scope.getParticipantsForSave();
            $scope.clickedSave = true;
            goalService.updateGoal($scope.goal).then(function() {
                $state.transitionTo("home.feed");
            });
        };
        $scope.typesOfGoals = {
            selected: "",
            options: ""
        };
        $scope.repeats = {
            selected: "",
            options: ""
        };
        $scope.statusOfGoals = {
            selected: "",
            options: ""
        };
        $scope.surveys = {
            selected: "",
            options: ""
        };
        $scope.checkIsNumber = function() {
            return $scope.typesOfGoals.selected.id != 2; // 1 is success/fail, 2  is number
        };
        $scope.getTypesOfGoals = function() {
            goalService.getGoalTypes().then(function(result) {
                $scope.typesOfGoals.options = result;
                $scope.getGoalStatuses();

            });

        };
        $scope.getGoalStatuses = function() {
            goalService.getGoalStatuses().then(function(result) {
                $scope.statusOfGoals.options = result;
                $scope.getRepeats();

            });

        };
        $scope.getRepeats = function() {
            goalService.getRepeats().then(function(result) {
                $scope.repeats.options = result;
                $scope.getGoal();
            });

        };
        $scope.getSurveys = function() {
            goalService.getSurveys().then(function(result) {
                $scope.surveys.options = result;
                $scope.setSelectedRepeats();
                $scope.setSelectedGoalStatuses();
                $scope.setSelectedTypesOfGoals();
            });

        };
        $scope.getGoal = function() {
            goalService.getGoal(goalService.goalSelected).then(function(result) {
                result.deadLine = new Date(result.deadLine);
                $scope.getTeamList(result.teamUsers);
                $scope.goal = result;
                $scope.getSurveys();


            });

        };
        $scope.setSelectedRepeats = function() {
            for (var i = 0; i < $scope.repeats.options.length; i++) {
                if ($scope.repeats.options[i].id == $scope.goal.repeatId) {
                    $scope.repeats.selected = $scope.repeats.options[i];
                }
            }
        };
        $scope.setSelectedGoalStatuses = function() {
            for (var i = 0; i < $scope.statusOfGoals.options.length; i++) {
                if ($scope.statusOfGoals.options[i].id == $scope.goal.statusOfGoalId) {
                    $scope.statusOfGoals.selected = $scope.statusOfGoals.options[i];
                }
            }
        };
        $scope.setSelectedTypesOfGoals = function() {
            for (var i = 0; i < $scope.typesOfGoals.options.length; i++) {
                if ($scope.typesOfGoals.options[i].id == $scope.goal.goalTypeId) {
                    $scope.typesOfGoals.selected = $scope.typesOfGoals.options[i];
                }
            }
        };
        $scope.teamMembers = [];
        $scope.participants = [];

        $scope.getTeamList = function(teamUsers) {
            teamService.getTeamById(teamService.currentTeamId).then(function(result) {
                $scope.teamMembers = result.profileList;
                for (var i = 0; i < $scope.teamMembers.length; i++) {
                    if (teamUsers.indexOf($scope.teamMembers[i].userName) > -1) {
                        $scope.participants.push($scope.teamMembers[i]);
                        goalService.goalTeamsSelected.push($scope.teamMembers[i].userName);

                    }
                }


            });
        };
        $scope.$watchCollection(function() {
            return goalService.goalParticipantSelected;
        }, function() {
            if (goalService.goalParticipantSelected) {
                $scope.participants = [];
                for (var i = 0; i < $scope.teamMembers.length; i++) {
                    if (goalService.goalTeamsSelected.indexOf($scope.teamMembers[i].userName) > -1) {
                        $scope.participants.push($scope.teamMembers[i]);


                    }
                }
                goalService.goalTeamsSelectedForRemove = [];
                $scope.participantsSelected = [];
                goalService.goalParticipantSelected = false;
            }
        });


        $scope.participantsSelected = goalService.goalTeamsSelectedForRemove;
        $scope.toggleSelectionRemove = function toggleSelection(item) {
            var idx = $scope.participantsSelected.indexOf(item);

            // is currently selected
            if (idx > -1) {
                $scope.participantsSelected.splice(idx, 1);
            }
// is newly selected
            else {
                $scope.participantsSelected.push(item);

            }
            goalService.goalTeamsSelectedForRemove = $scope.participantsSelected;
        };
        $scope.getTypesOfGoals();

        $scope.$watch(function() {
            return $scope.typesOfGoals.selected;
        }, function() {
            if ($scope.typesOfGoals.selected.id == 1) {

                $scope.goal.targetAmount = 0;
            }
        });
    }
]);