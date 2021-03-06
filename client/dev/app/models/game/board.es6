(function() {
  angular.module('clickApp.services')
    .factory('gameBoard', gameBoardModelFactory);

  gameBoardModelFactory.$inject = [
    'appError',
    'http',
  ];
  function gameBoardModelFactory(appErrorService,
                                 httpService) {
    const gameBoardModel = {
      initP: gameBoardInitP,
      name: gameBoardName,
      forName: gameBoardForName
    };
    R.curryService(gameBoardModel);
    return gameBoardModel;

    function gameBoardInitP() {
      return httpService
        .getP('/data/boards.json')
        .catch((error) => {
          appErrorService.emit('Error getting boards.json', error);
          return [];
        });
    }
    function gameBoardName(board) {
      return R.prop('name', board);
    }
    function gameBoardForName(name, boards) {
      return R.find(R.propEq('name', name), boards);
    }
  }
})();
