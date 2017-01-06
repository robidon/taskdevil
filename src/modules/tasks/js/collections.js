(function () {
  
  tasks = _.extend(tasks, {
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
      17: {
        id: 17,
        name: 'Approve (TG)',
        icon: 'icons:build' //Approve (TG)
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
    }
  });

})();