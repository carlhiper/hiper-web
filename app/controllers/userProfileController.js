app.controller("userProfileController", [
    "$scope", "$state", "$location", "$uibModal", "ngAuthSettings", "$timeout", "authService", "userProfileService", "localeService", "scoreboardService", function($scope, $state, $location, $uibModal, ngAuthSettings, $timeout, authService, userProfileService, localeService, scoreboardService) {

        $scope.flagPicture = "";
        if (localeService.getLocaleDisplayName() == "Swedish") {

            $scope.flagPicture = "/content/flags/flag_sweden.png";
        } else {
            $scope.flagPicture = "/content/flags/flag_us.png";
        }

        $scope.open = function(size) {

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: "popupRemoveTeam.html",
                controller: "homeController",
                size: size,
                resolve: {
                    items: function() {
                        return $scope.items;
                    }
                }
            });

            modalInstance.result.then(function(selectedItem) {
                $scope.selected = selectedItem;
            }, function() {

            });
        };
        $scope.deleteSelectedTeams = function() {

        };
        $scope.savedSuccessfully = false;
        $scope.message = "";

        $scope.profileEdit = {
            userName: "",
            password: "",
            confirmPassword: "",
            lastName: "",
            firstName: "",
            title: "",
            nickName: "",
            picture: "",
            email: "",
            company: ""
        };
        $scope.loginData = {
            userName: "",
            password: "",
            useRefreshTokens: false
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
        $scope.selectedTeams = [];
        $scope.toggleSelection = function toggleSelection(item) {
            var idx = $scope.selectedTeams.indexOf(item);

            // is currently selected
            if (idx > -1) {
                $scope.selectedTeams.splice(idx, 1);
            }
// is newly selected
            else {
                $scope.selectedTeams.push(item);

            }
            userProfileService.selectedTeams = $scope.selectedTeams;
        };


        $scope.loadUserProfile = function() {
            if (userProfileService.selectedUserProfile == "") {
                userProfileService.selectedUserProfile = authService.authentication.userName;
            }
            userProfileService.selectedTeams = [];
            userProfileService.getUserProfile(userProfileService.selectedUserProfile).then(function(response) {
                $scope.profileData = response.data;
                $scope.profileData.profile.picture = ngAuthSettings.apiServiceBaseUri + $scope.profileData.profile.picture + "?" + new Date;
            });
        };
        $scope.editProfile = function() {
            $state.transitionTo("home.userProfileEdit");
        };
        $scope.enableEditing = function() {
            if (scoreboardService.selectedTeamUser == authService.authentication.userName)
                return false;
            return true;
        };
        $scope.changeLanguage = function() {

            if (localeService.getLocaleDisplayName() == "Swedish") {
                localeService.saveUserLang("English").then(function() {
                    localeService.setLocaleByDisplayName("English");
                    $scope.flagPicture = "/content/flags/flag_us.png";
                });

            } else {
                localeService.saveUserLang("Swedish").then(function() {
                    localeService.setLocaleByDisplayName("Swedish");
                    $scope.flagPicture = "/content/flags/flag_sweden.png";
                });
            }

        }; 
        $scope.fileSelect = function() {
            var files = event.target.files;


            for (var i = 0, f; f = files[i]; i++) {


                if (!f.type.match("image.*")) {
                    continue;
                }

                var reader = new FileReader();


                reader.onload = (function(theFile) {
                    return function(e) {
                        $timeout(function() {
                           document.getElementsByClassName("mainForm_fileText")[0].textContent = "";
                            $scope.profileEdit.picture = e.target.result;
                         
                        });
                    };
                })(f);

                reader.readAsDataURL(f);
            }
        };

        $scope.loadUserEditData = function() {
            userProfileService.getUserProfileEdit(authService.authentication.userName).then(function(response) {
                $scope.profileEdit = response.data;
                $scope.profileEdit.picture = ngAuthSettings.apiServiceBaseUri + $scope.profileEdit.picture;
            });
        };
        $scope.save = function() {
            userProfileService.saveUpdatedUserProfile($scope.profileEdit).then(function(response) {
                    userProfileService.userProfileChanged = true;
                    $scope.savedSuccessfully = true;
                    $scope.message = "User has been saved successfully.";
                },
                function(response) {
                    var errors = [];
                    for (var key in response.data.modelState) {
                        for (var i = 0; i < response.data.modelState[key].length; i++) {
                            errors.push(response.data.modelState[key][i]);
                        }
                    }
                    $scope.message = "Failed to save  user due to:" + errors.join(" ");
                });
        };
        $scope.checkUserProfileState = function() {
            return $state.includes("home.userProfile");
        };
        if ($scope.checkUserProfileState()) {
            $scope.loadUserProfile();
        } else {
            $scope.loadUserEditData();
        }

       
        $scope.$watch(function() {
            return userProfileService.teamDeleted;
        }, function() {
            if (userProfileService.teamDeleted) {
                $scope.loadUserProfile();
                userProfileService.teamDeleted = false;
            }
           

        });

    }
]);