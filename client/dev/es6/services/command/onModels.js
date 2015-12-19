angular.module('clickApp.services')
  .factory('onModelsCommand', [
    'commands',
    'model',
    'gameModels',
    'gameModelSelection',
    function onModelsCommandServiceFactory(commandsService,
                                           modelService,
                                           gameModelsService,
                                           gameModelSelectionService) {
      var onModelsCommandService = {
        execute: function onModelsExecute(method, ...args /*, stamps, scope, game */) {
          if('Function' !== R.type(modelService[method])) {
            return self.Promise.reject('Unknown method '+method+' on model');
          }
          
          var game = R.last(args);
          var scope = R.nth(-2, args);
          var stamps = R.nth(-3, args);
          var ctxt = {
            before: [],
            after: [],
            desc: method,
          };

          args = R.pipe(
            R.slice(0, -2),
            R.prepend(method),
            R.append(game.models)
          )(args);

          return R.pipeP(
            () => {
              return gameModelsService.onStamps$('saveState', stamps, game.models);
            },
            (before) => {
              ctxt.before = before;
              
              return gameModelsService.onStamps.apply(null, args);
            },
            () => {
              return gameModelsService.onStamps('saveState', stamps, game.models);
            },
            (after) => {
              ctxt.after = after;

              R.forEach((stamp) => {
                scope.gameEvent('changeModel-'+stamp);
              }, stamps);
              
              return ctxt;
            }
          )();
        },
        replay: function onModelsRedo(ctxt, scope, game) {
          var stamps = R.pluck('stamp', ctxt.after);
          return R.pipeP(
            gameModelsService.findAnyStamps$(stamps),
            R.addIndex(R.forEach)((model, index) => {
              if(R.isNil(model)) return;

              modelService.setState(ctxt.after[index], model);
              scope.gameEvent('changeModel-'+modelService.eventName(model));
            }),
            () => {
              game.model_selection =
                gameModelSelectionService.set('remote', stamps,
                                              scope, game.model_selection);
            }
          )(game.models);
        },
        undo: function onModelsUndo(ctxt, scope, game) {
          var stamps = R.pluck('stamp', ctxt.before);
          return R.pipeP(
            gameModelsService.findAnyStamps$(stamps),
            R.addIndex(R.forEach)((model, index) => {
              if(R.isNil(model)) return;

              modelService.setState(ctxt.before[index], model);
              scope.gameEvent('changeModel-'+modelService.eventName(model));
            }),
            () => {
              game.model_selection =
                gameModelSelectionService.set('remote', stamps,
                                              scope, game.model_selection);
            }
          )(game.models);
        }
      };
      commandsService.registerCommand('onModels', onModelsCommandService);
      return onModelsCommandService;
    }
  ]);