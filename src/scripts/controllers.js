const appControllers = angular.module('appControllers', ['ngAnimate']);

appControllers.controller('oscController', ['$scope', '$rootScope', '$http', 'Repos', 'Storage', function($scope, $rootScope, $http, Repos, Storage) {

    "use strict";

    $rootScope.noResult = null;
    $rootScope.repo = null;
    $rootScope.contributors = null;
    $scope.followers = null;


    if(Storage.getUserId() == null)
        Storage.init();

    //For debugging/testing use local data
    // $scope.followers = Storage.getFollowersByReponame("jquery");
    // let url = 'data/contributors.json';
    // Repos.fetchContributors(url).then(
    //     res => {
    //         $rootScope.contributors = res;
    //         $rootScope.repo = {name: 'jquery'};
    //         // console.log(res);
    //     }
    // );


    $rootScope.searchRepo = (event) => {
        event.preventDefault();
        var url = "https://api.github.com/search/repositories?q=" + $scope.reponame.split(' ').join('+') + '+in:name' + "&callback=JSON_CALLBACK";
        $rootScope.repo = $rootScope.noResult = $rootScope.contributors = null;
        $rootScope.loadingResults = true;
        NProgress.start();
        Repos.fetchRepo(url).then(
            res => {
                if(res == "null") {
                    $rootScope.noResult = true;
                    $rootScope.repo = {name: $scope.reponame, id: -1};
                }else{
                    $rootScope.noResult = false;
                    $rootScope.repo = res;
                }
                NProgress.done();
            }
        ).then(
            res => {
                url = "https://api.github.com/repos/"+$rootScope.repo.owner.login+"/"+$rootScope.repo.name+"/contributors";
                NProgress.start();
                Repos.fetchContributors(url).then(
                    res => {
                        if(res.length != 0){
                            $rootScope.contributors = res;
                        }else{
                            $rootScope.contributors = -1;
                        }
                        NProgress.done();
                    },
                    err => {
                        console.log("error");
                        console.log(err);
                        NProgress.done();

                    }

                )
            }
        ).then(
            res => {
                $scope.followers = Storage.getFollowersByReponame($rootScope.repo.name);
            }
        );
    }

    $scope.isFollowing = (id) => {
        return $scope.followers != null && $scope.followers.indexOf(id) != -1;
    };


}]);//oscController

appControllers.controller('followController', ['$scope', '$rootScope','$http', 'Storage', function ($scope, $rootScope, $http, Storage) {

    //Follow All Contributors
    $scope.followAll = (event) => {
        let target = event.target || event.srcElement || event.currentTarget,
            users = document.getElementById('userlist').getElementsByClassName('user');
        target.disabled = true;

        Storage.followAll($rootScope.repo.name, $rootScope.contributors);

        for(let i = 0; i < users.length; i++){
            let btn = users[i].getElementsByTagName('button')[0];
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-warning');
            btn.innerHTML = 'Following';
        }

        target.disabled = false;
        target.innerHTML = 'Following All';
        target.classList.remove('btn-danger');
        target.classList.add('btn-warning');

    };

    //Follow/unfollow contributor
    $scope.follow = (event) => {
        let target = event.target || event.srcElement || event.currentTarget,
            id = target.dataset.id,
            btnText = 'Following',
            btnClassAdd = 'btn-warning',
            btnClassRemove = 'btn-primary',
            mode;
        
        target.disabled = true;
        mode = -1;

        if(target.className.indexOf('btn-primary') != -1)
            mode = 1;

        if(mode == -1){
            btnText = 'Follow';
            btnClassAdd = 'btn-primary';
            btnClassRemove = 'btn-warning';
        }

        //Mock API call
        window.setTimeout(() => {
            target.disabled = false;
            target.innerHTML = btnText;
            target.classList.remove(btnClassRemove);
            target.classList.add(btnClassAdd);
            Storage.addFollower($rootScope.repo.name, id, mode);
        }, 500);
    }//follow

}]);//followController