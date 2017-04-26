'use strict';

(() => {

    angular
        .module('app')
        .controller('GameFeedController', GameFeedController);

    GameFeedController.$inject = ['$scope', '$routeParams', 'GameService', 'SearchService', 'OrganizerService', 'UserService'];

    function GameFeedController($scope, $routeParams, GameService, SearchService, OrganizerService, UserService){
        $scope.games = [];
        $scope.column1 = [];
        $scope.column2 = [];
        $scope.column3 = [];
        $scope.gamefeedInit = gamefeedInit;
        $scope.addGame = addGame;
        $scope.setPending = setPending;
        $scope.deleteGame = deleteGame;
        $scope.editGame = editGame;

        UserService.getUserInfo()
        .then((res) => {
            $scope.user = res.data;
        }, (err) => {
            console.log('game feed get current user error', err);
            Materialize.toast('Error getting user data.', 2000);
        });

        function gamefeedInit(){
            $scope.games = [];
            $scope.column1 = [];
            $scope.column2 = [];
            $scope.column3 = [];
            retrieveGames();
        }

        function retrieveGames() {
            GameService
                .viewAllGames()
                .then(function(res) {
                    $scope.games = res.data;
                    sortBy();

                }, function(err) {
                    console.log(err);
                    // Materialize.toast('', 3000);
                })
        }

        function sortBy(value){
            console.log("joiurishs")
            console.log(value)
            // sort the games
            if(value == "true"){
                sortByName();
            }else{
                sortByDate();
            }
        }

        function sortByName(){
            $scope.games.sort(function(a, b){
                if(a.name < b.name) return -1;
                if(a.name > b.name) return 1;
                return 0;
            });

            distributeGame();
        }

        function sortByDate(){
            $scope.games.sort(function(a, b){
                var aDate = new Date(a.start_date);
                var bDate = new Date(b.start_date);
                var currentDate = new Date(Date.now());

                var integerADate = aDate.getFullYear() * 10000 + aDate.getMonth() * 100 + aDate.getDay();
                var integerBDate = bDate.getFullYear() * 10000 + bDate.getMonth() * 100 + bDate.getDay();

                return (currentDate - integerADate > currentDate - integerBDate ? a : b);
            });
            distributeGame();
        }

        function distributeGame(){
            for (var i = 0; i < $scope.games.length; i++) {
                if(i%3 == 0){
                    $scope.column1.push($scope.games[i]);
                }
                else if(i%3 == 1){
                    $scope.column2.push($scope.games[i]);
                }
                else if(i%3 == 2){
                    $scope.column3.push($scope.games[i]);
                }
            }
        }

        function searchGame() {
            SearchService
                .retrieveGames($scope.thisGame.game_id)
                .then(function(res) {
                    $scope.sports = res.data;
                }, function(err) {
                    console.log(err);
                    Materialize.toast('Failed to retrieve sports!', 3000);
                })
        }

        function searchGame(search){
            SearchService
                .retrieveGame(search)
                .then(function(res){
                    $scope.games = res.data;
                    retrieveGames("false");
                }, function(err){

                })
        }

        function resetModalData() {
            $scope.gameName = null;
            $scope.location = null;
            $scope.startDate = null;
            $scope.endDate = null;
            $scope.description = null;
        }

        function checkModalData() {
            return $scope.gameName != null
            && $scope.gameName.trim() != ''
            && $scope.location != null
            && $scope.location.trim() != ''
            && $scope.startDate != null
            && $scope.endDate != null
            && $scope.description != null
            && $scope.description.trim() != '';
        }

        function setPending(game) {
            $scope.pending = game;
        }

        function addGame() {
            if (!checkModalData()) {
                Materialize.toast('Fill in all fields', 2000)
                return;
            }

            const game = {
                orgID: $scope.user.id,
                gameName: $scope.gameName,
                startDate: $scope.startDate,
                endDate: $scope.endDate,
                locat: $scope.locat,
                descrip: $scope.description
            };

            OrganizerService.addGame(game)
            .then((res) => {
                Materialize.toast('Game added', 2000);
                resetModalData();
                gamefeedInit();
            }, (err) => {
                Materialize.toast('An error occured', 2000);
            });
        }

        function deleteGame() {
            OrganizerService.deleteGame($scope.pending.game_id)
            .then((res) => {
                Materialize.toast('Game deleted', 2000);
                gamefeedInit();
                $scope.pending = null;
            }, (err) => {
                Materialize.toast('An error occured', 2000);
            });
        }

        function editGame() {
            // If a field is empty, use previous value
            let name = $scope.gameName == null
                || $scope.gameName.trim() == ''
                ? $scope.pending.name : $scope.gameName;

            let location = $scope.location == null
                || $scope.location.trim() == ''
                ? $scope.pending.location : $scope.location;

            let description = $scope.description == null
                || $scope.description.trim() == ''
                ? $scope.pending.description : $scope.description;

            let startDate = $scope.startDate == null
                ? $scope.pending.start_date : $scope.startDate;

            let endDate = $scope.endDate == null
                ? $scope.pending.end_date : $scope.endDate;

            const game = {
                gameId: $scope.pending.game_id,
                name: name,
                startDate: startDate,
                endDate: endDate,
                location: location,
                description: description
            };

            OrganizerService.updateGame(game)
            .then((res) => {
                Materialize.toast('Game edited', 2000);
                resetModalData();
                gamefeedInit();
                $scope.pending = null;
            }, (err) => {
                Materialize.toast('An error occured', 2000);
            });
        }
    }
})();
