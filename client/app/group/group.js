'use strict';

angular.module('myappApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('group', {
        url: '/group',
        templateUrl: 'app/group/group.html',
        controller: 'GroupCtrl',
        resolve:{
          groups:function(groupFactory,Auth){
            var user = Auth.getCurrentUser();
            return groupFactory.query({userId:user._id}).$promise;
          }
        }
      })
      .state('group_add',{
        url:'/group/new',
        templateUrl: 'app/group/group_new.html',
        controller: function($scope, $state,groupFactory,Auth){
          $scope.user = Auth.getCurrentUser();
          $scope.groupAdd = function(form){
            console.log(form);
            groupFactory.save({userId:$scope.user._id,name:form.groupName,_creator:$scope.user._id,emails:form.emails,users:[$scope.user._id]}).$promise
              .then(function(){
                $state.go('group');
              })
          }
        }
      });
  });
