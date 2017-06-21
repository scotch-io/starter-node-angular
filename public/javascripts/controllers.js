
angular.module('cs411', [])
    .directive('nameDisplay', function() {
        return {
            scope: true,
            restrict: 'EA',
            template: "<b>This can be anything {{name}}</b>"}
    })
    .controller('cs411ctrl', function($scope, $http){

        //CREATE (POST)
        $scope.createUser = function() {
            if($scope.dbID) {$scope.updateUser($scope.dbID);}
            else {
            var request = {
                method: 'post',
                url: 'http://localhost:3000/api/db',
                data: {
                    name: $scope.name,
                    UID: $scope.UID,
                    department: $scope.department
                }
            };
            $http(request)
                .then(function(response){
                    $scope.inputForm.$setPristine();
                    $scope.name = $scope.UID = $scope.department = '';
                    $scope.getUsers();
                })
            }
        }
        //READ (GET)
        $scope.getUsers = function() {
            $http.get('http://localhost:3000/api/db')
                .then(function(response){
                    $scope.users = response.data;

                })
        };
        //UPDATE (PUT)
        $scope.setUserUpdate = function(user) {
            $scope.buttonMessage = "Update User";
            $scope.h2message="Updating ";
            $scope.name=user.name;
            $scope.UID = user.UID;
            $scope.dbID = user._id;
            $scope.department=user.department;

        };
        $scope.updateUser = function (userID) {
            var request = {
                method: 'put',
                url: 'http://localhost:3000/api/db/' + userID ,
                data: {
                    name: $scope.name,
                    UID: $scope.UID,
                    department: $scope.department,
                    _id: userID
                }
            };
            $http(request)
                .then(function(response){
                    $scope.inputForm.$setPristine();
                    $scope.name = $scope.UID = $scope.department = '';
                    $scope.h2message="Add user";
                    $scope.buttonMessage = "Add User";
                    $scope.getUsers();
                    $scope.dbID = null;
                })

        };

        //DELETE (DELETE)
        $scope.deleteUser = function (_id) {

            var request = {
                method: 'delete',
                url: 'http://localhost:3000/api/db/' + _id ,
            };
            $http(request)
                .then(function(response){
                    $scope.inputForm.$setPristine();
                    $scope.name = $scope.UID = $scope.department = '';
                    $scope.getUsers();
                })

        };
      $scope.initApp = function () {
          $scope.buttonState = "create";
          $scope.h2message="Add user";
          $scope.buttonMessage = "Add User";
          $scope.getUsers();
      }
    })
    //This controller handles toggling the display of details in the user list
    .controller('listController', function ($scope){
        $scope.display = false;

        $scope.showInfo = function() {
            $scope.display = !$scope.display;
        }


    });
