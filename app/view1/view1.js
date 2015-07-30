'use strict';


//Cert +lön, +ups
//fest +ups
//bonus -urve, +ups
//datorer

angular.module('myApp.view1', ['ngRoute'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/view1', {
      templateUrl: 'view1/view1.html',
      controller: 'View1Ctrl'
    });
  }])


  .controller('View1Ctrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
    $scope.upgrades = [
      {
        name : "Kontorsstädning",
        effect : function(state){
          state.upsdecay += 0.05;
        },
        cost : 2
      },
      {
        name : "Kvartalsbonus",
        effect : function(state){
          state.upsdecay += 0.2;
        },
        cost : 10
      }
    ];

    $scope.employable = [
      {
        limit: 0,
        name: "Praktikant",
        cost : 10,
        pay : 9,
        ups : .1
      },
      {
        limit: 10,
        name: "Student",
        cost : 100,
        pay : 40,
        ups : .5
      },
      {
        limit: 100,
        name: "Junior Konsult",
        cost : 500,
        pay : 90,
        ups : 1
      },
      {
        limit: 500,
        name: "Projektledare",
        cost : 1000,
        pay : 180,
        ups : 2
      },
      {
        limit: 1000,
        name: "Senior Konsult",
        cost : 10000,
        pay : 90,
        ups : 3
      }
    ];

    $scope.employees = [0,0,0,0,0];

    $scope.state = {
      totalurve: 0,
      urve: 0,
      urveincr: 1,
      ups: 0,
      tick:0,
      salary:0,
      upsdecay: 1,
      employees: 0
    };


    $scope.labels = [];
    $scope.series = ['Urve', 'Ups', 'Lön'];
    $scope.data = [
      [],
      [],
      []
    ];

    function endPeriod() {

      //Pay salaries :P
      $scope.state.urve -= totalSalary();

      $scope.labels.push("A");

      $scope.data[0].push($scope.state.urve);
      $scope.data[1].push($scope.state.ups);
      $scope.data[2].push($scope.state.salary);
    }

    function totalUrvePerSecond() {
      var employees = $scope.employees;
      var ups = 0;
      for(var i = 0, l = employees.length; i < l; i++) {
        var thisUps = $scope.employable[i].ups;
        ups += (thisUps * $scope.employees[i]);
      }

      return ups;
    }

    function totalSalary() {
      var employees = $scope.employees;
      var salary = 0;
      for(var i = 0, l = employees.length; i < l; i++) {
        var thisSalary = $scope.employable[i].pay;
        salary += (thisSalary * $scope.employees[i]);
      }
      return salary;
    }

    function numEmployees() {
      return $scope.employees.reduce(function(a,b) { return a+b });
    }

    $scope.upgrade = function(n) {
      var toUpgrade = $scope.upgrades[n];

      var num = numEmployees();
      var totalCost = num * toUpgrade.cost;

      $scope.state.urve -= totalCost;

      toUpgrade.effect($scope.state);
    };

    $scope.hire = function(n) {
      var toHire = $scope.employable[n];
      var s = $scope.state;

      if(s.urve >= toHire.cost) {
        s.urve -= toHire.cost;
        $scope.employees[n] += 1;

        $scope.state.employees = numEmployees();
      }

      //Update UPS
      $scope.state.ups = Math.round(totalUrvePerSecond() * 100) / 100;
      $scope.$apply();
    };



    var gameLoop = setInterval(function() {
      //Add UPS
      var newurv = $scope.state.urve += $scope.state.ups * $scope.state.upsdecay;
      $scope.state.urve = Math.round(newurv * 100) / 100;

      //Update salary costs
      $scope.state.salary = Math.round(totalSalary() * 100) / 100;

      //Ups decays since workers get tired
      $scope.state.upsdecay -= 0.0001;


      $scope.state.tick++;

      if($scope.state.tick >= 100) {
        endPeriod();
        $scope.state.tick = 0;
      }

      //Apply scope since bound values were changed outside of digest loop
      $scope.$apply();

    },100);



    $rootScope.$on('urveClick', function () {
      $scope.state.urve += $scope.state.urveincr;
      $scope.state.totalurve += $scope.state.urveincr;

      $scope.$apply();
    })
  }]);