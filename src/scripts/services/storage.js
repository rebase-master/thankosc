toscApp.service('Storage', function(){

    var userId = null,
        following = [];

    this.init = function() {
        let id = parseInt(Math.random()*1000000);
        if (!window.localStorage.getItem('userId')) {
            window.localStorage.setItem('userId', id);
            window.localStorage.setItem('following', JSON.stringify([]));
            this.userId = id;
            this.following = [];
        }
    };

    this.addFollower = function (repoName, id, mode) {

        let flag = false,
            following = JSON.parse(window.localStorage.getItem('following'));

        for(let f of following){
            if(f.reponame == repoName){
                flag = true;
                if(mode == -1){
                    f.ids.splice(f.ids.indexOf(id), 1);
                }else{
                    f.ids.push(id);
                }
            }
        }

        if(!flag){
            following.push({reponame: repoName, ids: [id]});
        }

        window.localStorage.setItem('following', JSON.stringify(following));

    };

    this.followAll = function (reponame, contributors) {
        let flag = false,
            following = JSON.parse(window.localStorage.getItem('following')),
            result = null,
            follow,
            ids
            ;

        ids = contributors.map(obj => obj.login);

        for(let f of following){
            if(f.reponame == reponame){
                flag = true;
                f.ids = ids;
                break;
            }
        }//for

        if(!flag){
            following.push({reponame: reponame, ids: ids});
        }
        
        window.localStorage.setItem('following', JSON.stringify(following));

    };

    this.getFollowersByReponame = function (reponame) {
        let flag = false,
            following = JSON.parse(window.localStorage.getItem('following')),
            result = null;
        
        for(let f of following){
            if(f.reponame == reponame){
                flag = true;
                result = f.ids;
                break;
            }
        }//for
        
        return result;

    }
    
    this.getUserId = function(){
        return this.userId;
    };


});