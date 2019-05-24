"use strict";
app.factory("teamService", [
    "$http", "ngAuthSettings", function($http, ngAuthSettings) {
        var serviceBase = ngAuthSettings.apiServiceBaseUri;
        var teamServiceFactory = {};
        var _currentTeamId = "";
        var _createTeam = function(team) {


            return $http.post(serviceBase + "api/team/CreateTeam", team).then(function(response) {
                return response;
            });

        };
        var _getTeamById = function(teamId) {
            return $http.post(serviceBase + "api/team/Team", teamId).then(function(response) {
                return response.data;
            });
        };
        var _joinTeam = function(team) {
            return $http.post(serviceBase + "api/team/JoinTeam", team).then(function(response) {
                return response;
            });
        };
        var _getTeamsForUser = function() {
            return $http.get(serviceBase + "api/team/GetTeamsForUser").then(function(response) {
                return response.data;
            });
        };
        var _getFilterUsers = function(teamId) {
            return $http.post(serviceBase + "api/team/GetFilterUser", teamId).then(function(response) {
                return response.data;
            });
        };
        var _removeTeamMembers = function(teamUsers, teamId) {
            var toSend = { users: teamUsers, teamId: teamId };
            return $http.post(serviceBase + "api/team/RemoveUsersFromTeam", JSON.stringify(toSend)).then(function(response) {
                return response.data;
            });
        };
        var _addTeamMembers = function(teamUsers, teamId) {
            var toSend = { TeamUsers: teamUsers, TeamId: teamId };
            return $http.post(serviceBase + "api/team/ApprouveUsers", JSON.stringify(toSend)).then(function(response) {
                return response.data;
            });
        };
        var _addNewTeamMembers = function(teamUsers, teamId) {
            var toSend = { TeamUsers: teamUsers, TeamId: teamId };
            return $http.post(serviceBase + "api/team/AddUsersToTeam", JSON.stringify(toSend)).then(function(response) {
                return response.data;
            });
        };
        var _teamListOperation = false;
        var _selectedTeamMembers = [];
        var _adminForCurrentTeam = false;
        var _maxMemberCount = -1;
        var _memberCount = 0;
        var _teamCreateType = "";

        teamServiceFactory.createTeam = _createTeam;
        teamServiceFactory.joinTeam = _joinTeam;
        teamServiceFactory.getTeamById = _getTeamById;
        teamServiceFactory.currentTeamId = _currentTeamId;

        teamServiceFactory.adminForCurrentTeam = _adminForCurrentTeam;
        teamServiceFactory.getTeamsForUser = _getTeamsForUser;
        teamServiceFactory.getFilterUsers = _getFilterUsers;
        teamServiceFactory.selectedTeamMembers = _selectedTeamMembers;
        teamServiceFactory.removeTeamMembers = _removeTeamMembers;
        teamServiceFactory.teamListOperation = _teamListOperation;
        teamServiceFactory.addTeamMember = _addTeamMembers;
        teamServiceFactory.addNewTeamMembers = _addNewTeamMembers;
        teamServiceFactory.maxMemberCount = _maxMemberCount;
        teamServiceFactory.memberCount = _memberCount;
        teamServiceFactory.teamCreateType = _teamCreateType;

        return teamServiceFactory;

    }
]);