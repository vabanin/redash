import { Paginator } from '@/lib/pagination';
import template from './list.html';

function GroupsCtrl($scope, $uibModal, currentUser, Events, Group) {
  Events.record('view', 'page', 'groups');
  $scope.currentUser = currentUser;
  $scope.groups = new Paginator([], { itemsPerPage: 20 });
  Group.query((groups) => {
    $scope.groups.updateRows(groups);
  });

  $scope.newGroup = () => {
    $uibModal.open({
      component: 'editGroupDialog',
      size: 'sm',
      resolve: {
        group() {
          return new Group({});
        },
      },
    });
  };
}

export default function init(ngModule) {
  ngModule.controller('GroupsCtrl', GroupsCtrl);

  return {
    '/groups': {
      template,
      controller: 'GroupsCtrl',
      title: 'Groups',
    },
  };
}
