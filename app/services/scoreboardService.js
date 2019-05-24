"use strict";
app.factory("scoreboardService", [
    "$http", "ngAuthSettings", function($http, ngAuthSettings) {
        var serviceBase = ngAuthSettings.apiServiceBaseUri;
        var scoreboardServiceFactory = {};

        var _achivedGoals = function() {
            return $http.get(serviceBase + "api/Goal/GetTotalAmountOfAchievedGoals/").then(function(response) {
                console.log(response.data);
                return response.data;
            });
        };
        var _notAchivedGoals = function() {
            return $http.get(serviceBase + "api/Goal/GetTotalAmountOfNotAchievedGoals/").then(function(response) {
                console.log(response.data);
                return response.data;
            });
        };
        var _canceledGoals = function() {
            return $http.get(serviceBase + "api/Goal/GetTotalAmountOfCancelledGoals/").then(function(response) {
                return response.data;
            });
        };

        var _getScoreboardGoals = function(username, teamId) {
            return $http.post(serviceBase + "api/scoreboard/Scoreboard", JSON.stringify({ username: username, teamId: teamId })).then(function(response) {
                return response.data;
            });
        };
        var _getScoreboardHistoryGoals = function(username, teamId) {
            return $http.post(serviceBase + "api/scoreboard/HistoryScoreboard", JSON.stringify({ username: username, teamId: teamId })).then(function(response) {
                return response.data;
            });
        };
        var _getScoreboardAdvancedStatGraph = function(username, teamId, timePeriod) {
            return $http.post(serviceBase + "api/scoreboard/AdvancedStatisticsGraphScoreboard", JSON.stringify({ teamMember: username, teamId: teamId, timePeriod: timePeriod })).then(function(response) {
                return response.data;
            });
        };
        var _getScoreboardAdvancedStatTable = function(username, teamId, timePeriod, periodOffset, isAbs) {
            return $http.post(serviceBase + "api/scoreboard/AdvancedStatisticsTableScoreboard", JSON.stringify({ teamMember: username, teamId: teamId, timePeriod: timePeriod, periodOffset: periodOffset, isAbs: isAbs })).then(function(response) {
                return response.data;
            });
        };
        var _hipeGoal = function(goalId) {
            return $http.post(serviceBase + "api/goal/hipe", JSON.stringify(goalId)).then(function(response) {
                return response.data;
            });
        };
        var _selectedTeamUser = "";

        scoreboardServiceFactory.achivedGoals = _achivedGoals;
        scoreboardServiceFactory.notAchivedGoals = _notAchivedGoals;
        scoreboardServiceFactory.canceledGoals = _canceledGoals;
        scoreboardServiceFactory.getScoreboardGoals = _getScoreboardGoals;
        scoreboardServiceFactory.getScoreboardHistoryGoals = _getScoreboardHistoryGoals;
        scoreboardServiceFactory.hipeGoal = _hipeGoal;
        scoreboardServiceFactory.selectedTeamUser = _selectedTeamUser;
        scoreboardServiceFactory.getScoreboardAdvancedStatGraph = _getScoreboardAdvancedStatGraph;
        scoreboardServiceFactory.getScoreboardAdvancedStatTable = _getScoreboardAdvancedStatTable;

        return scoreboardServiceFactory;

    }
]);