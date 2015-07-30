'use strict';

angular.module('urvemans.urvebutton-directive', [])

  .directive('urveButton', ['$rootScope', function ($rootScope) {

    return {
      link: function (scope, elm, attrs) {
        elm.bind("click", function () {
          $rootScope.$emit('urveClick');
        })
      }
    }
  }]);
