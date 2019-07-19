$.get("./api/gempa")
.done(function(data) {
    if(data.length > 0) {
      data.forEach(function(element, index) {
        data[index] = AntiXSS.sanitizeInput(element)
      });
      $('#databaseNames').html($.i18n('database_contents') + JSON.stringify(data));
    }
});

