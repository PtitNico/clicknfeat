(function() {
  angular.module('clickApp.services')
    .factory('createTemplateCommand', createTemplateCommandModelFactory);

  createTemplateCommandModelFactory.$inject = [
    'createElementCommand',
    'commands',
    'template',
    'gameTemplates',
    'gameTemplateSelection',
  ];
  function createTemplateCommandModelFactory(createElementCommandModel,
                                             commandsModel,
                                             templateModel,
                                             gameTemplatesModel,
                                             gameTemplateSelectionModel) {
    const createTemplateCommandModel =
            createElementCommandModel('template',
                                      templateModel,
                                      gameTemplatesModel,
                                      gameTemplateSelectionModel);
    commandsModel.registerCommand('createTemplate', createTemplateCommandModel);
    return createTemplateCommandModel;
  }
})();
