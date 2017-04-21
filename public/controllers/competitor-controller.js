'use strict';

(() => {

    angular
        .module('app')
        .controller('CompetitorController', CompetitorController);

    CompetitorController.$inject = ['$scope', '$window', '$routeParams', 'CompetitorService', 'UserService'];

    function CompetitorController($scope, $window, $routeParams, CompetitorService, UserService) {
        $scope.thisCompetitor = {
            competitor_id: $routeParams.id
        };
        $scope.competitor = {};
        $scope.competitorteams = {};
        $scope.coachedteam = {};

        $scope.searchCompetitor = searchCompetitor;
        $scope.getCompetitor = getCompetitor;
        $scope.getCompetitorTeams = getCompetitorTeams;
        $scope.editCompetitor = editCompetitor;
        $scope.editCompetitorBio = editCompetitorBio;
        $scope.createTeam = createTeam;
        $scope.getCoachedTeam = getCoachedTeam;

        function searchCompetitor(id){
            CompetitorService
                .searchCompetitor($scope.thisCompetitor.competitor_id)
                .then(function(res) {
                    console.log(res.data);
                    $scope.competitor = res.data;
                }, function(err) {
                    console.log(err);
                })
        }

        function getCompetitor(){
            UserService
                .getUserInfo()
                .then(function(res) {
                    $scope.competitor = res.data;
                    if($scope.competitor == []) {
                        $window.location.href = '/';
                    }
                }, function(err) {
                    console.log(err);
                })
        }

        function getCompetitorTeams(){
            CompetitorService
                .getCompetitorTeams()
                .then(function(res) {
                    $scope.competitorteams = res.data;
                    // console.log($scope.competitorteams);
                }, function(err) {
                    console.log(err);
                })
        }

        function editCompetitor(){
            CompetitorService
                .editCompetitor($scope.competitor)
                .then(function (res){
                    Materialize.toast('Successfully edited!', 3000);
                    // $window.location.href = '/#/competitor/profile';
                }, function(err) {
                    console.log(err);
                })
        }


        function editCompetitorBio(){
            CompetitorService
                .editCompetitorBio($scope.competitor)
                .then(function (res){
                    Materialize.toast('Successfully edited bio!', 3000);
                    //$window.location.href = '/#/competitor/profile';
                }, function(err) {
                    console.log(err);
                })
        }

        function createTeam(){
            CompetitorService
                .createTeam($scope.competitor)
                .then(function (res){
                    Materialize.toast('Successfully created a team!', 3000);
                    //$window.location.href = '/#/competitor/profile';
                }, function(err) {
                    console.log(err);
                })
        }

        function getCoachedTeam(){
            CompetitorService
                .getCoachedTeam()
                .then(function (res){
                    // console.log(res.data);
                    $scope.coachedteam = res.data;
                }, function(err) {
                    console.log(err);
                })
        }

    }
})();