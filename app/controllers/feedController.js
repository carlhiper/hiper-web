"use strict";
app.controller("feedController", [
    "$scope", "$translate", "$state", "$location", "ngAuthSettings", "$timeout", "teamService", "feedService", "scoreboardService", function($scope, $translate, $state, $location, ngAuthSettings, $timeout, teamService, feedService, scoreboardService) {


        $scope.feedList = [];
        feedService.feedFilter.lastDate = feedService.feedFilter.timeTo.first;
        $scope.previousLastDate = feedService.feedFilter.lastDate;
        scoreboardService.selectedTeamUser = "";
        $scope.hipe = function(feedId, goalId, isHiped) {
            if (!isHiped) {
                if (goalId != -1) {
                    scoreboardService.hipeGoal(goalId).then(function() {
                        for (var i = 0; i < $scope.feedList.length; i++) {
                            if ($scope.feedList[i].feedId == feedId) {
                                $scope.feedList[i].hipes = $scope.feedList[i].hipes + 1;
                                $scope.feedList[i].isHiped = true;
                            }
                        }
                    });
                } else {
                    feedService.hipeFeed(feedId).then(function() {
                        for (var i = 0; i < $scope.feedList.length; i++) {
                            if ($scope.feedList[i].feedId == feedId) {
                                $scope.feedList[i].hipes = $scope.feedList[i].hipes + 1;
                                $scope.feedList[i].isHiped = true;
                            }
                        }
                    });
                }

            }
        };

        $scope.openScoreboard = function(userName, isDeleted) {
            if (!isDeleted) {
                scoreboardService.selectedTeamUser = userName;
                $state.transitionTo("home.scoreboard");
            }
        };
        $scope.getFeedList = function() {
            if ($scope.feedList.length > 0 && !feedService.isFilterSended) {

                feedService.isFilterSended = true;
                feedService.sendFilter(feedService.feedFilter).then(function(response) {
                    feedService.feedList = response;
                    feedService.isFilterSended = false;

                });

            }
        };


        $scope.$watch(function() {
            return teamService.currentTeamId;
        }, function() {
            console.log(" from feed watch " + feedService.isFilterSended);
            feedService.feedFilter.teamId = teamService.currentTeamId;
            $scope.feedList = [];
            feedService.feedFilter.lastDate = feedService.feedFilter.timeTo.first;

            $scope.applyFilter();

        });

        $scope.getDateFromNow = function(time) {
            var result = "";
            if (time < 60) {
                result = "1m";
            } else if (60 < time && time < 3600) {
                result = (Math.round(time / 60)).toString() + "m";
            } else if (3600 < time && time < 3600 * 24) {
                result = Math.round((time / 3600)).toString() + "h";
            } else if (3600 * 24 < time && time < 3600 * 24 * 7) {
                result = Math.round((time / (3600 * 24))).toString() + "d";
            } else if (3600 * 24 * 7 < time && time < 3600 * 24 * 7 * 4) {
                result = Math.round((time / (3600 * 24 * 7))).toString() + "w";
            }


            return result;
        };

        $scope.$watchCollection(function() {
            return feedService.feedList;
        }, function() {
            for (var i = 0; i < feedService.feedList.length; i++) {
                $scope.feedList.push(feedService.feedList[i]);
            }

            if (feedService.feedList.length > 0) {
                feedService.feedFilter.lastDate = feedService.feedList[feedService.feedList.length - 1].creationDate;
            }
            var dateNow = new Date();
            var timeNow = dateNow.getTime();
            angular.forEach($scope.feedList, function(teamMember) {

                var difference = timeNow - new Date(teamMember.creationDate).getTime(); // This will give difference in milliseconds
                var resultInMinutes = Math.round(difference / 1000);
                teamMember.dateFrom = $scope.getDateFromNow(resultInMinutes);

                if (teamMember.picture.indexOf(ngAuthSettings.apiServiceBaseUri) == -1)
                    teamMember.picture = ngAuthSettings.apiServiceBaseUri + teamMember.picture + "?" + new Date;
            });
        });


        $scope.$watch(function() {
            return feedService.feedFilter.typeOfUpdate.last;
        }, function() {

            $scope.callFilter();


        });
        $scope.$watch(function() {
            return feedService.feedFilter.teamMember.last;
        }, function() {


            $scope.callFilter();


        });
        $scope.$watch(function() {
            return feedService.feedFilter.timeFrom.last;
        }, function() {


            $scope.callFilter();


        });
        $scope.$watch(function() {
            return feedService.feedFilter.timeTo.last;
        }, function() {


            $scope.callFilter();


        });
        $scope.$watch(function() {
            return feedService.feedFilter.typeOfGoal.last;
        }, function() {

            $scope.callFilter();


        });

        $scope.callFilter = function() {
            $scope.feedList = [];
            if (!feedService.isFilterSended && feedService.checkFilterLastFirstEquals(feedService.feedFilter)) {
                feedService.isFilterSended = true;
                feedService.feedFilter.lastDate = feedService.feedFilter.timeTo.first;

                $scope.applyFilter();
            }
        };
        $scope.applyFilter = function() {

            while (feedService.checkFilterLastFirstEquals(feedService.feedFilter)) {
                if (feedService.feedFilter.firstLoad) {
                    feedService.feedFilter.firstLoad = false;
                    console.log("from controller FIRST LOAD");

                }
                feedService.sendFilter(feedService.feedFilter).then(function(response) {
                    if (feedService.checkFilterLastFirstEquals(feedService.feedFilter)) {
                        console.log("from controller after receive filter not stable");
                        $scope.applyFilter();
                    } else {
                        feedService.feedList = response;
                        feedService.isFilterSended = false;

                        console.log("from controller after receive filter stable");
                        console.log(feedService.isFilterSended);
                    }

                });
            }


        };
        $scope.firstLoad = function() {
            feedService.feedFilter.firstLoad = true;

            $scope.applyFilter();


        };
        $scope.firstLoad();


    }
]);