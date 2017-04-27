'use strict';

(() => {

    angular
        .module('app')
        .controller('OrganizationsController', OrganizationsController);

    OrganizationsController.$inject = ['$scope', 'SearchService', 'OrganizationService'];

    function OrganizationsController($scope, SearchService, OrganizationService) {
        $scope.organizations = [];
        $scope.searchOrganization = searchOrganization;
        $scope.teamsPerOrg = [];
        $scope.orgfeedData = [];
        $scope.orgfeedInit = orgfeedInit;
        $scope.sortBy = sortBy;
        $scope.filter = filter;

        function filter(org, team){
            $scope.orgs = [];

            if(org !== ""){
                SearchService
                    .retrieveOrganization(org)
                    .then(function(res){
                        $scope.orgs = [];
                        $scope.orgs = res.data;
                    }, function(err){                    
                    })
            }

            if(team !== ""){
                SearchService
                    .retrieveTeam(team)
                    .then(function(res){
                        $scope.teams = [];
                        $scope.teams = res.data;
                    }, function(err){                    
                    })
            }

            for(var i=0; i<$scope.teams.length; i++){
                
            }
        }

        function sortBy(sortMethod){
            if(sortMethod === 'atoz'){
                sortAtoZ();   
            }else{
                sortZtoA();
            }
        }

        function sortAtoZ(){
            $scope.orgfeedData.sort(function(a, b){
                if(a.org < b.org) return -1;
                if(a.org > b.org) return 1;
                return 0;
            });
        }

        function sortZtoA(){
            $scope.orgfeedData.sort(function(a, b){
                if(a.org > b.org) return -1;
                if(a.org < b.org) return 1;
                return 0;
            });
        }

        function searchOrganization(search){
            SearchService
                .retrieveOrganization(search)
                .then(function(res){
                    $scope.organizations = [];
                    $scope.organizations = res.data;
                    console.log($scope.organizations);
                    retrieveTeams();
                }, function(err){                    
                })
        }

        function orgfeedInit(){
            SearchService
                .retrieveOrganization("")
                .then(function(res){
                    $scope.organizations = [];
                    $scope.organizations = res.data;
                    console.log($scope.organizations);
                    retrieveTeams();
                }, function(err){                    
                })
        }

        function retrieveTeams(){
            var index = 0;
            $scope.orgfeedData = [];
            for(var i=0; i< $scope.organizations.length; i++){
                OrganizationService
                    .retrieveTeams($scope.organizations[i].organization_id)
                    .then(function(res){
                        if($.isArray(res.data)){
                            var fetchedTeams = res.data;
                        }else{
                            var fetchedTeams = [];
                            fetchedTeams.push(res.data);
                        }
                        console.log(fetchedTeams);
                        index++;
                        var name = $scope.organizations[index].name;
                        console.log(name);
                        var data = {
                            org: name,
                            id: $scope.organizations[index].organization_id,
                            teams: fetchedTeams,
                            teamCount: fetchedTeams.length
                        }
                        $scope.orgfeedData.push(data);

                        sortAtoZ();
                    }, function(err){

                    });
            }
        }

    }
})();