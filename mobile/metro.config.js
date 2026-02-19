const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const mobileReact = path.resolve(projectRoot, 'node_modules', 'react');

const config = getDefaultConfig(projectRoot);

// Force 'react' to always resolve from mobile's local copy (React 19).
// Root node_modules has React 17 from the web client — wrong for RN 0.81.
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'react') {
    return context.resolveRequest(context, mobileReact, platform);
  }
  if (moduleName.startsWith('react/')) {
    const subpath = moduleName.slice('react'.length);
    return context.resolveRequest(context, mobileReact + subpath, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
