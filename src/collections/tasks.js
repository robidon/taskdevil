/*

Данные берутся через server side proxy, написанным на nodejs в файле proxy.js на cors-anywhere 
При релизе надо переделать забор данных с редмайна на jsonp, если версия редмайна позволяет (более 2.1 вроде)
Если версия редмайна не позволяет, то придётся так же юзать корс, но с определенными ограничениями, какие домены можно запрашивать, а какие нельзя

*/
jQuery.ajaxPrefilter(function(options) {
    if (options.crossDomain && jQuery.support.cors) {
        options.url = 'http://127.0.0.1:8081/' + options.url;//'http://192.168.1.72:8081/' + options.url;
    }
});
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};
function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

var teammates = {};
var tasks = {};
(function () {
	var issues = [];
	var users = [];
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
		var qs = '';
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

	tasks = {
		config: _.extend ({},_config),
		STATUS: {
			NEW:1, // новый
			ASSIGNED:2, // назначен
			INPROGRESS:3, // в процессе
			CLOSED:5, // закрыт
			QA:8, // в отделе QA
			RETURNED:7, // обратная связь
			POSTPONED:9, // отложено
			CHECK:10, // проверка менеджером
			TESTDESIGN:23// тест-дизайн
		},
		trackers: {
      4: {
      	id: 4,
      	name: 'Defect',
      	icon: 'icons:bug-report'
      },
      5: {
      	id: 5,
      	name: 'Testing',
      	icon: 'icons:search'
      },
      9: {
      	id: 9,
      	name: 'Develop Task',
      	icon: 'icons:build' // develop
    	},
      24: {
      	id: 24,
      	name: 'Complaint',
      	icon: 'icons:report-problem' // complaint
      },
      29: {
      	id: 29,
      	name: 'Design Task',
      	icon: 'image:brush' // design
      },
      30: {
      	id: 30,
      	name: 'Massive Failure',
      	icon: 'maps:directions-run' // massive failure
      },
      31: {
      	id: 31,
      	name: 'UX Defect',
      	icon: 'icons:help' // ux defect
      }
		},
		statuses: {
			1: {
				id: 1,
				name: 'Новый',
				icon: 'av:new-releases'
			},
			2: {
				id: 2,
				name: 'Назначен',
				icon: 'icons:assignment-ind'
			},
			3: {
				id: 3,
				name: 'В процессе',
				icon: 'av:play-arrow'
			},
			5: {
				id: 5,
				name: 'Закрыт',
				icon: 'icons:done'
			},
			7: {
				id: 7,
				name: 'Обратная связь',
				icon: 'icons:question-answer'
			},
			8: {
				id: 8,
				name: 'В отделе QA',
				icon: 'icons:search'
			},
			9: {
				id: 9,
				name: 'Отложено',
				icon: 'av:pause'
			},
			10: {
				id: 10,
				name: 'Проверка менеджером',
				icon: 'icons:question-answer'
			},
			23: {
				id: 23,
				name: 'Тест-дизайн',
				icon: 'icons:verified-user'
			}
		},
		priorities: {
			10: {
				id: 10,
				name: 'Очень низкий'
			},
			3: {
				id: 3,
				name: 'Низкий'
			},
			4: {
				id: 4,
				name: 'Средний'
			},
			5: {
				id: 5,
				name: 'Высокий'
			},
			6: {
				id: 6,
				name: 'Критический'
			}
		},
		/*statusIcons: {
      5: 'icons:done',
      12: 'icons:done', // closed
      2: 'icons:assignment-ind',
      14: 'icons:assignment-ind', // assigned
      3: 'av:play-arrow',
      15: 'av:play-arrow', // in progress
      1: 'av:new-releases',
      11: 'av:new-releases', //new
      8: 'icons:search',
      7: 'icons:question-answer',
      10: 'icons:question-answer',
      16: 'icons:question-answer', // feedback
      9: 'av:pause',
      17: 'av:pause', // postponed
      23: 'icons:verified-user',
      13: 'icons:verified-user', //resolved
    },*/
		PRIORITY: {
			LOWEST:10,
			LOW:3,
			AVERAGE:4,
			HIGH:5,
			HIGHEST:6
		},
		TRACKER: {
			TESTING:5,
			DEFECT:4,
			DEVELOP:9,
			COMPLAINT:24,
			DESIGN:29,
			MASSIVEFAILURE:30,
			UXDEFECT:31,
		},
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
					throw new Error("unable to fetch issues");
				});
			});
		},
		fetchByProject: function (project) {
			var T = this;
			return new Promise(function (resolve, reject) {
				_query('issues', {'project_id':project}, function (response) {
					resolve(response.issues);
				}, function (error) {
					throw new Error("unable to fetch issues");
				});
			});
		},
		fetchByUser: function (user) {
			var T = this;
			return new Promise(function (resolve, reject) {
				_query('issues', {'assigned_to_id':user}, function (response) {
					resolve(response.issues);
				}, function (error) {
					throw new Error("unable to fetch issues");
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
					throw new Error("unable to fetch issues");
				});
			});
		},
		fetchBy: function(params) {
			var T = this;
			return new Promise(function (resolve, reject) {
				_query('issues', params, function (response) {
					resolve(response.issues);
				}, function (error) {
					throw new Error("unable to fetch issues");
				});
			});
		},
		fetchById: function (id) {
			var T = this;
			return new Promise(function (resolve, reject) {
				_query("issues/"+id, {include:'watchers,children,attachments,relations,watchers,changesets,journals'}, function (response) {
					resolve(response.issue);
				}, function (error) {
					throw new Error("unable to fetch issue #"+id);
				});
			});
		},
		updateTask: function (id, fields) {
			var T = this;
			return new Promise(function (resolve, reject) {
				_put("issues/"+id, {issue:fields}, function (response) {
					resolve();
				}, function (error) {
					throw new Error("unable to update issue #"+id);
				});
			});
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
						throw new Error("unable to fetch teammates");
					});
				});
			},
			getById: function (id) {
				var ind = _.findIndex(users, function (u) {
					return u.id == id;
				});
				if (ind==-1) throw new Error("unable to find user by id: "+ id);
				return users[ind];
			},
			fetchCurrent:function() {
				return new Promise(function (resolve, reject) {
					_query("users/current", {}, function (response) {
						resolve(response.user);
					}, function (error) {
						throw new Error("unable to fetch current user info");
					});
				});
			},
			filter: function (name) {

			}
		}
	};
})();