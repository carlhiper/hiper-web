'use strict';
app.factory('modalService', ['$translate','LOCALES','$rootScope','tmhDynamicLocale','$modal',   function ($translate, LOCALES, $rootScope, tmhDynamicLocale,$modal) {


        var _modalDefaults = {
            backdrop: true,
            keyboard: true,
            modalFade: true,
            templateUrl: '/app/views/popups/modal.html'
        };

        var _modalOptions = {
            closeButtonText: 'Close',
            actionButtonText: 'OK',
            headerText: 'Proceed?',
            bodyText: 'Perform this action?'
        };


    var _okModal = '';

    var _showSurveyModal = function (customModalDefaults, customModalOptions) {
        if (!customModalDefaults) customModalDefaults = {};
        customModalDefaults.backdrop = 'static';
        return _showSurvey(customModalDefaults, customModalOptions);
    };
    var _showSurvey =  function (customModalDefaults, customModalOptions) {
        //Create temp objects to work with since we're in a singleton service
        var tempModalDefaults = {};
        var tempModalOptions = {};

        //Map angular-ui modal custom defaults to modal defaults defined in service
        angular.extend(tempModalDefaults, _modalDefaults, customModalDefaults);

        //Map modal.html $scope custom properties to defaults defined in service
        angular.extend(tempModalOptions, _modalOptions, customModalOptions);

        if (!tempModalDefaults.controller) {
            tempModalDefaults.controller = function ($scope, $modalInstance) {
                $scope.modalOptions = tempModalOptions;
                $scope.modalOptions.ok = function (result) {
                    if (tempModalDefaults.scope.selectedSurveysNo.length + tempModalDefaults.scope.selectedSurveysYes.length == 4) {

                          
                        tempModalDefaults.scope.surveyErrorMessage = "";
                        tempModalDefaults.scope.surveysAllChecked = true;
                        $modalInstance.close(result);
                    } else {
                        tempModalDefaults.scope.surveyErrorMessage = "All questions must have a checkbox set";
                        tempModalDefaults.scope.surveysAllChecked = false;
                    }
                       
                };
                 
                $scope.modalOptions.close = function (result) {
                    $modalInstance.dismiss('cancel');
                };
                  

            }
        }

        return $modal.open(tempModalDefaults).result;
    };
    var _showModal = function (customModalDefaults, customModalOptions) {
            if (!customModalDefaults) customModalDefaults = {};
            customModalDefaults.backdrop = 'static';
            return _show(customModalDefaults, customModalOptions);
        };

        var _show = function (customModalDefaults, customModalOptions) {
            //Create temp objects to work with since we're in a singleton service
            var tempModalDefaults = {};
            var tempModalOptions = {};

            //Map angular-ui modal custom defaults to modal defaults defined in service
            angular.extend(tempModalDefaults, _modalDefaults, customModalDefaults);

            //Map modal.html $scope custom properties to defaults defined in service
            angular.extend(tempModalOptions, _modalOptions, customModalOptions);

            if (!tempModalDefaults.controller) {
                tempModalDefaults.controller = function ($scope, $modalInstance) {
                    $scope.modalOptions = tempModalOptions;
                    $scope.modalOptions.ok = function (result) {
                      
                            $modalInstance.close(result);
                       
                       
                    };
                 
                    $scope.modalOptions.close = function (result) {
                        $modalInstance.dismiss('cancel');
                    };
                  

                }
            }

            return $modal.open(tempModalDefaults).result;
        };

        var modalServiceFactory = {};
        modalServiceFactory.showModal = _showModal;
        modalServiceFactory.showSurveyModal = _showSurveyModal;
    modalServiceFactory.showSurveyModal = _showSurveyModal;
        modalServiceFactory.modalDefaults = _modalDefaults;
        modalServiceFactory.modalOptions = _modalOptions;
    modalServiceFactory.okClick = _okModal;
  
    return modalServiceFactory;

}]);