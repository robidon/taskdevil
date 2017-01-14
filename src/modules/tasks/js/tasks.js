(function () {
	
  if (!('tasks' in TD)) TD.tasks = {};

	var issues = [];

	TD.tasks = _.extend(TD.tasks, {
		fetchAll: function () {
			var T = this;
			return new Promise(function (resolve, reject) {
				TD.transport._query('issues', {'assigned_to_id':'me'}, function (response) {
					resolve(response.issues);
				}, function (error) {
					reject("Задачи не найдены");
				});
			});
		},
		fetchByProject: function (project) {
			var T = this;
			return new Promise(function (resolve, reject) {
				TD.transport._query('issues', {'project_id':project}, function (response) {
					resolve(response.issues);
				}, function (error) {
					reject("Задачи не найдены");
				});
			});
		},
		fetchByUser: function (user) {
			var T = this;
			return new Promise(function (resolve, reject) {
				TD.transport._query('issues', {'assigned_to_id':user}, function (response) {
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
				TD.transport._query('issues', params, function (response) {
					resolve(response.issues);
				}, function (error) {
					reject("Задачи не найдены");
				});
			});
		},
		fetchBy: function(params) {
			var T = this;
			return new Promise(function (resolve, reject) {
				TD.transport._query('issues', params, function (response) {
					resolve(response.issues);
				}, function (error) {
					reject("Задачи не найдены");
				});
			});
		},
		fetchById: function (id) {
			var T = this;
			return new Promise(function (resolve, reject) {
				TD.transport._query("issues/"+id, {include:'watchers,children,attachments,relations,watchers,changesets,journals'}, function (response) {
					resolve(response.issue);
				}, function (error) {
					reject("Задача не найдена #" + id);
				});
			});
		},
		fetchByFilter:function (filter) {
			var T = this;
			return new Promise(function (resolve, reject) {
				var params = {
					utf8:'✓',
					set_filter:1,
					f:[],
					op:{},
					v:{}
				}
				for(var field in filter) {
					params.f.push(field);
					params.op[field] = '=',
					params.v[field] = filter[field];
				}
				/*	f: // fields
						['status_id','assigned_to_id'],
					op:{ // operator
						'status_id':'=',
						'assigned_to_id':'='
					},
					v:{ // values
						'status_id':[3,2],
						'assigned_to_id':['me']
					},
				}*/
				TD.transport._query("issues", params, function (response) {
					resolve(response.issues);
				}, function (error) {
					reject("Задачи не найдены");
				});
			});
		},
		updateTask: function (id, fields) {
			var T = this;
			return new Promise(function (resolve, reject) {
				TD.transport._put("issues/"+id, {issue:fields}, function (response) {
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
				TD.transport._post("issues", {issue:data}, function (response) {
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
						
	});
})();