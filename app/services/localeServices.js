'use strict';
app.factory('localeService', ['$translate', 'LOCALES', '$rootScope', 'tmhDynamicLocale', '$http', function ($translate, LOCALES, $rootScope, tmhDynamicLocale, $http) {

    var localeServiceFactory = {};

    // PREPARING LOCALES INFO
    var localesObj = LOCALES.locales;

    // locales and locales display names
    var _LOCALES = Object.keys(localesObj);
    if (!_LOCALES || _LOCALES.length === 0) {
        console.error('There are no _LOCALES provided');
    }
    var _LOCALES_DISPLAY_NAMES = [];
    _LOCALES.forEach(function (locale) {
        _LOCALES_DISPLAY_NAMES.push(localesObj[locale]);
    });

    // STORING CURRENT LOCALE
    var currentLocale = $translate.proposedLanguage();// because of async loading

    // METHODS
    var checkLocaleIsValid = function (locale) {
        return _LOCALES.indexOf(locale) !== -1;
    };

    var setLocale = function (locale) {
        if (!checkLocaleIsValid(locale)) {
            console.error('Locale name "' + locale + '" is invalid');
            return;
        }
        currentLocale = locale;// updating current locale

        // asking angular-translate to load and apply proper translations
        $translate.use(locale);
    };


    var _loadUserLang = function() {
        return $http.get(serviceBase + 'api/account/GetUserProfileLanguage').then(function (response) {
            return response.data;
        });
    }
    var _saveUserLang = function(language) {
        return $http.post(serviceBase + 'api/account/SaveUserProfileLanguage',JSON.stringify(language)).then(function (response) {
            return response.data;
        });
    }

    // EVENTS
    // on successful applying translations by angular-translate
    $rootScope.$on('$translateChangeSuccess', function (event, data) {
        document.documentElement.setAttribute('lang', data.language);// sets "lang" attribute to html

        // asking angular-dynamic-locale to load and apply proper AngularJS $locale setting
        tmhDynamicLocale.set(data.language.toLowerCase().replace(/_/g, '-'));
    });


    localeServiceFactory.saveUserLang = _saveUserLang;
    localeServiceFactory.loadUserLang = _loadUserLang;
    localeServiceFactory.getLocaleDisplayName = function() {
        return localesObj[currentLocale];
    };

    localeServiceFactory.setLocaleByDisplayName = function(localeDisplayName) {
        setLocale(
            _LOCALES[
                _LOCALES_DISPLAY_NAMES.indexOf(localeDisplayName) // get locale index
            ]
        );
    };
    return localeServiceFactory;
}]);