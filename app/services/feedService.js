"use strict";
app.factory("feedService", [
    "$http", "ngAuthSettings", function($http, ngAuthSettings) {
        var serviceBase = ngAuthSettings.apiServiceBaseUri;
        var feedServiceFactory = {};
        var _scrollParam = 5;
        var _currentTeamId = "";
        var _getFeedByFilter = function(filter) {

            return $http.post(serviceBase + "api/feed/GetFeedsByFilter", filter).then(function(response) {
                return response.data;
            });
        };
        var _getFilterGoals = function() {
            return $http.get(serviceBase + "api/goal/GetGoalTypes").then(function(response) {
                return response.data;
            });
        };
        var _getFilterUpdates = function() {
            return $http.get(serviceBase + "api/feed/GetUpdateTypes").then(function(response) {
                return response.data;
            });
        };
        var _getFeedFilterData = function(teamId) {
            return $http.post(serviceBase + "api/feed/GetFeedFilterData", teamId).then(function(response) {
                return response.data;
            });
        };
        var _filter = {
            teamMember: { first: "", last: "" },
            typeOfUpdate: { first: "", last: "" },
            typeOfGoal: { first: "", last: "" },
            timeFrom: { first: "", last: "" },
            timeTo: { first: "", last: "" },
            feedback: { first: "", last: "" },
            status: { first: "", last: "" },
            teamId: -1,
            firstLoad: false,
            lastDate: ""

        };

        var _feedList = "";
        var _sendFilter = function(filter) {

            _setNewFirstLast(filter);
            var filterToSend = _prepareFilterToSend(filter);
            return $http.post(serviceBase + "api/feed/GetFeedsByFilter", filterToSend).then(function(response) {
                _isFilterSended = false;
                if (filter.firstLoad) {
                    filter.firstLoad = false;
                    _filter.firstLoad = false;
                }


                return response.data;

            });


        };

        var _sendFilterHistory = function(filter) {

            _setNewFirstLast(filter);
            var filterToSend = _prepareHistoryFilterToSend(filter);
            return $http.post(serviceBase + "api/scoreboard/HistoryScoreboard", filterToSend).then(function(response) {
                _isFilterSended = false;
                if (filter.firstLoad) {
                    filter.firstLoad = false;
                    _filter.firstLoad = false;
                }


                return response.data;

            });


        };
        var _sendFilterStatistics = function(filter) {

            _setNewFirstLast(filter);
            var filterToSend = _prepareHistoryFilterToSend(filter);
            return $http.post(serviceBase + "api/scoreboard/StatisticsScoreboard", filterToSend).then(function(response) {
                _isFilterSended = false;
                if (filter.firstLoad) {
                    filter.firstLoad = false;
                    _filter.firstLoad = false;
                }


                return response.data;

            });


        };

        var _isFilterSended = "";
        var _checkFilterLastFirstEquals = function(filter) {
            var result = (filter.firstLoad || filter.feedback.first != filter.feedback.last || filter.status.first != filter.status.last || filter.teamMember.first != filter.teamMember.last || filter.typeOfUpdate.first != filter.typeOfUpdate.last || filter.typeOfGoal.first != filter.typeOfGoal.last || filter.timeFrom.first != filter.timeFrom.last || filter.timeTo.first != filter.timeTo.last);

            return result;

        };
        var _setNewFirstLast = function(filter) {
            filter.typeOfGoal.first = filter.typeOfGoal.last;
            filter.typeOfUpdate.first = filter.typeOfUpdate.last;
            filter.teamMember.first = filter.teamMember.last;
            filter.timeFrom.first = filter.timeFrom.last;
            filter.timeTo.first = filter.timeTo.last;
            filter.status.first = filter.status.last;
            filter.feedback.first = filter.feedback.last;

        };
        var _prepareFilterToSend = function(filter) {
            var result = {
                teamMember: "",
                typeOfUpdate: "",
                typeOfGoal: "",
                timeFrom: "",
                timeTo: "",
                teamId: "",
                lastDate: "",
                scrollParam: _scrollParam
            };
            result.typeOfGoal = filter.typeOfGoal.first;
            result.typeOfUpdate = filter.typeOfUpdate.first;
            result.teamMember = filter.teamMember.first;
            result.timeFrom = new Date(filter.timeFrom.first);
            result.timeTo = new Date(filter.timeTo.first);
            result.teamId = filter.teamId;
            result.lastDate = new Date(filter.lastDate);
            return result;

        };
        var _prepareHistoryFilterToSend = function(filter) {
            var result = {
                teamMember: "",
                typeOfUpdate: "",
                typeOfGoal: "",
                timeFrom: "",
                timeTo: "",
                teamId: "",
                status: "",
                feedback: ""

            };
            result.typeOfGoal = filter.typeOfGoal.first;
            result.typeOfUpdate = filter.typeOfUpdate.first;
            result.teamMember = filter.teamMember.first;
            result.status = filter.status.first;
            result.feedback = filter.feedback.first;
            result.timeFrom = new Date(filter.timeFrom.first);
            result.timeTo = new Date(filter.timeTo.first);
            result.teamId = filter.teamId;
            return result;

        };
        var _loadFilterDataCheck = function(filter) {
            if (filter.teamMember.last == "" || filter.typeOfUpdate.last == "" || filter.typeOfGoal.last == "")
                return false;
            return true;
        };

        var _hipeFeed = function(feedId) {
            return $http.post(serviceBase + "api/feed/hipe", JSON.stringify(feedId)).then(function(response) {
                return response.data;
            });
        };
        feedServiceFactory.feedList = _feedList;
        feedServiceFactory.feedFilter = _filter;
        feedServiceFactory.getFeedByFilter = _getFeedByFilter;
        feedServiceFactory.getFilterGoals = _getFilterGoals;
        feedServiceFactory.getFilterUpdates = _getFilterUpdates;
        feedServiceFactory.hipeFeed = _hipeFeed;
        feedServiceFactory.sendFilter = _sendFilter;
        feedServiceFactory.sendFilterHistory = _sendFilterHistory;
        feedServiceFactory.sendFilterStatistics = _sendFilterStatistics;
        feedServiceFactory.isFilterSended = _isFilterSended;
        feedServiceFactory.checkFilterLastFirstEquals = _checkFilterLastFirstEquals;
        feedServiceFactory.getFeedFilterData = _getFeedFilterData;
        feedServiceFactory.loadFilterDataCheck = _loadFilterDataCheck;
        return feedServiceFactory;

    }
]);