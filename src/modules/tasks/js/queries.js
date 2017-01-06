(function () {
  
  var queries = []; 

  tasks = _.extend(tasks, {
    queries: {
      fetchAll: function () {
        return new Promise(function(resolve, reject) {
          if (queries.length) {
            resolve(queries);
            return;
          }
          tasks.transport._query("queries", {limit:100}, function (response) {
            response.queries.forEach(function (p) {
              queries.push(p);
            });
            resolve(queries);
          });
        });
      },
      fetchCurrent: function (project) {
        var T = this;
        return new Promise(function(resolve, reject) {
          T.fetchAll().then(function (queries) {
            var res = [];
            queries.forEach(function (q) {
              if (((!project && !q.project_id) || (project && q.project_id == project.id))) {
                res.push(q);
              }
            });
            res = _.sortByOrder(res, [ 'is_public', 'id' ], [ 'desc', 'asc' ]);
            resolve(res);
          }, reject);
        });
      },
      fetchById: function (id) {
        var T = this;
        return new Promise(function (resolve, reject) {
          T.fetchAll().then(function () {
            if (queries.length) {
              resolve(_.find(queries, function (p) { return p.id == id; }));
              return;
            }
            reject();
          })
        });
      }
    },
  });

})();
