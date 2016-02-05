(function() {
  angular.module('clickApp.controllers')
    .controller('appCtrl', appCtrl);

  appCtrl.$inject = [
    '$rootScope',
    '$state',
    'state',
    'user',
  ];
  function appCtrl($rootScope,
                   $state,
                   stateService,
                   userModel) {
    console.log('init appCtrl');

    const vm = this;
    vm.isNavHidden = isNavHidden;
    vm.stateIs = stateIs;
    vm.stateMatches = stateMatches;

    $rootScope.state = stateService.create();
    $rootScope.stateEvent = stateEvent;
    $rootScope.onStateChangeEvent = onStateChangeEvent;
    $rootScope.digestOnStateChangeEvent = digestOnStateChangeEvent;
    // $scope.reloadFactions = reloadFactions;

    // $scope.userIsValid = userIsValid;
    // $scope.checkUser = checkUser;

    $rootScope.goToState = goToState;

    activate();

    function stateEvent(...args) {
      return stateService.queueEventP(args, $rootScope.state);
    }
    function onStateChangeEvent(event, listener, scope) {
      let unsubscribe = stateService
            .onChangeEvent(event, listener, $rootScope.state);
      scope.$on('$destroy', () => { unsubscribe(); });
    }
    function digestOnStateChangeEvent(event, scope) {
      onStateChangeEvent(event, () => {
        scope.$digest();
      }, scope);
    }
    // function reloadFactions() {
    //   stateService.event('Factions.reload', $scope.state);
    // }

    // function userIsValid() {
    //   return userService.isValid($scope.state.user);
    // }
    // function checkUser() {
    //   if(!$scope.userIsValid()) {
    //     $state.go('user');
    //   }
    // }

    function isNavHidden() {
      return R.path(['current', 'data', 'hide_nav' ], $state);
    }
    function stateIs(name) {
      return $state.is(name);
    }
    function stateMatches(match) {
      return 0 <= $state.current.name.indexOf(match);
    }
    function goToState(...args) {
      self.setTimeout(() => {
        $state.go.apply($state, args);
      }, 100);
    }
    // function currentState() {
    //   return $state.current;
    // }

    function activate() {
      $rootScope.stateEvent('State.init');
      $rootScope.state.user_ready.then(checkUserOnInit);
    //   $scope.onStateChangeEvent('User.change', $scope.checkUser, $scope);
    //   $scope.digestOnStateChangeEvent('User.change', $scope);
    }
    function checkUserOnInit() {
      console.log('Checking user on init');
      if(userModel.isValid($rootScope.state.user)) return;

      $state.transitionTo('user');
    }
  }
})();
