"use strict";
app.controller("goalCreateController", [
    "$scope", "$state", "authService", "$location", "$timeout", "teamService", "goalService", "modalService", function($scope, $state, authService, $location, $timeout, teamService, goalService, modalService) {
        $scope.goal = {
            title: "",
            description: "",
            goalTypeId: "",
            reachedAmount: "",
            targetAmount: "",
            repeatId: "",
            deadline: "",
            hipes: "",
            statusOfGoalId: "",
            teamId: "",
            teamUsers: "",
            IsTeamGoal: goalService.teamGoal


        };
        $scope.clickedSave = false;

        $scope.checkIsNumber = function() {
            return $scope.typesOfGoals.selected.id != 2; // 1 is success/fail, 2  is number
        };
        $scope.today = function() {
            $scope.goal.deadline = new Date();
        };

        $scope.clear = function() {
            $scope.goal.deadline = null;
        };

        // Disable weekend selection
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
            $scope.goal.deadline = new Date(year, month, day);
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
                    var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                    if (dayToCheck === currentDay) {
                        return $scope.events[i].status;
                    }
                }
            }

            return "";
        };
        $scope.getParticipantsForSave = function() {
            var result = [];
            for (var i = 0; i < $scope.participants.length; i++) {
                result.push($scope.participants[i].userName);
            }
            return result;

        };
        $scope.createGoal = function() {
            if ($scope.participants.length > 0 || !goalService.teamGoal) {
                $scope.goal.statusOfGoalId = $scope.statusOfGoals.selected.id;
                $scope.goal.repeatId = $scope.repeats.selected.id;
                $scope.goal.goalTypeId = $scope.typesOfGoals.selected.id;
                $scope.goal.teamId = teamService.currentTeamId;
                $scope.goal.teamUsers = $scope.getParticipantsForSave();
                $scope.goal.deadline = new Date($scope.goal.deadline.getTime() - $scope.goal.deadline.getTimezoneOffset() * 60000);
                if ($scope.typesOfGoals.selected.id == 1 && $scope.goal.targetAmount == "") {

                    $scope.goal.targetAmount = 0;
                }
                $scope.clickedSave = true;
                if (goalService.teamGoal) {
                    goalService.createTeamGoal($scope.goal).then(function() {
                        $state.transitionTo("home.feed");
                        goalService.teamGoal = false;

                    });
                } else {
                    goalService.createGoal($scope.goal).then(function() {
                        $state.transitionTo("home.feed");
                    });
                }
            } else {
                var modalDefaults = {
                    backdrop: true,
                    keyboard: true,
                    modalFade: true,
                    templateUrl: "/app/views/popups/attentionModal.html"
                };
                var modalOptions = {
                    closeButtonText: "Ok",

                    headerText: "",
                    bodyText: "No one team member added,please add one or more"
                };

                modalService.showModal(modalDefaults, modalOptions).then(function() {

                });
            }

        };
        $scope.cancel = function() {
            $state.transitionTo("home.scoreboard");
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
        $scope.someSelected = function(item) {
            return item != "";
        };
        $scope.teamMembers = [];
        $scope.participants = [];

        $scope.getTeamList = function() {
            teamService.getTeamById(teamService.currentTeamId).then(function(result) {
                $scope.teamMembers = result.profileList;
                for (var i = 0; i < $scope.teamMembers.length; i++) {
                    if (goalService.goalTeamsSelected.indexOf($scope.teamMembers[i].userName) > -1) {
                        $scope.participants.push($scope.teamMembers[i]);

                    }
                }


            });
        };
        $scope.participantsSelected = goalService.goalTeamsSelectedForRemove;
        $scope.toggleSelection = function toggleSelection(item) {
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

        $scope.isAdmin = function() {
            return goalService.teamGoal;
        };
        $scope.getTypesOfGoals = function() {
            goalService.getGoalTypes().then(function(result) {
                $scope.typesOfGoals.options = result;
                $scope.typesOfGoals.selected = $scope.typesOfGoals.options[0];
            });

        };
        $scope.getGoalStatuses = function() {
            goalService.getGoalStatuses().then(function(result) {
                $scope.statusOfGoals.options = result;
                $scope.statusOfGoals.selected = $scope.statusOfGoals.options[0];
            });

        };
        $scope.getRepeats = function() {
            goalService.getRepeats().then(function(result) {
                $scope.repeats.options = result;
                $scope.repeats.selected = $scope.repeats.options[0];
            });

        };
        $scope.$watch(function() {
            return $scope.typesOfGoals.selected;
        }, function() {
            if ($scope.typesOfGoals.selected.id == 1) {

                $scope.goal.targetAmount = "";
            }
        });
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

        $scope.getTypesOfGoals();
        $scope.getGoalStatuses();
        $scope.getRepeats();
        $scope.getTeamList();

    }
]);