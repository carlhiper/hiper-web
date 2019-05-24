"use strict";
app.factory("userProfileService", [
    "$http", "ngAuthSettings", function($http, ngAuthSettings) {

        var serviceBase = ngAuthSettings.apiServiceBaseUri;

        var userProfileServiceFactory = {};

        var _getUserProfileEdit = function(userName) {

            return $http.post(serviceBase + "api/account/GetUserProfileEdit", JSON.stringify(userName)).then(function(results) {
                return results;
            });
        };

        var _saveUpdatedUserProfile = function(profileData) {
            return $http.post(serviceBase + "api/account/UpdateUserProfile", profileData).then(function(results) {
                return results;
            });
        };
        var _getUserProfile = function(userName) {
            var obj = {
                username: userName
            };
            return $http.post(serviceBase + "api/account/GetUserProfile", JSON.stringify(userName)).then(function(results) {
                return results;
            });
        };
        var _selectedUserProfile = "";
        var _selectedTeams = "";

        var _deleteTeamsForSelectedUser = function(username, teams) {
            var toSend = {
                teamIds: teams,
                userName: username
            };
            return $http.post(serviceBase + "api/team/RemoveTeamsForUser", toSend).then(function(results) {
                return results;
            });
        };
        var _userProfileChanged = false;
        var _teamDeleted = false;

        userProfileServiceFactory.getUserProfileEdit = _getUserProfileEdit;
        userProfileServiceFactory.getUserProfile = _getUserProfile;
        userProfileServiceFactory.saveUpdatedUserProfile = _saveUpdatedUserProfile;
        userProfileServiceFactory.selectedUserProfile = _selectedUserProfile;
        userProfileServiceFactory.selectedTeams = _selectedTeams;
        userProfileServiceFactory.deleteTeamsForSelectedUser = _deleteTeamsForSelectedUser;
        userProfileServiceFactory.teamDeleted = _teamDeleted;
        userProfileServiceFactory.userProfileChanged = _userProfileChanged;

        return userProfileServiceFactory;

    }
]);