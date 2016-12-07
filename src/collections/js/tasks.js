(function () {
	
	var issues = [];
	var users = [];
	var currentUser = {};
	var projects = [];
	var queries = [];
	var _config = {
		redmineUrl: 'https://pm.vs58.net',
		apiKey: '2904ec11b363aea640f6cdefca749e188bb02a0f', //Rodion key
		userId: 5, // Rodion id
		generalProject: 'fs2'
	}
	var _query = function(resource, params, success, error) {
		var qs = '';
		for (var p in params) {
			qs += '&'+p+'='+params[p];
		}
		$.ajax({
		    url: _config.redmineUrl + "/"+resource+".json?key="+_config.apiKey+qs,
		    //key - это ключ api из настроек профиля

		    method: "GET",
		    dataType: "json",
		    success: success,
		    error: error
		});
	};
	var _put = function(resource, params, success, error) {
		params['key'] = _config.apiKey;
		$.ajax({
		    url: _config.redmineUrl + "/"+resource+".json",
		    method:'PUT',
		    dataType: "text",
		    data: params,
		    success: success,
		    error: error
		});
	};
	var _post = function(resource, params, success, error) {
		params['key'] = _config.apiKey;
		$.ajax({
		    url: _config.redmineUrl + "/"+resource+".json",
		    method:'POST',
		    dataType: "json",
		    data: params,
		    success: success,
		    error: error
		});
	};
	var _delete = function(resource, params, success, error) {
		var qs = '';
		for (var p in params) {
			qs += '&'+p+'='+params[p];
		}
		params['key'] = _config.apiKey;
		$.ajax({
		    url: _config.redmineUrl + "/"+resource+".json?key="+_config.apiKey+qs,
		    method:'DELETE',
		    dataType: "text",
		    data: params,
		    success: success,
		    error: error
		});
	};
	var _upload = function (file, success, error, progress) {
		$.ajax({
      url:  _config.redmineUrl + '/uploads.json?key=' + _config.apiKey,
      type: 'POST',
      contentType: 'application/octet-stream',  
      data: file,
      processData: false,
      xhr: function() {
        var xhr = $.ajaxSettings.xhr();
        xhr.upload.onprogress = progress
        return xhr;
    	},
      success: success,
      error: error
    });
	}

	tasks = _.extend(tasks, {
		config: _.extend ({},_config),
		updateConfig: function (update) {
			_config = _.assign(_config, update);
			this.config = _.extend({},_config);
		}, 
		fetchAll: function () {
			var T = this;
			return new Promise(function (resolve, reject) {
				_query('issues', {'assigned_to_id':'me'}, function (response) {
					resolve(response.issues);
				}, function (error) {
					reject("Задачи не найдены");
				});
			});
		},
		fetchByProject: function (project) {
			var T = this;
			return new Promise(function (resolve, reject) {
				_query('issues', {'project_id':project}, function (response) {
					resolve(response.issues);
				}, function (error) {
					reject("Задачи не найдены");
				});
			});
		},
		fetchByUser: function (user) {
			var T = this;
			return new Promise(function (resolve, reject) {
				_query('issues', {'assigned_to_id':user}, function (response) {
					resolve(response.issues);
				}, function (error) {
					reject("Задачи не найдены");
				});
			});
		},
		fetchByQuery: function (query_id, project_id) {
			var T = this;
			return new Promise(function (resolve, reject) {
				var params = {'query_id':query_id};
				if (project_id) {
					params['project_id'] = project_id
				};
				_query('issues', params, function (response) {
					resolve(response.issues);
				}, function (error) {
					reject("Задачи не найдены");
				});
			});
		},
		fetchBy: function(params) {
			var T = this;
			return new Promise(function (resolve, reject) {
				_query('issues', params, function (response) {
					resolve(response.issues);
				}, function (error) {
					reject("Задачи не найдены");
				});
			});
		},
		fetchById: function (id) {
			var T = this;
			return new Promise(function (resolve, reject) {
				_query("issues/"+id, {include:'watchers,children,attachments,relations,watchers,changesets,journals'}, function (response) {
					resolve(response.issue);
				}, function (error) {
					reject("Задача не найдена #" + taskId);
				});
			});
		},
		updateTask: function (id, fields) {
			var T = this;
			return new Promise(function (resolve, reject) {
				_put("issues/"+id, {issue:fields}, function (response) {
					resolve();
				}, function (error) {
					reject("Не получилось обновить задачу #" + id);
				});
			});
		},
		addTask: function (data) {
			var T = this;
			if (data.parent_issue_id == 0) delete data.parent_issue_id;
			if (data.done_ratio == 0) delete data.done_ratio;
			if (data.assigned_to_id == 0) delete data.assigned_to_id;
			if (data.status_id == 0) delete data.status_id;
			//console.log(data);
			//return;
			return new Promise(function (resolve, reject) {
				_post("issues", {issue:data}, function (response) {
					resolve(response.issue);
				}, function (error) {
					var errText = '';
					if (error.responseJSON) {
						errText = error.responseJSON.errors.join('; ');
					} else {
						errText = 'Трекер не должен быть пустым'
					}
					reject(errText);
				});
			});
		},
		attachments: {
			upload:function (file, onProgress) {
				var T = this;
				return new Promise(function (resolve, reject) {
					_upload(file, function (response) {
						//console.log(response.upload);
						response.upload.filename = file.name;
						response.upload.content_type = file.type;
						resolve(response.upload);
					}, function (error) {
						var errText = '';
						if (error.responseJSON) {
							errText = error.responseJSON.errors.join('; ');
						} else {
							errText = 'Трекер не должен быть пустым'
						}
						reject(errText);
					}, onProgress);
				});
			},
			add: function (taskId, uploads) {
				return new Promise(function (resolve, reject) {
					/*"uploads": [
			      {"token": "7167.ed1ccdb093229ca1bd0b043618d88743", "filename": "image.png", "content_type": "image/png"}
			    ];*/
			    console.log(taskId, uploads);
					_put("issues/"+taskId, {attachments:uploads}, function (response) {
						console.log(response);
						resolve();
					}, function (error) {
						reject("Не получилось обновить задачу #" + taskId);
					});
				})
			},
			delete: function (attachmentId) {
				return new Promise(function (resolve, reject) {
					_delete('attachments/'+attachmentId, {}, function (response) {
						console.log('deleted');
					}, function (error) {
						reject("Не получилось удалить аттач #" + attachmentId);
					});
				});
			}
		},
		queries: {
			fetchAll: function () {
				return new Promise(function(resolve, reject) {
					if (queries.length) {
						resolve(queries);
						return;
					}
					_query("queries", {limit:100}, function (response) {
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
		projects: {
			fetchAll: function () {
				return new Promise(function(resolve, reject) {
					if (projects.length) {
						resolve(projects);
						return;
					}
					_query("projects", {limit:100}, function (response) {
						response.projects.forEach(function (p) {
							projects.push(p);
						});
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
					_query("projects/"+id, {limit:100}, function (response) {
						resolve(response.project);
					});
				});
			}
		},
		users: {
			fetchAll:function () {
				return new Promise(function (resolve, reject) {
					_query("projects/fs2/memberships", {limit:100}, function (response) {
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
          _query("projects/fs2/memberships", {limit:100}, function (response) {
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
					_query("users/current", {}, function (response) {
						currentUser = response.user;
						tasks.updateConfig({user:{id:currentUser.id,name:currentUser.lastname + ' ' + currentUser.firstname}});
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