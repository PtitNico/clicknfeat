'use strict';

(function () {
  angular.module('clickApp.models').factory('wallTemplate', wallTemplateModelFactory);

  wallTemplateModelFactory.$inject = ['template'];
  function wallTemplateModelFactory(templateModel) {
    var wallTemplateModel = Object.create(templateModel);
    wallTemplateModel._create = wallTemplateCreate;

    templateModel.registerTemplate('wall', wallTemplateModel);

    R.curryService(wallTemplateModel);
    return wallTemplateModel;

    function wallTemplateCreate(temp) {
      return R.resolveP(temp);
    }
  }
})();
//# sourceMappingURL=wall.js.map