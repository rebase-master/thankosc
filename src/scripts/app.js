var toscApp = angular.module('toscApp', [
    'ngRoute',
    'appControllers',
    'api.repos'
]);

toscApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
    when('/', {
        templateUrl: 'views/list.html',
        controller: 'oscController'
    }).
    otherwise({
        redirectTo: '/'
    });
}]);
