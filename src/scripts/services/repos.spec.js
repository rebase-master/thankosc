// Be descriptive with titles here. The describe and it titles combined read like a sentence.
describe('Repos Service', function() {

    var service,
        controller,
        $httpBackend,
        $scope
        ;


    //To check if testing framework is working fine
    it('has a dummy spec to test 2 + 2', function() {
        expect(2+2).toEqual(4);
    });

    // Before each test load our api.users module
    beforeEach(angular.mock.module('api.repos'));

    // Before each test set our injected service and other dependencies to our local Users variable
    beforeEach(inject(function(_Repos_, _$rootScope_, _$controller_, _$httpBackend_) {
        service = _Repos_;
        $httpBackend = _$httpBackend_;
        controller = _$controller_;
        $scope = _$rootScope_.$new();
    }));

    // A simple test to verify the service exists
    it('should exist', function() {
        expect(service).toBeDefined();
    });

    it("should search github api by repo name", function () {
        var url = "https://api.github.com/search/repositories?q=jquery+in:name&callback=JSON_CALLBACK";
        $httpBackend.whenGET(url).respond(200);
        // service.fetchRepo(url)
        //     .then(function(data){
        //         expect(data.length).toEqual(30);
        //     });
        // $scope.$apply();
        // $httpBackend.flush();
    });



});