(function (TD) {
  if (!('auth' in TD)) TD.auth = {};
  var _authenticated = false;
  TD.auth = _.extend(TD.auth, {
    init: function () {
      return new Promise(function (resolve, reject) {
        TD.loadLocalConfig().then(function () {
          resolve();
        }).catch(function () {
          reject();
        });
      });
    },
    tryLogin: function (tryConfig) {
      return new Promise(function (resolve, reject) {
        TD.transport._query("users/current", {}, function (response) {
          currentUser = response.user;
          tryConfig = _.extend(tryConfig, {
            userId:currentUser.id,
            user:{
              id:currentUser.id,
              name:currentUser.lastname + ' ' + currentUser.firstname
            }
          });
          TD.updateConfig(tryConfig);
          _authenticated = true;
          resolve();
        }, function (error) {
          reject("Не получилось запросить информацию о текущем пользователе");
        }, tryConfig);
      });
    },
    logout: function () {
      
      _authenticated = false;
    },
    isAuthenticated: function () {
      return _authenticated;
    }
  });

})(TD);