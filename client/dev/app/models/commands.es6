(function() {
  angular.module('clickApp.services')
    .factory('commands', commandsModelFactory)
    .factory('allCommands', [
      'createModelCommand',
      'deleteModelCommand',
      'setModelSelectionCommand',
      'lockModelsCommand',
      'onModelsCommand',
      'createTemplateCommand',
      'deleteTemplateCommand',
      'lockTemplatesCommand',
      'onTemplatesCommand',
      'createTerrainCommand',
      'deleteTerrainCommand',
      'lockTerrainsCommand',
      'onTerrainsCommand',
      'rollDiceCommand',
      'rollDeviationCommand',
      'setBoardCommand',
      'setBoardDataCommand',
      'setLayersCommand',
      'setLosCommand',
      'setRulerCommand',
      'setScenarioCommand',
      'createObjectivesCommand',
      () => ({ })
    ]);

  commandsModelFactory.$inject = [];
  function commandsModelFactory() {
    const CMDS_REG = {};
    const commandsModel = {
      registerCommand: commandsRegister,
      isDice: commandsIsDice,
      executeP: commandsExecuteP,
      undoP: commandsUndoP,
      replayP: commandsReplayP,
      replayBatchP: commandsReplayBatchP
    };
    R.curryService(commandsModel);
    return commandsModel;

    function commandsRegister(name, command) {
      console.log('register command', name, command);
      CMDS_REG[name] = command;
    }
    function commandsIsDice(command) {
      return (command.type === 'rollDice' ||
              command.type === 'rollDeviation');
    }
    function commandsExecuteP(name, args, game) {
      return R.threadP(name)(
        findTypeP,
        (cmd) => cmd.executeP
          .apply(cmd, [...args, game]),
        updateCommandType
      );

      function updateCommandType([ctxt, game]) {
        return [ R.assoc('type', name, ctxt),
                 game
               ];
      }
    }
    function commandsUndoP(ctxt, game) {
      return R.threadP(ctxt)(
        findCtxtTypeP,
        (cmd) => cmd.undoP(ctxt, game)
      );
    }
    function commandsReplayP(ctxt, game) {
      return R.threadP(ctxt)(
        findCtxtTypeP,
        (cmd) => cmd.replayP(ctxt, game)
      );
    }
    function findTypeP(type) {
      return R.threadP(CMDS_REG)(
        R.prop(type),
        R.rejectIfP(R.isNil, `Game: unknown command "${type}"`)
      );
    }
    function findCtxtTypeP(ctxt) {
      return R.threadP(ctxt)(
        R.prop('type'),
        findTypeP
      );
    }
    function commandsReplayBatchP(commands, game) {
      if(R.isEmpty(commands)) {
        return R.resolveP(game);
      }
      return R.threadP(game)(
        replayNextCommand,
        recurP
      );

      function replayNextCommand(game) {
        return commandsModel.replayP(commands[0], game)
          .catch(() => game);
      }
      function recurP(game) {
        return commandsReplayBatchP(R.tail(commands), game);
      }
    }
  }
})();
