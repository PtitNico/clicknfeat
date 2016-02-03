"use strict";

(function () {
  R.promiseAll = R.bind(self.Promise.all, self.Promise);

  R.rejectIf = R.curry(function (test, reason, obj) {
    if (test(obj)) return self.Promise.reject(reason);else return obj;
  });
})();
//# sourceMappingURL=promise.js.map