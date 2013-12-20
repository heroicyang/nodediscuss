NC.Module.define('UserRepoList', [], function() {
  return NC.Module.extend({
    template: _.template($('#repo-list-tmpl').html()),
    onReady: function() {
      this.render();
    },
    render: function() {
      var self = this;
      $.get('/user/' + this.data.username + '/repos')
        .done(function(result) {
          var repos = [];
          if (result.success) {
            repos = result.response && result.response.data;
            self.$el.html(self.template({ githubRepos: repos }));
          }
        });
    }
  });
});