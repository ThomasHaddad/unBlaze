'use strict';

angular.module('myappApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('group', {
        url: '/group',
        templateUrl: 'app/group/group.html',
        controller: 'GroupCtrl',
        resolve:{
          groups:function(groupFactory){
            return groupFactory.query().$promise;
          }
        }
      })
      .state('group_new', {
        url: '/group/new',
        templateUrl: 'app/group/group_new.html',
        controller: function($scope, groupFactory, Auth, $state){
          $scope.userId = Auth.getCurrentUser();
          $scope.groupAdd = function(form){

            groupFactory.save({
              name:form.text,
              emails:form.email
              })
              .$promise
              .then(function(){
                $state.go('group');
              });
          };
        }
      })
      .state('group_show', {
        url: '/group/:id',
        templateUrl: 'app/group/group_show.html',
        controller: function($scope, messageFactory, messages, Auth, $state, socket){

          $scope.messages = messages;
          $scope.group = $state.params.id;

          $scope.addMessage = function(form){

            messageFactory.save({
              content: form.text,
              group : $scope.group

            }).$promise
              .then(function(){
                form.text = '';
              });
          };

          socket.syncUpdates('group_'+$scope.group ,$scope.messages);
        },
        resolve:{
          messages:function(messageFactory, $stateParams){
            return messageFactory.query({id: $stateParams.id}).$promise;
          }
        }
      });
  });
