const path = require('path');

module.exports = function override(config) {
  // Dynamically resolve react wherever the package manager hoisted it
  const reactPath = path.dirname(require.resolve('react/package.json'));
  const reactDomPath = path.dirname(require.resolve('react-dom/package.json'));

  // Ensure shared package resolves the same React instance as client
  config.resolve.alias = {
    ...config.resolve.alias,
    react: reactPath,
    'react-dom': reactDomPath,
  };

  // Remove ModuleScopePlugin so hoisted node_modules can be resolved
  config.resolve.plugins = config.resolve.plugins.filter(
    (plugin) => plugin.constructor.name !== 'ModuleScopePlugin'
  );

  return config;
};
