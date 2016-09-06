/*// app.js
var app = angular.module('profileBuilder', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('login');

  $stateProvider

  // HOME STATES AND NESTED VIEWS ========================================
  .state('login', {
    url: '/login',
    templateUrl: 'login.html'
  })

  });
  //$locationProvider.html5Mode(true);
//..controller for resgistration..//
*/

var routerApp = angular.module('profileBuilder', ['ui.router']);

routerApp.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/login');
    
    $stateProvider
        
        // HOME STATES AND NESTED VIEWS ========================================
        .state('login', {
            url: '/login',
            templateUrl: 'login.html'
        });
        
});