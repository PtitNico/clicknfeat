(function() {
  angular.module('clickApp.services')
    .factory('modelLeader', modelLeaderModelFactory);

  modelLeaderModelFactory.$inject = [];
  function modelLeaderModelFactory() {
    const DSP_LENS = R.lensPath(['state','dsp']);
    return (modelModel) => {
      const modelLeaderModel = {
        isLeaderDisplayed: modelIsLeaderDisplayed,
        setLeaderDisplay: modelSetLeaderDisplay,
        toggleLeaderDisplay: modelToggleLeaderDisplay,
        renderLeader: modelRenderLeader
      };
      return modelLeaderModel;

      function modelIsLeaderDisplayed(model) {
        return !!R.find(R.equals('l'), R.viewOr([], DSP_LENS, model));
      }
      function modelSetLeaderDisplay(set, model) {
        const update = ( set
                         ? R.compose(R.uniq, R.append('l'))
                         : R.reject(R.equals('l'))
                       );
        return R.over(DSP_LENS, update, model);
      }
      function modelToggleLeaderDisplay(model) {
        const update = ( modelModel.isLeaderDisplayed(model)
                         ? R.reject(R.equals('l'))
                         : R.append('l')
                       );
        return R.over(DSP_LENS, update, model);
      }
      function modelRenderLeader({ cx, cy,
                                   radius }, state) {
        const effects = {
          l: {
            show: modelModel.isLeaderDisplayed({state}),
            link: '/data/icons/Leader.png',
            x: cx - radius * 0.7 - 5,
            y: cy - radius * 0.7 - 5
          }
        };
        return { effects };
      }
    };
  }
})();
