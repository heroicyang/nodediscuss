NC.Module.define('UserRepoList', [], function() {
  return NC.Module.extend({
    template: _.template($('#repo-list-tmpl').html()),
    onReady: function() {
      this.render();
    },
    render: function() {
      var self = this;
      $.get('/user/' + this.data.username + '/repos')
        .done(function(rep) {
          var repos = [];
          if (rep.success) {
            repos = rep.data;
            self.$el.html(self.template({ githubRepos: repos }));
          }
        });
    }
  });
});