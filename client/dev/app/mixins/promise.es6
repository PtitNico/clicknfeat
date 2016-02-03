(function() {
  R.promiseAll = R.bind(self.Promise.all, self.Promise);

  R.rejectIf = R.curry((test, reason, obj) => {
    if(test(obj)) return self.Promise.reject(reason);
    else return obj;
  });
})();
