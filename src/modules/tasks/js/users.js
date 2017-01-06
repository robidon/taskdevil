(function () {

  var users = [];
  var currentUser = {};

  TD = _.extend(TD,{
    users: {
      fetchAll:function () {
        return new Promise(function (resolve, reject) {
          TD.transport._query("projects/fs2/memberships", {limit:100}, function (response) {
            users = [];
            response.memberships.forEach(function (m) {
              if (m.user) {
                users.push(m.user);
              }
            });
            resolve(users);
          }, function (error) {
            reject("Пользователи не найдены");
          });
        });
      },
      fetchAllWithGroups:function () {
        return new Promise(function (resolve, reject) {
          TD.transport._query("projects/fs2/memberships", {limit:100}, function (response) {
            results = [];
            response.memberships.forEach(function (m) {
              if (m.user) {
                results.push(m.user);
              } else if (m.group) {
                results.push(m.group);
              }
            });
            resolve(results);
          }, function (error) {
            reject("Пользователи не найдены");
          });
        });
      },
      getById: function (id) {
        var ind = _.findIndex(users, function (u) {
          return u.id == id;
        });
        if (ind==-1) throw new Error("Пользователь не найден #"+ id);
        return users[ind];
      },
      fetchCurrent:function() {
        return new Promise(function (resolve, reject) {
          if (!_.isEmpty(currentUser)) {
            resolve(currentUser);
            return;
          }
          TD.transport._query("users/current", {}, function (response) {
            currentUser = response.user;
            TD.updateConfig({user:{id:currentUser.id,name:currentUser.lastname + ' ' + currentUser.firstname}});
            resolve(response.user);
          }, function (error) {
            reject("Не получилось запросить информацию о текущем пользователе");
          });
        });
      },
      filter: function (name) {

      }
    }  
  });

})();