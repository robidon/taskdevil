(function () {

  tasks = _.extend(tasks, {
    attachments: {
      upload:function (file, onProgress) {
        var T = this;
        return new Promise(function (resolve, reject) {
          tasks.transport._upload(file, function (response) {
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
          tasks.transport._put("issues/"+taskId, {attachments:uploads}, function (response) {
            console.log(response);
            resolve();
          }, function (error) {
            reject("Не получилось обновить задачу #" + taskId);
          });
        })
      },
      delete: function (attachmentId) {
        return new Promise(function (resolve, reject) {
          tasks.transport._delete('attachments/'+attachmentId, {}, function (response) {
            console.log('deleted');
          }, function (error) {
            reject("Не получилось удалить аттач #" + attachmentId);
          });
        });
      }
    },
  });

})();