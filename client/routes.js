angular.module("socially").run(["$rootScope", "$location", function($rootScope, $location) {
  $rootScope.$on("$stateChangeError", function(event, next, previous, error) {
    // We can catch the error thrown when the $requireUser promise is rejected
    // and redirect the user back to the main page
    if (error === "AUTH_REQUIRED") {
      $location.path("/parties");
    }
  });
}]);

angular.module("socially").config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
  function($urlRouterProvider, $stateProvider, $locationProvider){

    $locationProvider.html5Mode(true);

    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'client/users/views/login.ng.html',
        controller: 'LoginCtrl',
        controllerAs: 'lc'
      })
      .state('register',{
        url: '/register',
        templateUrl: 'client/users/views/register.ng.html',
        controller: 'RegisterCtrl',
        controllerAs: 'rc'
      })
      .state('resetpw', {
        url: '/resetpw',
        templateUrl: 'client/users/views/reset-password.ng.html',
        controller: 'ResetCtrl',
        controllerAs: 'rpc'
      })
      .state('logout', {
        url: '/logout',
        resolve: {
          "logout": ['$meteor', '$state', function($meteor, $state) {
            return $meteor.logout().then(function(){
              $state.go('parties');
            }, function(err){
              console.log('logout error - ', err);
            });
          }]
        }
      })
      .state('parties', {
        url: '/parties',
        templateUrl: 'client/parties/views/parties-list.ng.html',
        controller: 'PartiesListCtrl'
      })
      .state('partyDetails', {
        url: '/parties/:partyId',
        templateUrl: 'client/parties/views/party-details.ng.html',
        controller: 'PartyDetailsCtrl',
        resolve: {
          "currentUser": ["$meteor", function($meteor){
            return $meteor.requireUser();
          }]
        }
      });

    $urlRouterProvider.otherwise("/parties");
  }]);