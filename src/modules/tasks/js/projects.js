(function () {

  var projects = [];
  var _loadCache = function () {
    if (typeof(Storage) !== "undefined") {
      projects = JSON.parse(localStorage.getItem("collections.projects"));
      if (projects===null || typeof(projects)!='object') {
        projects = [];
      }
    }
  }
  var _saveCache = function () {
    if (typeof(Storage) !== "undefined") {
      localStorage.setItem("collections.projects", JSON.stringify(projects));
    }
  }

  _loadCache();

  TD = _.extend(TD, {
    projects: {
      fetchAll: function () {
        return new Promise(function(resolve, reject) {
          if (projects.length) {
            resolve(projects);
            return;
          }
          TD.transport._query("projects", {limit:100}, function (response) {
            response.projects.forEach(function (p) {
              projects.push(p);
            });
            _saveCache();
            resolve(projects);
          });
        });
      },
      fetchById: function (id) {
        return new Promise(function (resolve, reject) {
          if (projects.length) {
            resolve(_.find(projects, function (p) { return p.id == id; }));
            return;
          }
          TD.transport._query("projects/"+id, {limit:100}, function (response) {
            resolve(response.project);
          });
        });
      }
    },
  });

})();