
var app = angular.module("HiperApp", ['ngRoute', 'infinite-scroll', 'ui.bootstrap', 'ngCookies', 'ui-rangeSlider', "LocalStorageModule", "angular-loading-bar", "ui.router", "pascalprecht.translate", "tmh.dynamicLocale", 'gridshore.c3js.chart', 'ngSanitize']);

app.config(function($routeProvider, $stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/home");

    $stateProvider.state("home", {
            url: "/home",
          
            templateUrl: "/app/views/home.html?v3",
            controller: "homeController",
            authenticate: true

        })
        // HOME STATES AND NESTED VIEWS ========================================
        .state("home.team", {
            url: "/team",
            templateUrl: "/app/views/partial-team.html?v2",
            controller: "teamController",
            authenticate: true

        })
        .state("home.feed", {
                url: "/feed",
                parent: "home",
                templateUrl: "/app/views/partial-feed.html?v4",
                controller: "feedController",
                authenticate: true
            }
        ).state("home.scoreboard", {
                url: "/scoreboard",
                templateUrl: "/app/views/partial-scoreboard.html?v6",
                controller: "scoreboardController",
                authenticate: true
            }
        ).state("home.userProfile", {
            url: "/userProfile",
            controller: "userProfileController",
            templateUrl: "/app/views/userProfile.html?v2",
            authenticate: true
        })
        .state("home.userProfileEdit", {
            url: "/userProfileEdit",
            controller: "userProfileController",
            templateUrl: "/app/views/userProfileEdit.html?v2",
            authenticate: true
        })
        .state("login", {
            url: "/login",
            controller: "loginController",
            templateUrl: "/app/views/login.html?v2",
            authenticate: false
        }).state("confirmation", {
            url: "/confirmation",
            controller: "signupController",
            templateUrl: "/app/views/emailConfirmation.html?v2",
            authenticate: false
        })
        .state("signup", {
            url: "/signup",
            controller: "signupController",
            templateUrl: "/app/views/signup.html?v3",
            authenticate: false
        })
        .state("refresh", {
            url: "/refresh",
            controller: "refreshController",
            templateUrl: "/app/views/refresh.html?v2"
        })
        .state("tokens", {
            url: "/tokens",
            controller: "tokensManagerController",
            templateUrl: "/app/views/tokens.html?v2"
        })
        .state("associate", {
            url: "/associate",
            controller: "associateController",
            templateUrl: "/app/views/associate.html?v2"
        })
        .state("teamCreateJoin", {
            url: "/teamCreateJoin",
            controller: "teamController",
            templateUrl: "/app/views/teamCreateJoin.html?v2",
            authenticate: true
        })
        .state("teamCreate", {
            url: "/teamCreate",
            controller: "teamCreateController",
            templateUrl: "/app/views/teamCreate.html?v3",
            authenticate: true
        })
        .state("teamJoin", {
            url: "/teamJoin",
            controller: "teamJoinController",
            templateUrl: "/app/views/teamJoin.html?v2",
            authenticate: true
        })
    .state("home.goalCreate", {
        url: "/goalCreate",
        controller: "goalCreateController",
        templateUrl: "/app/views/createGoal.html?v4",
        authenticate: true
    })
         .state("home.goal", {
             url: "/goal",
             controller: "goalController",
             templateUrl: "/app/views/goal.html?v2",
             authenticate: true
         })
    .state("home.scoreboardStatistics", {
        url: "/scoreboardStatistics",
        controller: "scoreboardController",
        templateUrl: "/app/views/scoreboard-statistics.html?v2",
        authenticate: true
    }).state("home.scoreboardHistory", {
        url: "/scoreboardHistory",
        controller: "scoreboardController",
        templateUrl: "/app/views/scoreboard-history.html?v2",
        authenticate: true
    });

    $routeProvider.otherwise({ redirectTo: "/home" });

});

//var serviceBase = "http://hiperdevapi.azurewebsites.net/";
//var serviceBase = "http://localhost:46243/";
var serviceBase = "http://localhost/Hiper.Api/";
//var serviceBase = "http://hiperdevapieu.azurewebsites.net/";
//var serviceBase = "http://hiperliveapi.azurewebsites.net/";
app.constant("ngAuthSettings", {
    apiServiceBaseUri: serviceBase,
    clientId: "ngAuthApp"
});

app.config(function($httpProvider) {
    $httpProvider.interceptors.push("authInterceptorService");
});
app.constant('LOCALES', {
    'locales': {
        'sv_SE': 'Swedish',
        'en_US': 'English'
    },
    'preferredLocale': 'en_US'
});
app.filter('html', [
    '$sce', function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        };
    }
]);
app.config(function($translateProvider) {
  //  $translateProvider.useMissingTranslationHandlerLog();
});
app.config(function($translateProvider) {
    $translateProvider.useStaticFilesLoader({
        prefix: serviceBase + 'api/Locale/json/', // path to translations files
        suffix: '.json' // suffix, currently- extension of the translations
    });
    $translateProvider.preferredLanguage('en_US'); // is applied on first load
    $translateProvider.useLocalStorage(); // saves selected language to localStorage
});
app.config(function(tmhDynamicLocaleProvider) {
    tmhDynamicLocaleProvider.localeLocationPattern('app/resources/angular-locale_{{locale}}.js');
});
app.run(function($rootScope, $state, authService) {
    authService.fillAuthData();
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
        if (toState.authenticate && !authService.authentication.isAuth) {
            // User isn’t authenticated
            $state.transitionTo("login");
            event.preventDefault();
        }
        if (toState.authenticate && !authService.authentication.isConfirmed && authService.authentication.isAuth) {
            $state.transitionTo("confirmation");
            event.preventDefault();
        }
    });
});

