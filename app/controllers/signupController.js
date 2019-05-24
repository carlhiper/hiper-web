"use strict";
app.directive("customOnChange", function() {
    return {
        restrict: "A",
        link: function(scope, element, attrs) {
            var onChangeFunc = scope.$eval(attrs.customOnChange);
            element.bind("change", onChangeFunc);
        }
    };
});
app.controller("signupController", [
    "$scope", "$location", "$timeout", "authService", "$state", "userProfileService", "localStorageService", function($scope, $location, $timeout, authService, $state, userProfileService, localStorageService) {

        $scope.savedSuccessfully = false;
        $scope.message = "";

        $scope.registration = {
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
                            $scope.registration.picture = e.target.result;
                            
                        });
                    };
                })(f);

                reader.readAsDataURL(f);
            }
        };


        $scope.login = function() {

            authService.login($scope.loginData).then(function(response) {

                    $location.path("/teamCreateJoin");

                },
                function(err) {
                    $scope.message = err.error_description;
                });
        };
        $scope.userName = authService.authentication.userName;
        $scope.resendConfirmation = function() {
            authService.resendConfirmation(authService.authentication.userName).then(function() {});
        };
        $scope.signUp = function() {
            $scope.savedSuccessfully = true;
            $scope.message = "Registration processed ,please wait";
            authService.saveRegistration($scope.registration).then(function(response) {

                    $scope.savedSuccessfully = true;
                    $scope.message = "User has been registered successfully, you will be redicted to login page in 2 seconds.";
                    $scope.loginData.password = $scope.registration.password;
                    $scope.loginData.userName = $scope.registration.email;
                    startTimer();

                },
                function(response) {
                    $scope.savedSuccessfully = false;
                    var errors = [];
                    for (var key in response.data.modelState) {
                        for (var i = 0; i < response.data.modelState[key].length; i++) {
                            errors.push(response.data.modelState[key][i]);
                        }
                    }
                    $scope.message = "Failed to register user due to:" + errors.join(" ");
                });
        };
        if ($state.includes("confirmation")) {
            userProfileService.getUserProfile(authService.authentication.userName).then(function(response) {
                var authData = localStorageService.get("authorizationData");
                if (authData) {
                    authData.emailConfirmed = response.data.profile.emailConfirmed;
                    localStorageService.set("authorizationData", authData);

                }
                authService.authentication.isConfirmed = response.data.profile.emailConfirmed;
                if (authService.authentication.isConfirmed) {
                    $state.transitionTo("teamCreateJoin");
                }

            });
        }
        var startTimer = function() {
            var timer = $timeout(function() {
                $timeout.cancel(timer);
                $scope.login();
            }, 2000);
        };
    }
]);