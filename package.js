Package.describe({
  summary: "Very simple models to construct collection transforms"
});

Package.on_use(function (api, where) {
  api.add_files('collection-models.js', ['client', 'server']);
  
  api.export('CollectionModel');
});

Package.on_test(function (api) {
  api.use('collection-models');

  api.add_files('collection-models_tests.js', ['client', 'server']);
});
