'use strict';

self.modelServiceFactory = function modelServiceFactory(settingsService,
                                                        pointService,
                                                        gameFactionsService) {
  var DEFAULT_MOVES = {
    Move: 10,
    MoveSmall: 1,
    Rotate: 60,
    RotateSmall: 6,
    Shift: 10,
    ShiftSmall: 1,
  };
  var MOVES = R.clone(DEFAULT_MOVES);
  settingsService.register('Moves',
                           'Model',
                           DEFAULT_MOVES,
                           function(moves) {
                             R.extend(MOVES, moves);
                           });
  var modelService = {
    create: function modelCreate(factions, temp) {
      if(R.isNil(gameFactionsService.getModelInfo(temp.info, factions))) {
        console.log('create unknown model '+temp.info.join('.'));
        return;
      }
      var model = {
        state: {
          x: 0, y: 0, r: 0,
          img: 0,
          dsp: ['i'],
          l: [],
          stamp: R.guid()
        }
      };
      model.state = R.deepExtend(model.state, temp);
      return model;
    },
    eventName: function modelEventName(model) {
      return R.path(['state','stamp'], model);
    },
    state: function modelState(model) {
      return R.prop('state', model);
    },
    saveState: function modelSaveState(model) {
      return R.clone(R.prop('state', model));
    },
    setState: function modelSetState(state, model) {
      model.state = R.clone(state);
    },
    isBetweenPoints: function modelIsBetweenPoints(top_left, bottom_right, model) {
      return ( top_left.x <= model.state.x && model.state.x <= bottom_right.x &&
               top_left.y <= model.state.y && model.state.y <= bottom_right.y
             );
    },
    isImageDisplayed: function modelIsImageDisplayed(model) {
      return !!R.find(R.eq('i'), model.state.dsp);
    },
    getImage: function modelGetImage(factions, model) {
      var info = gameFactionsService.getModelInfo(model.state.info, factions);
      var link = modelService.isImageDisplayed(model) ? info.img[model.state.img].link : null;
      return R.assoc('link', link, info.img[model.state.img]);
    },
    setNextImage: function modelSetNextImage(factions, model) {
      var info = gameFactionsService.getModelInfo(model.state.info, factions);
      var next_img = (model.state.img >= info.img.length-1) ? 0 : model.state.img+1;
      model.state = R.assoc('img', next_img, model.state);
    },
    toggleImageDisplay: function modelToggleImageDisplay(model) {
      if(modelService.isImageDisplayed(model)) {
        model.state.dsp = R.reject(R.eq('i'), model.state.dsp);
      }
      else {
        model.state.dsp = R.append('i', model.state.dsp);
      }
    },
    // checkState: function modelCheckState(state) {
    //   state.x = Math.max(0, Math.min(480, state.x));
    //   state.y = Math.max(0, Math.min(480, state.y));
    //   return state;
    // },
    // setPosition: function modelSet(pos, model) {
    //   model.state = R.pipe(
    //     R.assoc('x', pos.x),
    //     R.assoc('y', pos.y),
    //     modelService.checkState
    //   )(model.state);
    // },
    // moveFront: function modelMoveFront(small, model) {
    //   var dist = MOVES[small ? 'MoveSmall' : 'Move'];
    //   model.state = modelService
    //     .checkState(pointService.moveFront(dist, model.state));
    // },
    // moveBack: function modelMoveBack(small, model) {
    //   var dist = MOVES[small ? 'MoveSmall' : 'Move'];
    //   model.state = modelService
    //     .checkState(pointService.moveBack(dist, model.state));
    // },
    // rotateLeft: function modelRotateLeft(small, model) {
    //   var angle = MOVES[small ? 'RotateSmall' : 'Rotate'];
    //   model.state = modelService
    //     .checkState(pointService.rotateLeft(angle, model.state));
    // },
    // rotateRight: function modelRotateRight(small, model) {
    //   var angle = MOVES[small ? 'RotateSmall' : 'Rotate'];
    //   model.state = modelService
    //     .checkState(pointService.rotateRight(angle, model.state));
    // },
    // shiftLeft: function modelShiftLeft(small, model) {
    //   var dist = MOVES[small ? 'ShiftSmall' : 'Shift'];
    //   model.state = modelService
    //     .checkState(pointService.shiftLeft(dist, model.state));
    // },
    // shiftRight: function modelShiftRight(small, model) {
    //   var dist = MOVES[small ? 'ShiftSmall' : 'Shift'];
    //   model.state = modelService
    //     .checkState(pointService.shiftRight(dist, model.state));
    // },
    // shiftUp: function modelShiftUp(small, model) {
    //   var dist = MOVES[small ? 'ShiftSmall' : 'Shift'];
    //   model.state = modelService
    //     .checkState(pointService.shiftUp(dist, model.state));
    // },
    // shiftDown: function modelShiftDown(small, model) {
    //   var dist = MOVES[small ? 'ShiftSmall' : 'Shift'];
    //   model.state = modelService
    //     .checkState(pointService.shiftDown(dist, model.state));
    // },
    // addLabel: function modelAddLabel(label, model) {
    //   model.state.l = R.uniq(R.append(label, model.state.l));
    // },
    // removeLabel: function modelRemoveLabel(label, model) {
    //   model.state.l = R.reject(R.eq(label), model.state.l);
    // },
    // fullLabel: function modelFullLabel(model) {
    //   return model.state.l.join(' ');
    // },
  };
  R.curryService(modelService);
  return modelService;
};
