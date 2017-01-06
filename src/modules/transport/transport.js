/*

Данные берутся через server side proxy, написанным на nodejs в файле proxy.js на cors-anywhere 
При релизе надо переделать забор данных с редмайна на jsonp, если версия редмайна позволяет (более 2.1 вроде)
Если версия редмайна не позволяет, то придётся так же юзать корс, но с определенными ограничениями, какие домены можно запрашивать, а какие нельзя

*/
(function (TD) {

  TD = _.extend(TD, {
    transport: {
      _query: function(resource, params, success, error, customConfig) {
        var qs = '';
        for (var p in params) {
          qs += '&'+p+'='+params[p];
        }
        var config = _.clone(TD.config);
        if (customConfig) {
          config = _.extend(config, customConfig);
        }
        $.ajax({
            url: config.redmineUrl + "/"+resource+".json?key="+config.apiKey+qs,
            //key - это ключ api из настроек профиля

            method: "GET",
            dataType: "json",
            success: success,
            error: error
        });
      },
      _put: function(resource, params, success, error) {
        params['key'] = TD.config.apiKey;
        $.ajax({
            url: TD.config.redmineUrl + "/"+resource+".json",
            method:'PUT',
            dataType: "text",
            data: params,
            success: success,
            error: error
        });
      },
      _post: function(resource, params, success, error) {
        params['key'] = TD.config.apiKey;
        $.ajax({
            url: TD.config.redmineUrl + "/"+resource+".json",
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
        params['key'] = TD.config.apiKey;
        $.ajax({
            url: TD.config.redmineUrl + "/"+resource+".json?key="+TD.config.apiKey+qs,
            method:'DELETE',
            dataType: "text",
            data: params,
            success: success,
            error: error
        });
      },
      _upload: function (file, success, error, progress) {
        $.ajax({
          url:  TD.config.redmineUrl + '/uploads.json?key=' + TD.config.apiKey,
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

})(TD);