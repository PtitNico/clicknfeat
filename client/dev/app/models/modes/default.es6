(function() {
  angular.module('clickApp.services')
    .factory('defaultMode', defaultModeModelFactory);

  defaultModeModelFactory.$inject = [
    'modes',
    'settings',
    'commonMode',
    // 'gameTemplateSelection',
    // 'gameModels',
    // 'gameModelSelection',
    'gameTerrainSelection',
  ];
  function defaultModeModelFactory(modesModel,
                                   settingsModel,
                                   commonModeModel,
                                   // gameTemplateSelectionModel,
                                   // gameModelsModel,
                                   // gameModelSelectionModel,
                                   gameTerrainSelectionModel) {
    const default_actions = Object.create(commonModeModel.actions);
    // default_actions.setModelSelection = setModelSelection;
    // default_actions.toggleModelSelection = toggleModelSelection;
    // default_actions.modelSelectionDetail = modelSelectionDetail;
    // default_actions.selectTemplate = selectTemplate;
    // default_actions.templateSelectionDetail = templateSelectionDetail;
    default_actions.selectTerrain = selectTerrain;
    // default_actions.enterRulerMode = enterRulerMode;
    // default_actions.enterLosMode = enterLosMode;
    // default_actions.dragStartMap = dragStartMap;
    // default_actions.dragMap = dragMap;
    // default_actions.dragEndMap = dragEndMap;

    const default_default_bindings = {
      enterRulerMode: 'ctrl+r',
      enterLosMode: 'ctrl+l',
      setModelSelection: 'clickModel',
      toggleModelSelection: 'ctrl+clickModel',
      modelSelectionDetail: 'rightClickModel',
      selectTemplate: 'clickTemplate',
      templateSelectionDetail: 'rightClickTemplate',
      selectTerrain: 'clickTerrain'
    };
    const default_bindings = R.extend(Object.create(commonModeModel.bindings),
                                      default_default_bindings);
    const default_buttons = [];
    const default_mode = {
      name: 'Default',
      onEnter: onEnter,
      actions: default_actions,
      buttons: default_buttons,
      bindings: default_bindings
    };
    modesModel.registerMode(default_mode);
    settingsModel.register('Bindings',
                           default_mode.name,
                           default_default_bindings,
                           (bs) => {
                             R.extend(default_mode.bindings, bs);
                           });
    return default_mode;

    // function setModelSelection(state, event) {
    //   return R.threadP()(
    //     clearTemplateSelection$(state),
    //     clearTerrainSelection$(state),
    //     () => event['click#'].target.state.stamp,
    //     (stamp) => state.eventP('Game.command.execute',
    //                             'setModelSelection',
    //                             ['set', [stamp]])
    //   );
    // }
    // function toggleModelSelection(state, event) {
    //   return R.threadP()(
    //     clearTemplateSelection$(state),
    //     clearTerrainSelection$(state),
    //     () => event['click#'].target.state.stamp,
    //     (stamp) => {
    //       if(gameModelSelectionModel.in('local', stamp,
    //                                     state.game.model_selection)) {
    //         return state.eventP('Game.command.execute',
    //                             'setModelSelection',
    //                             ['removeFrom', [stamp]]);
    //       }
    //       else {
    //         return state.eventP('Game.command.execute',
    //                             'setModelSelection',
    //                             ['addTo', [stamp]]);
    //       }
    //     }
    //   );
    // }
    // function modelSelectionDetail(state, event) {
    //   return R.threadP()(
    //     clearTemplateSelection$(state),
    //     clearTerrainSelection$(state),
    //     () => event['click#'].target.state.stamp,
    //     (stamp) => {
    //       state.queueChangeEventP('Game.selectionDetail.open',
    //                               'model', event['click#'].target);
    //       return state.eventP('Game.command.execute',
    //                           'setModelSelection', ['set', [stamp]]);
    //     }
    //   );
    // }
    // function selectTemplate(state, event) {
    //   return R.threadP()(
    //     clearTerrainSelection$(state),
    //     () => state.eventP(
    //       'Game.update', R.lensProp('template_selection'),
    //       gameTemplateSelectionModel.set$(
    //         'local',
    //         [event['click#'].target.state.stamp],
    //         state
    //       )
    //     )
    //   );
    // }
    // function templateSelectionDetail(state, event) {
    //   return R.threadP()(
    //     clearTerrainSelection$(state),
    //     () => state.eventP(
    //       'Game.update', R.lensProp('template_selection'),
    //       gameTemplateSelectionModel.set$(
    //         'local',
    //         [event['click#'].target.state.stamp],
    //         state
    //       )
    //     ),
    //     () => {
    //       state.queueChangeEventP(
    //         'Game.selectionDetail.open',
    //         'template', event['click#'].target
    //       );
    //     }
    //   );
    // }
    function selectTerrain(state, event) {
      // clearTemplateSelection(state),
      return R.over(
        R.lensPath(['game', 'terrain_selection']),
        gameTerrainSelectionModel.set$(
          'local',
          [event['click#'].target.state.stamp]
        ),
        state
      );
    }
    // function enterRulerMode(state) {
    //   return state.eventP('Modes.switchTo', 'Ruler');
    // }
    // function enterLosMode(state) {
    //   return state.eventP('Modes.switchTo', 'Los');
    // }
    // function dragStartMap(state, event) {
    //   state.queueChangeEventP('Game.dragBox.enable', event.start, event.now);
    // }
    // function dragMap(state, event) {
    //   state.queueChangeEventP('Game.dragBox.enable', event.start, event.now);
    // }
    // function dragEndMap(state, event) {
    //   state.queueChangeEventP('Game.dragBox.disable');
    //   const top_left = {
    //     x: Math.min(event.now.x, event.start.x),
    //     y: Math.min(event.now.y, event.start.y)
    //   };
    //   const bottom_right = {
    //     x: Math.max(event.now.x, event.start.x),
    //     y: Math.max(event.now.y, event.start.y)
    //   };
    //   return R.threadP(state.game)(
    //     R.prop('models'),
    //     (models) => gameModelsModel
    //       .findStampsBetweenPointsP(top_left, bottom_right, models)
    //       .catch(R.always([])),
    //     (stamps) => {
    //       if(R.isEmpty(stamps)) return null;
    //       return state.eventP('Game.command.execute',
    //                           'setModelSelection',
    //                           ['set', stamps]);
    //     }
    //   );
    // }
    function onEnter() {
      // return R.thread()(
      //   () => gameTemplateSelectionModel
      //     .checkModeP(state, state.game.template_selection),
      //   R.condErrorP([
      //     [ R.T, () => gameTerrainSelectionModel
      //       .checkModeP(state, state.game.terrain_selection) ]
      //   ]),
      //   R.condErrorP([
      //     [ R.T, () => gameModelSelectionModel
      //       .checkModeP(state, state.game.model_selection) ]
      //   ]),
      //   R.condErrorP([
      //     [ R.T, R.always(null) ]
      //   ])
      // );
    }
    // function clearTemplateSelection$(state) {
    //   return () => state.eventP(
    //     'Game.update', R.lensProp('template_selection'),
    //     gameTemplateSelectionModel.clear$('local', state)
    //   );
    // }
    // function clearTerrainSelection$(state) {
    //   return () => state.eventP(
    //     'Game.update', R.lensProp('terrain_selection'),
    //     gameTerrainSelectionModel.clear$('local', state)
    //   );
    // }
  }
})();
