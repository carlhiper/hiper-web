"use strict";
app.controller("loginController", [
    "$scope", "$state", "$location", "authService", "ngAuthSettings", "userProfileService", "localStorageService", function($scope, $state, $location, authService, ngAuthSettings, userProfileService, localStorageService) {

        $scope.loginData = {
            userName: "",
            password: "",
            useRefreshTokens: false
        };
        $scope.reset = {
            email: ""
        };

        $scope.resetPassword = function() {
            authService.resetPassword($scope.reset.email).then(function(response) {
                    $scope.message = "A new password has been sent to your e-mail";
                    $scope.passwordWrong = false;
                },
                function(err) {
                    $scope.message = err.modelState.email[0];
                    $scope.passwordWrong = true;
                });
        };
        $scope.passwordWrong = false;

        $scope.message = "";

        $scope.login = function() {

            authService.login($scope.loginData).then(function(response) {

                    userProfileService.getUserProfile(authService.authentication.userName).then(function(response) {
                        var authData = localStorageService.get("authorizationData");
                        if (authData) {
                            authData.emailConfirmed = response.data.profile.emailConfirmed;
                            localStorageService.set("authorizationData", authData);

                        }
                        authService.authentication.isConfirmed = response.data.profile.emailConfirmed;

                        $state.transitionTo("home.feed");

                    });


                },
                function(err) {
                    $scope.message = err.error_description;
                    $scope.passwordWrong = true;
                });
        };

        $scope.authExternalProvider = function(provider) {

            var redirectUri = location.protocol + "//" + location.host + "/authcomplete.html";

            var externalProviderUrl = ngAuthSettings.apiServiceBaseUri + "api/Account/ExternalLogin?provider=" + provider
                + "&response_type=token&client_id=" + ngAuthSettings.clientId
                + "&redirect_uri=" + redirectUri;
            window.$windowScope = $scope;

            var oauthWindow = window.open(externalProviderUrl, "Authenticate Account", "location=0,status=0,width=600,height=750");
        };

        $scope.authCompletedCB = function(fragment) {

            $scope.$apply(function() {

                if (fragment.haslocalaccount == "False") {

                    authService.logOut();

                    authService.externalAuthData = {
                        provider: fragment.provider,
                        userName: fragment.external_user_name,
                        externalAccessToken: fragment.external_access_token
                    };

                    $location.path("/associate");

                } else {
                    //Obtain access token and redirect to orders
                    var externalData = { provider: fragment.provider, externalAccessToken: fragment.external_access_token };
                    authService.obtainAccessToken(externalData).then(function(response) {

                            $state.transitionTo("home.feed");

                        },
                        function(err) {
                            $scope.message = err.error_description;
                            $scope.passwordWrong = true;
                        });
                }

            });
        };
    }
]);
