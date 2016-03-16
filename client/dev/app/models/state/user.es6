(function() {
  angular.module('clickApp.services')
    .factory('stateUser', stateUserServiceFactory);

  stateUserServiceFactory.$inject = [
    'user',
    'userConnection',
    'prompt',
  ];
  function stateUserServiceFactory(userModel,
                                   userConnectionModel,
                                   promptService) {
    const stateUserModel = {
      create: stateUserCreate,
      save: stateUserSave,
      onStateInit: stateUserOnInit,
      onUserSet: stateUserOnSet,
      onUserToggleOnline: stateOnUserToggleOnline,
      onUserSendChatMsg: stateOnUserSendChatMsg,
      onUserConnectionClose: stateOnUserConnectionClose,
      onUserSetOnlineUsers: stateOnUserSetOnlineUsers,
      onUserSetOnlineGames: stateOnUserSetOnlineGames,
      onUserNewChatMsg: stateOnUserNewChatMsg
    };
    const setUser$ = R.curry(setUser);
    R.curryService(stateUserModel);
    return stateUserModel;

    function stateUserCreate(state) {
      state.user = {};
      state.user_ready = new self.Promise((resolve) => {
        state.onEvent('State.init',
                      stateUserModel.onStateInit$(state, resolve));
      });

      state.onEvent('User.set',
                    stateUserModel.onUserSet$(state));
      state.onEvent('User.toggleOnline',
                    stateUserModel.onUserToggleOnline$(state));
      state.onEvent('User.sendChatMsg',
                    stateUserModel.onUserSendChatMsg$(state));
      state.onEvent('User.connection.close',
                    stateUserModel.onUserConnectionClose$(state));
      state.onEvent('User.setOnlineUsers',
                    stateUserModel.onUserSetOnlineUsers$(state));
      state.onEvent('User.setOnlineGames',
                    stateUserModel.onUserSetOnlineGames$(state));
      state.onEvent('User.newChatMsg',
                    stateUserModel.onUserNewChatMsg$(state));

      return state;
    }
    function stateUserSave(state) {
      if(state._user === state.user) return null;
      state._user = state.user;
      return userModel.save(state.user);
    }
    function stateUserOnInit(state, ready, _event_) {
      return R.threadP(state)(
        userModel.initP,
        setUser$(state),
        () => { state.user_ready.fulfilled = true; },
        ready
      );
    }
    function stateUserOnSet(state, _event_, user_state) {
      return R.threadP(state.user)(
        R.assoc('state', user_state),
        userModel.checkOnlineP$(state),
        setUser$(state)
      );
    }
    function stateOnUserToggleOnline(state, _event_) {
      return R.threadP(state.user)(
        userModel.toggleOnlineP$(state),
        setUser$(state)
      );
    }
    function stateOnUserSendChatMsg(state, _event_, chat) {
      return userConnectionModel
        .sendChatP$(chat, state.user);
    }
    function stateOnUserConnectionClose(state, _event_) {
      return R.threadP(state.user)(
        userModel.online,
        R.rejectIf(R.not, 'User not online when connection close'),
        () => promptService
          .promptP('alert','Server connection lost.')
          .catch(R.always(null)),
        () => userModel.toggleOnlineP(state, state.user),
        setUser$(state)
      );
    }
    function stateOnUserSetOnlineUsers(state, _event_, users) {
      return R.thread(state.user)(
        R.assocPath(['connection','users'], users),
        setUser$(state)
      );
    }
    function stateOnUserSetOnlineGames(state, _event_, games) {
      return R.thread(state.user)(
        R.assocPath(['connection','games'], games),
        setUser$(state)
      );
    }
    function stateOnUserNewChatMsg(state, _event_, msg) {
      state.queueChangeEventP('User.chat', msg);
      return R.thread(state.user)(
        R.over(R.lensPath(['connection','chat']), R.pipe(
          R.defaultTo([]),
          R.append(msg)
        )),
        setUser$(state)
      );
    }
    function setUser(state, user) {
      state.user = user;
      console.log('stateSetUser', state.user);
      state.queueChangeEventP('User.change');
    }
  }
})();
