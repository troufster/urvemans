'use strict';


angular.module('myApp.view1', ['ngRoute'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/view1', {
      templateUrl: 'view1/view1.html',
      controller: 'View1Ctrl'
    });
  }])


  .controller('View1Ctrl', ['$scope', '$rootScope', function ($scope, $rootScope) {

    $scope.employable = [
      {
        limit: 2,
        name: "Ica-tiggare",
        cost : 10,
        pay : 1,
        ups : .1
      },
      {
        limit: 3,
        name: "Samhall-lodis",
        cost : 25,
        pay : 3,
        ups : .5
      },
      {
        limit: 4,
        name: "Student",
        cost : 50,
        pay : 10,
        ups : 1
      }
    ];

    $scope.employees = [0,0,0];

    $scope.state = {
      totalurve: 0,
      urve: 0,
      urveincr: 1,
      ups: 0
    };

    function totalUrvePerSecond() {
      var employees = $scope.employees;
      var ups = 0;
      for(var i = 0, l = employees.length; i < l; i++) {
        var thisUps = $scope.employable[i].ups;
        ups += (thisUps * $scope.employees[i]);
      }

      return ups;
    }

    $scope.hire = function(n) {
      var toHire = $scope.employable[n];
      var s = $scope.state;

      if(s.urve >= toHire.cost) {
        s.urve -= toHire.cost;
        $scope.employees[n] += 1;
      }

      //Update UPS
      $scope.state.ups = totalUrvePerSecond()
    };



    var gameLoop = setInterval(function() {
      //Add UPS
      var newurv = $scope.state.urve += $scope.state.ups;
      $scope.state.urve = Math.round(newurv * 100) / 100

      //Apply scope since bound values were changed outside of digest loop
      $scope.$apply();
    },1000);

    function urveChanged() {
    }

    $rootScope.$on('urveClick', function () {
      $scope.state.urve += $scope.state.urveincr;
      $scope.state.totalurve += $scope.state.urveincr;

      urveChanged();
      $scope.$apply();
    })
  }]);