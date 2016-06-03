angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

  .state('eKG.nodes', {
    url: '/nodes',
    views: {
      'tab1': {
        templateUrl: 'templates/nodes.html',
        controller: 'nodesCtrl'
      }
    }
  })

  .state('eKG.alarms', {
    url: '/alarms',
    views: {
      'tab2': {
        templateUrl: 'templates/alarms.html',
        controller: 'alarmsCtrl'
      }
    }
  })

  .state('eKG.timers', {
    url: '/timers',
    views: {
      'tab3': {
        templateUrl: 'templates/timers.html',
        controller: 'timersCtrl'
      }
    }
  })

  .state('eKG', {
    url: '/home',
    templateUrl: 'templates/eKG.html',
    abstract:true
  })

$urlRouterProvider.otherwise('/home/nodes')

  

});