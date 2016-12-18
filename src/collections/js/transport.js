(function () {

  tasks = _.extend(tasks, {
    transport: {
      _query: function(resource, params, success, error) {
        var qs = '';
        for (var p in params) {
          qs += '&'+p+'='+params[p];
        }
        $.ajax({
            url: tasks.config.redmineUrl + "/"+resource+".json?key="+tasks.config.apiKey+qs,
            //key - это ключ api из настроек профиля

            method: "GET",
            dataType: "json",
            success: success,
            error: error
        });
      },
      _put: function(resource, params, success, error) {
        params['key'] = tasks.config.apiKey;
        $.ajax({
            url: tasks.config.redmineUrl + "/"+resource+".json",
            method:'PUT',
            dataType: "text",
            data: params,
            success: success,
            error: error
        });
      },
      _post: function(resource, params, success, error) {
        params['key'] = tasks.config.apiKey;
        $.ajax({
            url: tasks.config.redmineUrl + "/"+resource+".json",
            method:'POST',
            dataType: "json",
            data: params,
            success: success,
            error: error
        });
      },
      _delete: function(resource, params, success, error) {
        var qs = '';
        for (var p in params) {
          qs += '&'+p+'='+params[p];
        }
        params['key'] = tasks.config.apiKey;
        $.ajax({
            url: tasks.config.redmineUrl + "/"+resource+".json?key="+tasks.config.apiKey+qs,
            method:'DELETE',
            dataType: "text",
            data: params,
            success: success,
            error: error
        });
      },
      _upload: function (file, success, error, progress) {
        $.ajax({
          url:  tasks.config.redmineUrl + '/uploads.json?key=' + tasks.config.apiKey,
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
      },
    }
  });

})();