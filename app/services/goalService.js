"use strict";
app.factory("goalService", [
    "$http", "ngAuthSettings", function($http, ngAuthSettings) {
        var serviceBase = ngAuthSettings.apiServiceBaseUri;

        var _createGoal = function(goal) {
            return $http.post(serviceBase + "api/goal/CreateGoal", goal).then(function(response) {
                return response.data;
            });
        };
        var _createTeamGoal = function(goal) {
            return $http.post(serviceBase + "api/goal/CreateTeamGoal", goal).then(function(response) {
                return response.data;
            });
        };
        var _getGoalTypes = function() {
            return $http.get(serviceBase + "api/goal/GetGoalTypes").then(function(response) {
                return response.data;
            });
        };
        var _getRepeats = function() {
            return $http.get(serviceBase + "api/goal/GetGoalRepeats").then(function(response) {
                return response.data;
            });
        };
        var _getSurveys = function() {
            return $http.get(serviceBase + "api/goal/GetGoalSurveys").then(function(response) {
                return response.data;
            });
        };
        var _getGoalStatuses = function() {
            return $http.get(serviceBase + "api/goal/GetGoalStatuses").then(function(response) {
                return response.data;
            });
        };
        var _updateGoal = function(goal) {
            return $http.post(serviceBase + "api/goal/UpdateGoal", goal).then(function(response) {
                return response.data;
            });
        };
        var _getGoal = function(goalId) {
            return $http.post(serviceBase + "api/goal/GoalById", goalId).then(function(response) {
                return response.data;
            });
        };
        var _teamGoal = false;
        var _goalSelected = "";
        var _goalParticipantSelected = false;
        var _goalTeamsSelected = [];
        var _goalTeamsSelectedForRemove = [];

        var goalServiceFactory = {};

        goalServiceFactory.createGoal = _createGoal;
        goalServiceFactory.createTeamGoal = _createTeamGoal;
        goalServiceFactory.updateGoal = _updateGoal;
        goalServiceFactory.getGoalStatuses = _getGoalStatuses;
        goalServiceFactory.getGoalTypes = _getGoalTypes;
        goalServiceFactory.getRepeats = _getRepeats;
        goalServiceFactory.getGoal = _getGoal;
        goalServiceFactory.goalSelected = _goalSelected;
        goalServiceFactory.teamGoal = _teamGoal;
        goalServiceFactory.getSurveys = _getSurveys;
        goalServiceFactory.goalParticipantSelected = _goalParticipantSelected;
        goalServiceFactory.goalTeamsSelected = _goalTeamsSelected;
        goalServiceFactory.goalTeamsSelectedForRemove = _goalTeamsSelectedForRemove;
        return goalServiceFactory;
    }
]);