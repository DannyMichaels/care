const path = require('path');

module.exports = function override(config) {
  const rootModules = path.resolve(__dirname, '..', 'node_modules');

  // Ensure shared package resolves the same React instance as client
  config.resolve.alias = {
    ...config.resolve.alias,
    react: path.resolve(rootModules, 'react'),
    'react-dom': path.resolve(rootModules, 'react-dom'),
  };

  // Remove ModuleScopePlugin so root node_modules can be resolved
  config.resolve.plugins = config.resolve.plugins.filter(
    (plugin) => plugin.constructor.name !== 'ModuleScopePlugin'
  );

  return config;
};
