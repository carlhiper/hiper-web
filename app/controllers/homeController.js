"use strict";
app.controller("homeController", [
    "$scope", "$uibModal", "$state", "teamService", "feedService", "userProfileService", "ngAuthSettings", "scoreboardService", "authService", "modalService", "goalService", "localeService", "$sce", function($scope, $uibModal, $state, teamService, feedService, userProfileService, ngAuthSettings, scoreboardService, authService, modalService, goalService, localeService, $sce) {
        $scope.teams = "";
        if ($state.includes("home")) {
            $state.transitionTo("home.feed");
        }

        localeService.loadUserLang().then(function(result) {
            localeService.setLocaleByDisplayName(result.language);
        });


        $scope.getTeamsListForUser = function() {
            teamService.getTeamsForUser().then(function(result) {
                $scope.teams = result;
                $scope.teams.push({
                    teamId: -1,
                    teamName: "PRIVATE",
                    isAdmin: false,
                    active: true
                });
                if ($scope.teams.length > 0) {
                    for (var i = 0; i < $scope.teams.length; i++) {
                        if ($scope.teams[i].active) {
                            $scope.setCurrentTeam($scope.teams[0].teamId, $scope.teams[0].isAdmin, $scope.teams[i].active);
                            break;
                        }
                    }

                }
            });
        };
        $scope.getTeamsListForUser();
        $scope.setCurrentTeam = function(teamId, isAdmin, active) {
            if (active) {
                teamService.currentTeamId = teamId;
                teamService.adminForCurrentTeam = isAdmin;
            }

        };
        $scope.isActive = function(teamId) {
            var s = false;
            if (teamService.currentTeamId == teamId) {
                s = true;
            }
            return s;
        };


        $scope.profileData = {
            profile: {
                userName: "",

                lastName: "",
                firstName: "",
                title: "",
                nickName: "",
                picture: "",

                company: ""
            },

            goals: {
                name: ""
            },
            teams: {
                name: "",
                id: ""

            }
        };
        $scope.filterUpdate = {
            selected: "",
            options: ""
        };

        $scope.filterGoal = {
            selected: "",
            options: ""
        };
        $scope.filterUsers = {
            selected: "",
            options: ""
        };
        $scope.advansedStatUsers = {
            selected: "",
            options: ""
        };
        $scope.filterStatuses = {
            selected: "",
            options: ""
        };
        $scope.filterFeedbacks = {
            selected: "",
            options: ""
        };

        $scope.loadUserProfile = function() {
            if (scoreboardService.selectedTeamUser == "") {
                scoreboardService.selectedTeamUser = authService.authentication.userName;
            }

            userProfileService.getUserProfile(scoreboardService.selectedTeamUser).then(function(response) {
                $scope.profileData = response.data;
                $scope.profileData.profile.picture = ngAuthSettings.apiServiceBaseUri + $scope.profileData.profile.picture + "?" + new Date;
            });
        };
        $scope.getFeedFilterData = function() {
            feedService.getFeedFilterData(teamService.currentTeamId).then(function(result) {

                $scope.filterUsers.options = result.users;
                $scope.filterUsers.options.unshift({ id: -1, name: "All" });
                $scope.filterUsers.selected = { id: -1, name: "All" };


                $scope.advansedStatUsers.options = result.users;

                $scope.advansedStatUsers.selected = { id: -1, name: "All" };

                $scope.filterGoal.options = result.goalTypes;
                $scope.filterGoal.options.unshift({ id: -1, name: "All" });
                $scope.filterGoal.selected = { id: -1, name: "All" };

                $scope.filterStatuses.options = result.statuses;
                $scope.filterStatuses.options.unshift({ id: -1, name: "All" });
                $scope.filterStatuses.selected = { id: -1, name: "All" };

                $scope.filterFeedbacks.options = result.feedbacks;
                $scope.filterFeedbacks.options.unshift({ id: -1, name: "All" });
                $scope.filterFeedbacks.selected = { id: -1, name: "All" };

                $scope.filterUpdate.options = result.updateTypes;
                $scope.filterUpdate.options.unshift({ id: -1, name: "All" });
                $scope.filterUpdate.selected = { id: -1, name: "All" };
            });
        };
        $scope.checkUserProfileState = function() {
            if ((scoreboardService.selectedTeamUser == authService.authentication.userName) && $state.includes("home.userProfile")) {
                return true;
            }
            return false;
        };
        $scope.checkTeamState = function() {
            if (teamService.adminForCurrentTeam && $state.includes("home.team")) {
                return true;
            }
            return false;
        };
        $scope.checkTeamOptionsState = function() {
            if ($state.includes("home.team")) {
                return true;
            }
            return false;
        };
        $scope.checkFeedState = function() {

            return $state.includes("home.feed");
        };

        $scope.checkFilterState = function() {
            if ($state.includes("home.feed")) {
                return true;
            } else if ($state.includes("home.scoreboardHistory") || $state.includes("home.scoreboardStatistics")) {
                return true;
            }
            return false;
        };
        $scope.deleteSelectedTeams = function() {
            var modalDefaults = {
                backdrop: true,
                keyboard: true,
                modalFade: true,
                templateUrl: "/app/views/popups/modal.html"
            };
            var modalOptions = {
                closeButtonText: "No",
                actionButtonText: "Yes",
                headerText: "",
                bodyText: "Are you sure you want to delete selected teams?"
            };

            modalService.showModal(modalDefaults, modalOptions).then(function(result) {
                if (result != "cancel") {
                    userProfileService.deleteTeamsForSelectedUser(userProfileService.selectedUserProfile, userProfileService.selectedTeams).then(function(result) {
                        $scope.getTeamsListForUser();
                        userProfileService.teamDeleted = true;
                    });

                }
            });

        };

        $scope.deleteCurrentTeams = function() {
            var modalDefaults = {
                backdrop: true,
                keyboard: true,
                modalFade: true,
                templateUrl: "/app/views/popups/modal.html"
            };
            var modalOptions = {
                closeButtonText: "No",
                actionButtonText: "Yes",
                headerText: "",
                bodyText: "Are you sure you want to delete  team?"
            };

            modalService.showModal(modalDefaults, modalOptions).then(function(result) {
                if (result != "cancel") {
                    var teamIds = [];
                    teamIds.push(teamService.currentTeamId);
                    userProfileService.deleteTeamsForSelectedUser(authService.authentication.userName, teamIds).then(function(result) {
                        $scope.getTeamsListForUser();
                    });

                }
            });

        };

        $scope.checkAdminOrFeedState = function() {
            if ($scope.checkFeedState()) {
                return true;
            } else if (($scope.checkScoreboardHistoryState() || $scope.checkScoreboardStatisticsState()) && teamService.adminForCurrentTeam) {
                return true;
            }
            return false;
        };
        $scope.checkScoreboardHistoryState = function() {
            return $state.includes("home.scoreboardHistory");
        };
        $scope.checkScoreboardStatisticsState = function() {
            return $state.includes("home.scoreboardStatistics");
        };
        $scope.checkScoreboardState = function() {
            if ((teamService.adminForCurrentTeam || scoreboardService.selectedTeamUser == authService.authentication.userName) && ($state.includes("home.scoreboard") || $state.includes("home.scoreboardHistory") || $state.includes("home.scoreboardStatistics"))) {
                return true;
            }
            return false;

        };

        $scope.checkTeamGoalState = function() {
            return goalService.teamGoal && ($state.includes("home.goal") || $state.includes("home.goalCreate"));
        };
        $scope.checkScoreboardStateUser = function() {
            return $state.includes("home.scoreboard") || $state.includes("home.userProfile");
        };
        $scope.openUserProfile = function() {
            if (scoreboardService.selectedTeamUser == authService.authentication.userName) {
                userProfileService.selectedUserProfile = scoreboardService.selectedTeamUser;
                $state.transitionTo("home.userProfile");
            }

        };
        $scope.$watch(function() {
            return scoreboardService.selectedTeamUser;
        }, function() {
            $scope.loadUserProfile();
        });

        $scope.activeScoreboard = function() {
            $state.transitionTo("home.scoreboard");
        };
        $scope.historyScoreboard = function() {
            $state.transitionTo("home.scoreboardHistory");
        };
        $scope.statisticsScoreboard = function() {
            $state.transitionTo("home.scoreboardStatistics");
        };

        $scope.advancedStatistics = function() {
            $scope.chartPoints = [];
            $scope.advancedRows = [];
            $scope.periodOffset = 3;
            $scope.currentCounter = "1m";


            $scope.chartColumns = [
                { "id": "achieved goals/all goals:", "type": "spline", "hide": "true" },
                { "id": "missed deadlines/all goals:", "type": "spline" },
                { "id": "cancelled goals/all goals:", "type": "spline" },
                { "id": "I had enought time/all goals:", "type": "spline" },
                { "id": "I had the right skills/all goals:", "type": "spline" },
                { "id": "I had enought support/all goals:", "type": "spline" },
                { "id": "I had enought resource/all goals:", "type": "spline" }
            ];

            $scope.chartGroups = [
                "achieved goals/all goals:", "missed deadlines/all goals:", "cancelled goals/all goals:",
                "I had enought time/all goals:", "I had the right skills/all goals:", "I had enought support/all goals:", "I had enought resource/all goals:"
            ];
            $scope.handleCallback = function(chartObj) {
                $scope.theChart = chartObj;
                $scope.theChart.hide("I had enought time/all goals:");
                $scope.theChart.hide("I had the right skills/all goals:");
                $scope.theChart.hide("I had enought support/all goals:");
                $scope.theChart.hide("I had enought resource/all goals:");
            };
            $scope.datax = { "id": "x" };


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

            $scope.time_format = function(timestamp) {
                var test = d3.time.format("%Y-%m-%d")(new Date(timestamp));
                return test;
            };
            $scope.timeFormatTable = "";


            $scope.percent_format = function(num) {
                var test = num + "%";
                return test;
            };
            var modalDefaults = {
                backdrop: true,
                keyboard: true,
                modalFade: true,
                scope: $scope,
                templateUrl: "/app/views/popups/advancedStatisticsModal.html?v9"
            };
            var modalOptions = {
                closeButtonText: "No",
                actionButtonText: "Close",
                headerText: $scope.filterUsers.selected.name,
                bodyText: ""
            };

            modalService.showModal(modalDefaults, modalOptions).then(function(result) {
                if (result != "cancel") {
                }
            });

            $scope.moveLeft = function(counter) {
                if (counter == "1q/1y") {
                    $scope.periodOffset = $scope.periodOffset < 3 ? $scope.periodOffset + 1 : 3;
                }
                if (counter == "1m/1y") {
                    $scope.periodOffset = $scope.periodOffset < 11 ? $scope.periodOffset + 1 : 11;
                }

                $scope.loadTableData(counter);

            };
            $scope.moveRight = function(counter) {
                $scope.periodOffset = $scope.periodOffset > 0 ? $scope.periodOffset - 1 : 0;

                $scope.loadTableData(counter);

            };


            $scope.showPercent = true;
            $scope.showPercentOrAbs = function(show) {
                $scope.showPercent = show;
                $scope.loadTableData($scope.currentCounter);
            };
            $scope.tableCounter = "";
            $scope.loadTableData = function(counter) {
                $scope.currentCounter = counter;
                $scope.tableCounter = counter;
                $scope.advStatOnLoadTable = true;
                scoreboardService.getScoreboardAdvancedStatTable($scope.advansedStatUsers.selected.id, teamService.currentTeamId, counter, $scope.periodOffset, !$scope.showPercent).then(function(response) {

                    var arrows = "<span ng-click=\"moveLeft(\'" + counter + "\')\" class='chartTable__arrow chartTable__arrow_left'></span><span ng-click=\"moveRight(\'" + counter + "\')\" class='chartTable__arrow chartTable__arrow_right'></span>";

                    $scope.timeFormatTableVal = "%Y %b";
                    if (counter == "1m") {
                        $scope.timeFormatTableVal = "%Y %b";
                    }
                    if (counter == "1y") {
                        $scope.timeFormatTableVal = "%Y";
                    }

                    $scope.timeFormatTable = function(timestamp) {
                        if (counter == "1q") {
                            var date = new Date(timestamp);
                            var quarter = Math.floor((date.getMonth() + 3) / 3);

                            var result = d3.time.format("%Y")(date) + " q" + quarter;
                            return result;
                        };
                        if (counter == "1q/1y") {
                            var date = new Date(timestamp);
                            var quarter = Math.floor((date.getMonth() + 3) / 3);

                            var result = d3.time.format("%Y")(date) + " q" + quarter + arrows;
                            return result;
                        };
                        if (counter == "1m/1y") {
                            var date = new Date(timestamp);


                            var result = d3.time.format("%Y %b")(date) + arrows;
                            return result;
                        };
                        var test = timestamp == "" ? "" : d3.time.format($scope.timeFormatTableVal)(new Date(timestamp));
                        return test;
                    };
                    $scope.achivedGoalsRow = response.achivedGoals;
                    $scope.achivedGoalsRow.splice(0, 0, "achieved goals");
                    $scope.missedDeadlinesRow = response.missedDeadlines;
                    $scope.missedDeadlinesRow.splice(0, 0, "missed deadlines");
                    $scope.canceledGoalsRow = response.canceledGoals;
                    $scope.canceledGoalsRow.splice(0, 0, "cancelled goals");


                    $scope.datesRow = response.dates;
                    $scope.hadEnTimeRow = response.hadEnTime;
                    $scope.hadEnTimeRow.splice(0, 0, "I had enought time");
                    $scope.hadEnResourceRow = response.hadEnResource;
                    $scope.hadEnResourceRow.splice(0, 0, "I had enought resource");
                    $scope.hadEnSupportRow = response.hadEnSupport;
                    $scope.hadEnSupportRow.splice(0, 0, "I had enought support");
                    $scope.hadRightSkillsRow = response.hadRightSkills;
                    $scope.hadRightSkillsRow.splice(0, 0, "I had the right skills");

                    $scope.advancedRows = [];

                    $scope.advancedRows.push($scope.achivedGoalsRow);
                    $scope.advancedRows.push($scope.missedDeadlinesRow);
                    $scope.advancedRows.push($scope.canceledGoalsRow);

                    $scope.advancedRows.push($scope.hadEnTimeRow);
                    $scope.advancedRows.push($scope.hadRightSkillsRow);
                    $scope.advancedRows.push($scope.hadEnSupportRow);
                    $scope.advancedRows.push($scope.hadEnSupportRow);

                    $scope.advStatOnLoadTable = false;
                });
            };

            $scope.getTableData = function(counter) {
                if (counter == "1q/1y") {
                    $scope.periodOffset = 3;
                }
                if (counter == "1m/1y") {
                    $scope.periodOffset = 11;
                }

                $scope.loadTableData(counter);
            };
            $scope.advStatOnLoadTable = false;
            $scope.advStatOnLoadGraph = false;

            $scope.graphCounter = "";
            $scope.loadGraphData = function(counter) {
                $scope.graphCounter = counter;
                $scope.advStatOnLoadGraph = true;
                scoreboardService.getScoreboardAdvancedStatGraph($scope.advansedStatUsers.selected.id, teamService.currentTeamId, counter).then(function(response) {

                    $scope.chartPoints = [];

                    $scope.achivedGoals = response.achivedGoals;
                    $scope.missedDeadlines = response.missedDeadlines;
                    $scope.canceledGoals = response.canceledGoals;

                    $scope.dates = response.dates;
                    $scope.hadEnTime = response.hadEnTime;
                    $scope.hadEnResource = response.hadEnResource;
                    $scope.hadEnSupport = response.hadEnSupport;
                    $scope.hadRightSkills = response.hadRightSkills;

                    for (var i = 0; i < $scope.achivedGoals.length; i++) {
                        var test = new Date($scope.dates[i]);
                        $scope.chartPoints.push({ "x": test, "achieved goals/all goals:": $scope.achivedGoals[i], "missed deadlines/all goals:": $scope.missedDeadlines[i], "cancelled goals/all goals:": $scope.canceledGoals[i], "I had enought time/all goals:": $scope.hadEnTime[i], "I had the right skills/all goals:": $scope.hadRightSkills[i], "I had enought support/all goals:": $scope.hadEnSupport[i], "I had enought resource/all goals:": $scope.hadEnResource[i] });
                    }
                    $scope.advStatOnLoadGraph = false;
                });

            };
            $scope.loadTableData("1m");
            $scope.loadGraphData("1m");

            $scope.$watch(function() {
                return $scope.advansedStatUsers.selected;
            }, function() {
                if (!$scope.advStatOnLoadGraph && !$scope.advStatOnLoadTable) {
                    $scope.loadTableData("1m");
                    $scope.loadGraphData("1m");
                }

            });

        };


        $scope.checkScoreBoardState = function(string) {
            return $state.includes(string);

        };

        $scope.addGoal = function() {
            if (teamService.selectedTeamMembers.length > 0) {
                goalService.teamGoal = true;
                for (var i = 0; i < $scope.participants.length; i++) {
                    if (teamService.selectedTeamMembers.indexOf($scope.participants[i].userName) > -1) {
                        $scope.participants.splice(i, 1);
                    }
                }
                $state.transitionTo("home.goalCreate");
            }
        };
        $scope.removeTeamMembers = function() {
            var modalDefaults = {
                backdrop: true,
                keyboard: true,
                modalFade: true,
                templateUrl: "/app/views/popups/modal.html"
            };
            var modalOptions = {
                closeButtonText: "No",
                actionButtonText: "Yes",
                headerText: "",
                bodyText: "Are you sure you want to delete selected team members from team?"
            };

            modalService.showModal(modalDefaults, modalOptions).then(function(result) {
                if (result != "cancel") {
                    teamService.teamListOperation = false;
                    teamService.removeTeamMembers(teamService.selectedTeamMembers, teamService.currentTeamId).then(function() {
                        teamService.teamListOperation = true;
                        $scope.getTeamsListForUser();
                    });
                }
            });

        };
        $scope.emailsForNewTeamMembers = [];
        $scope.removeEmailForNewTeamMember = function(i) {
            $scope.emailsForNewTeamMembers.splice(i, 1);
        };
        $scope.addNewTeamMembers = function() {
            if ($scope.emailsForNewTeamMembers.length > 0) {
                teamService.teamListOperation = false;
                teamService.addNewTeamMembers($scope.emailsForNewTeamMembers, teamService.currentTeamId).then(function(response) {
                    teamService.currentTeamId = teamService.currentTeamId;
                    teamService.teamListOperation = true;
                    $scope.emailsForNewTeamMembers = [];
                });
            }
        };
        $scope.addTeamMember = function() {

            var modalDefaults = {
                backdrop: true,
                keyboard: true,
                modalFade: true,
                templateUrl: "/app/views/popups/emailSendModal.html?v2",
                scope: $scope
            };

            var modalOptions = {
                closeButtonText: "Abort",
                actionButtonText: "Ok",
                headerText: "Send email to",
                bodyText: ""

            };

            modalService.showModal(modalDefaults, modalOptions).then(function(result) {

                if (result != "cancel") {
                    $scope.addNewTeamMembers();
                }
            });


        };
        $scope.approuveTeamMember = function() {
            if (teamService.selectedTeamMembers.length > 0) {
                if (teamService.maxMemberCount == -1 || (teamService.maxMemberCount > (teamService.memberCount + teamService.selectedTeamMembers.length))) {
                    teamService.teamListOperation = false;
                    teamService.addTeamMember(teamService.selectedTeamMembers, teamService.currentTeamId).then(function(response) {
                        teamService.currentTeamId = teamService.currentTeamId;
                        teamService.teamListOperation = true;

                    });
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
                        bodyText: "You cannot have more than " + teamService.maxMemberCount + " members in a startup team. To upgrade your team contact us at hello.hiper.se"
                    };

                    modalService.showModal(modalDefaults, modalOptions).then(function(result) {

                    });
                }
            }
        };
        $scope.addGoalParticipant = function() {
            var modalDefaults = {
                backdrop: true,
                keyboard: true,
                modalFade: true,
                templateUrl: "/app/views/popups/addTeamMemberToGoalModal.html",
                scope: $scope
            };

            var modalOptions = {
                closeButtonText: "No",
                actionButtonText: "Ok",
                headerText: "Participants to add",
                bodyText: ""

            };

            $scope.selectedTeams = [];
            $scope.getTeamList();
            modalService.showModal(modalDefaults, modalOptions).then(function(result) {

                if (result != "cancel") {
                    goalService.goalParticipantSelected = true;


                    for (var i = 0; i < $scope.selectedTeams.length; i++) {
                        if (goalService.goalTeamsSelected.indexOf($scope.selectedTeams[i]) == -1) {
                            goalService.goalTeamsSelected.push($scope.selectedTeams[i]);
                        }
                    }


                }
            });
        };
        $scope.removeGoalParticipant = function() {
            goalService.goalParticipantSelected = true;

            var tempArray = [];
            for (var i = 0; i < goalService.goalTeamsSelected.length; i++) {
                if (goalService.goalTeamsSelectedForRemove.indexOf(goalService.goalTeamsSelected[i]) == -1) {
                    tempArray.push(goalService.goalTeamsSelected[i]);
                }
            }
            goalService.goalTeamsSelected = tempArray;

        };
        $scope.toggleSelectionMembers = function toggleSelection(item) {
            var idx = $scope.selectedTeams.indexOf(item);

            // is currently selected
            if (idx > -1) {
                $scope.selectedTeams.splice(idx, 1);
            }
            // is newly selected
            else {
                $scope.selectedTeams.push(item);

            }

        };


        $scope.teamMembersToAdd = [];
        $scope.participantsSelected = [];
        $scope.selectedTeams = [];
        $scope.participants = [];

        $scope.getTeamList = function() {
            teamService.getTeamById(teamService.currentTeamId).then(function(result) {

                $scope.selectedTeams = [];
                $scope.participants = [];
                $scope.teamMembersToAdd = result.profileList;
                for (var i = 0; i < $scope.teamMembersToAdd.length; i++) {
                    if (goalService.goalTeamsSelected.indexOf($scope.teamMembersToAdd[i].userName) == -1) {
                        $scope.participants.push($scope.teamMembersToAdd[i]);

                    }
                }


            });
        };
        $scope.isAdmin = function() {
            return goalService.teamGoal;
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


        $scope.$watch(function() {
            return teamService.currentTeamId;
        }, function() {
            $scope.initFilter();
            $scope.getFeedFilterData();
            $scope.getTeamList();
            if ($state.includes("home.feed")) {

            }
            if ($state.includes("home.scoreboard")) {
                scoreboardService.selectedTeamUser = "";
                $scope.loadUserProfile();
            }
        });

        $scope.$watch(function() {
            return userProfileService.userProfileChanged;
        }, function() {
            if (userProfileService.userProfileChanged) {
                userProfileService.userProfileChanged = false;
                $scope.loadUserProfile();

            }
        });
        var date = new Date();

        var lastDate = new Date();
        lastDate.setDate(date.getDate() - 365);
        date.setDate(date.getDate());
        date = date.getTime();
        lastDate = lastDate.getTime();
        $scope.date = {
            rangeMin: lastDate,
            rangeMax: date,
            min: lastDate,
            max: date,
            step: 24 * 60 * 60 * 1000 // one day
        };


        $scope.initFilter = function() {
            feedService.isFilterSended = false;
            feedService.feedFilter.typeOfGoal.first = $scope.filterGoal.selected;
            feedService.feedFilter.typeOfUpdate.first = $scope.filterUpdate.selected;
            feedService.feedFilter.teamMember.first = $scope.filterUsers.selected;
            feedService.feedFilter.timeFrom.first = $scope.date.min;
            feedService.feedFilter.timeTo.first = $scope.date.max;
            feedService.feedFilter.typeOfGoal.last = $scope.filterGoal.selected;
            feedService.feedFilter.typeOfUpdate.last = $scope.filterUpdate.selected;
            feedService.feedFilter.teamMember.last = $scope.filterUsers.selected;
            feedService.feedFilter.timeFrom.last = $scope.date.min;
            feedService.feedFilter.timeTo.last = $scope.date.max;
            feedService.feedFilter.teamId = teamService.currentTeamId;
        };
        $scope.$watch(function() {
            return $scope.filterGoal.selected;
        }, function() {


            if ($scope.loadFilterDataCheck) {
                if ($scope.filterGoal.selected == "") {
                    feedService.feedFilter.typeOfGoal.last = "";

                } else {
                    feedService.feedFilter.typeOfGoal.last = $scope.filterGoal.selected.id;

                }

            }

        });

        $scope.$watch(function() {
            return $scope.filterStatuses.selected;
        }, function() {


            if ($scope.loadFilterDataCheck) {
                if ($scope.filterStatuses.selected == "") {
                    feedService.feedFilter.status.last = "";

                } else {

                    feedService.feedFilter.status.last = $scope.filterStatuses.selected.id;

                }

            }

        });

        $scope.$watch(function() {
            return $scope.filterFeedbacks.selected;
        }, function() {


            if ($scope.loadFilterDataCheck) {
                if ($scope.filterFeedbacks.selected == "") {
                    feedService.feedFilter.feedback.last = "";

                } else {

                    feedService.feedFilter.feedback.last = $scope.filterFeedbacks.selected.id;

                }

            }

        });


        $scope.$watch(function() {
            return $scope.filterUpdate.selected;
        }, function() {

            if ($scope.loadFilterDataCheck) {
                if ($scope.filterUpdate.selected == "") {
                    feedService.feedFilter.typeOfUpdate.last = "";

                } else {

                    feedService.feedFilter.typeOfUpdate.last = $scope.filterUpdate.selected.id;


                }
            }

        });
        $scope.$watch(function() {
            return $scope.filterUsers.selected;
        }, function() {

            if ($scope.loadFilterDataCheck) {
                if ($scope.filterUsers.selected == "") {
                    feedService.feedFilter.teamMember.last = "";

                } else {

                    feedService.feedFilter.teamMember.last = $scope.filterUsers.selected.id;


                }
            }

        });
        $scope.$watch(function() {

            return $scope.date.min;
        }, function() {

            if ($scope.loadFilterDataCheck) {
                if ($scope.date.min == "") {
                    feedService.feedFilter.timeFrom.last = "";

                } else {

                    feedService.feedFilter.timeFrom.last = $scope.date.min;

                }
            }

        });
        $scope.$watch(function() {

            return $scope.date.max;
        }, function() {


            if ($scope.loadFilterDataCheck) {
                if ($scope.date.max == "") {
                    feedService.feedFilter.timeTo.last = "";

                } else {


                    feedService.feedFilter.timeTo.last = $scope.date.max;
                    feedService.feedFilter.lastDate = feedService.feedFilter.timeTo.last;


                }
            }

        });
        $scope.loadFilterDataCheck = function() {
            if ($scope.filterUsers.selected == "" || $scope.filterGoal.selected == "" || $scope.filterUpdate.selected == "" || $scope.filterStatuses.selected == "" || $scope.filterFeedbacks.selected == "")
                return false;
            return true;
        };

    }
]);

app.filter("dateFilter", function($filter) {
    return function(value, max) {

        var _date = $filter("date")(new Date(value), "yyyy-MM-dd");

        return _date.toUpperCase();
    };
});
app.directive("compile", [
    "$compile", function($compile) {
        return function(scope, element, attrs) {
            scope.$watch(
                function(scope) {
                    // watch the 'compile' expression for changes
                    return scope.$eval(attrs.compile);
                },
                function(value) {
                    // when the 'compile' expression changes
                    // assign it into the current DOM
                    element.html(value);

                    // compile the new DOM and link it to the current
                    // scope.
                    // NOTE: we only compile .childNodes so that
                    // we don't get into infinite loop compiling ourselves
                    $compile(element.contents())(scope);
                }
            );
        };
    }
]);