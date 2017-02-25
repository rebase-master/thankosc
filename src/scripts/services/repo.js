angular.module('api.repos', [])
    .service('Repos', function ($http, $q) {

        this.fetchRepo = function (url) {

            var deferred = $q.defer();

            $http({
                method: 'JSONP',
                url: url,
                cache: true
            }).success(function (response) {
                console.log("repos: \n");
                console.log(response);
                if (response.data.items.length != 0) {
                    deferred.resolve(response.data.items.pop());
                } else {
                    deferred.resolve("null");
                }

            }).error(function () {
                deferred.reject('Error fetching data from GitHub!');
            });
            return deferred.promise;
        }//fetchRepo

        this.fetchContributors = function (url) {

            var deferred = $q.defer();

            $http({
                method: 'GET',
                url: url,
                cache: true
            }).success(function (response) {
                deferred.resolve(response);
            }).error(function () {
                deferred.reject('Error fetching data from GitHub!');
            });
            return deferred.promise;
        }

    });
