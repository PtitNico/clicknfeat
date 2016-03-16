(function() {
  angular.module('clickApp.directives')
    .controller('userChatCtrl', userChatCtrl)
    .directive('clickUserChat', userChatDirectiveFactory);

  userChatDirectiveFactory.$inject = [];
  function userChatDirectiveFactory() {
    return {
      restrict: 'E',
      templateUrl: 'app/components/user_chat/user_chat.html',
      scope: true,
      controller: 'userChatCtrl',
      controllerAs: 'user_chat',
      link: () => { }
    };
  }

  userChatCtrl.$inject = [
    '$scope',
  ];
  function userChatCtrl($scope) {
    const vm = this;
    const state = $scope.state;
    console.log('userChatCtrl', $scope.state.user);

    vm.userIsInRecipients = userIsInRecipients;
    vm.doToggleRecipient = doToggleRecipient;
    vm.doSetAllRecipients = doSetAllRecipients;
    vm.doSetRecipientsFromChat = doSetRecipientsFromChat;

    vm.canSendChatMsg = canSendChatMsg;
    vm.doSendChatMsg = doSendChatMsg;
    vm.doBroadcastChatMsg = doBroadcastChatMsg;

    activate();

    function activate() {
      vm.chat = {
        msg: '',
        to: []
      };
      $scope.onStateChangeEvent('User.change', updateUser, $scope);
      self.window.requestAnimationFrame(updateUser);
    }
    function updateUser() {
      vm.user = R.clone(state.user);
      console.warn('updateUser', vm.user, state.user);
      $scope.$digest();
    }
    function setChatRecipients(to) {
      vm.chat.to = R.reject(R.equals(state.user.state.stamp), to);
    }
    function userIsInRecipients(stamp) {
      return R.find(R.equals(stamp), vm.chat.to);
    }
    function doToggleRecipient(stamp) {
      if(vm.userIsInRecipients(stamp)) {
        setChatRecipients(R.reject(R.equals(stamp), vm.chat.to));
      }
      else {
        setChatRecipients(R.append(stamp, vm.chat.to));
      }
    }
    function doSetAllRecipients() {
      setChatRecipients(R.pluck('stamp', state.user.connection.users));
    }
    function doSetRecipientsFromChat(chat) {
      setChatRecipients(R.thread(chat)(
        R.prop('to'),
        R.append(R.prop('from', chat)),
        R.uniq
      ));
    }

    function chatMsgIsValid() {
      return R.length(s.strip(vm.chat.msg)) > 0;
    }
    function canSendChatMsg() {
      return ( !R.isEmpty(vm.chat.to) &&
               chatMsgIsValid()
             );
    }
    function doSendChatMsg() {
      if(!vm.canSendChatMsg()) return;

      R.threadP()(
        () => $scope.stateEvent('User.sendChatMsg', vm.chat),
        () => {
          vm.chat.msg = '';
          $scope.$digest();
        }
      );
    }
    function doBroadcastChatMsg() {
      setChatRecipients(R.pluck('stamp', state.user.connection.users));
      vm.doSendChatMsg();
    }
  }
})();
