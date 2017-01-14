(function (TD) {

  TD = _.extend(TD, {
    config:{},
    updateConfig: function (update) {
      var _config = _.assign(this.config, update);
      this.config = _.extend({},_config);
      this.saveLocalConfig();
    },
    loadLocalConfig: function() {
      var T = this;
      return new Promise(function (resolve, reject) {
        if (typeof(Storage) !== "undefined") {
          T.config = JSON.parse(localStorage.getItem("redmineConfig"));
          if (T.config===null || typeof(T.config)!='object') {
            T.config = {};
          }
          console.log(T.config);
          resolve(T.config);
        } else {
          reject();
        }
      });
    },
    clearLocalConfig:function () {
      localStorage.removeItem("redmineConfig");
      this.config = {};
    },
    saveLocalConfig:function() {
      var T = this;
      if (typeof(Storage) !== "undefined") {
          localStorage.setItem("redmineConfig", JSON.stringify(this.config));
      } else {
          navigateTo("/error/notsupported.html");
      }
    }
  })

})(TD);