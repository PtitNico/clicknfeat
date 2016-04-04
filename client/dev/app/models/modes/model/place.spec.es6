xdescribe('modelPlaceMode model', function() {
  beforeEach(inject([
    'modelPlaceMode',
    function(modelPlaceModeModel) {
      this.modelPlaceModeModel = modelPlaceModeModel;

      this.modesModel = spyOnService('modes');
      this.modelModel = spyOnService('model');
      this.gameModelsModel = spyOnService('gameModels');
      this.gameModelSelectionModel = spyOnService('gameModelSelection');
      this.modelsModeModel = spyOnService('modelsMode');
      this.gameModelSelectionModel.get
        .and.returnValue(['stamp']);

      this.state = { game: { model_selection: 'selection',
                             models: 'models'
                           },
                     factions: 'factions',
                     modes: 'modes',
                     eventP: jasmine.createSpy('eventP')
                   };
    }
  ]));

  context('when user ends place on model', function() {
    return this.modelPlaceModeModel.actions
      .endPlace(this.state);
  }, function() {
    it('should end place for model', function() {
      expect(this.state.eventP)
        .toHaveBeenCalledWith('Game.command.execute',
                              'onModels', [
                                'endPlace',
                                [],
                                ['stamp']
                              ]);
    });

    it('should switch to Model mode', function() {
      expect(this.state.eventP)
        .toHaveBeenCalledWith('Modes.switchTo','Model');
    });
  });

  context('when user set target model', function() {
    return this.modelPlaceModeModel.actions
      .setTargetModel(this.state, this.event);
  }, function() {
    beforeEach(function() {
      this.gameModelsModel.findStampP.resolveWith({
        state: { stamp: 'stamp' }
      });
      this.target = { state: { stamp: 'target' } };
      this.event = { 'click#': { target: this.target } };
    });

    context('when target is the same as selection', function() {
      this.target.state.stamp = 'stamp';
    }, function() {
      it('should do nothing', function() {
        expect(this.state.eventP)
          .not.toHaveBeenCalled();
      });
    });

    context('target is another model', function() {
      this.target.state.stamp = 'target';
    }, function() {
      it('should set place target for model', function() {
        expect(this.state.eventP)
          .toHaveBeenCalledWith('Game.command.execute',
                                'onModels', [
                                  'setPlaceTargetP',
                                  ['factions', this.target],
                                  ['stamp']
                                ]);
      });
    });
  });

  context('user set origin model', function() {
    return this.modelPlaceModeModel.actions
      .setOriginModel(this.state, this.event);
  }, function() {
    beforeEach(function() {
      this.gameModelsModel.findStampP.resolveWith({
        state: { stamp: 'stamp' }
      });
      this.target = { state: { stamp: 'target' } };
      this.event = { 'click#': { target: this.target } };
    });

    context('when origin is the same as selection', function() {
      this.target.state.stamp = 'stamp';
    }, function() {
      it('should do nothing', function() {
        expect(this.state.eventP)
          .not.toHaveBeenCalled();
      });
    });

    context('when origin is another model', function() {
      this.target.state.stamp = 'origin';
    }, function() {
      it('should set place target for model', function() {
          expect(this.state.eventP)
          .toHaveBeenCalledWith('Game.command.execute',
                                'onModels', [
                                  'setPlaceOriginP',
                                  ['factions', this.target],
                                  ['stamp']
                                ]);
      });
    });
  });

  example(function(e, d) {
    context('when user '+e.action+' on model, '+d, function() {
      return this.modelPlaceModeModel
        .actions[e.action](this.state);
    }, function() {
      beforeEach(function() {
        this.state.ui_state = { flip_map : e.flipped };
      });

      it('should place-move model', function() {
        expect(this.state.eventP)
          .toHaveBeenCalledWith('Game.command.execute',
                                'onModels', [
                                  e.move+'PlaceP',
                                  ['factions', e.small],
                                  ['stamp']
                                ]);
      });
    });
  }, [
    ['action'          , 'flipped' , 'move'        , 'small'],
    ['moveFront'       , false     , 'moveFront'   , false  ],
    ['moveFront'       , true      , 'moveFront'   , false  ],
    ['moveFrontSmall'  , false     , 'moveFront'   , true   ],
    ['moveFrontSmall'  , true      , 'moveFront'   , true   ],
    ['moveBack'        , false     , 'moveBack'    , false  ],
    ['moveBack'        , true      , 'moveBack'    , false  ],
    ['moveBackSmall'   , false     , 'moveBack'    , true   ],
    ['moveBackSmall'   , true      , 'moveBack'    , true   ],
    ['rotateRight'     , false     , 'rotateRight' , false  ],
    ['rotateRight'     , true      , 'rotateRight' , false  ],
    ['rotateRightSmall', false     , 'rotateRight' , true   ],
    ['rotateRightSmall', true      , 'rotateRight' , true   ],
    ['shiftUp'         , false     , 'shiftUp'     , false  ],
    ['shiftUp'         , true      , 'shiftDown'   , false  ],
    ['shiftUpSmall'    , false     , 'shiftUp'     , true   ],
    ['shiftUpSmall'    , true      , 'shiftDown'   , true   ],
    ['shiftDown'       , false     , 'shiftDown'   , false  ],
    ['shiftDown'       , true      , 'shiftUp'     , false  ],
    ['shiftDownSmall'  , false     , 'shiftDown'   , true   ],
    ['shiftDownSmall'  , true      , 'shiftUp'     , true   ],
    ['shiftLeft'       , false     , 'shiftLeft'   , false  ],
    ['shiftLeft'       , true      , 'shiftRight'  , false  ],
    ['shiftLeftSmall'  , false     , 'shiftLeft'   , true   ],
    ['shiftLeftSmall'  , true      , 'shiftRight'  , true   ],
    ['shiftRight'      , false     , 'shiftRight'  , false  ],
    ['shiftRight'      , true      , 'shiftLeft'   , false  ],
    ['shiftRightSmall' , false     , 'shiftRight'  , true   ],
    ['shiftRightSmall' , true      , 'shiftLeft'   , true   ],
  ]);
});
