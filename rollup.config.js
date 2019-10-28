import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import indexHTML from 'rollup-plugin-index-html';
import copy from 'rollup-plugin-copy'
const license = require('rollup-plugin-license');

const path = require('path');
const fs = require('fs');

const filePath = path.resolve('LICENSE');
const licenseTxt = fs.readFileSync(filePath, 'utf-8');

function getPlugins(isProd) {
  let plugins = [
    indexHTML(),
    resolve(),
    copy({targets: [{ src: 'demo/grid.svg', dest: 'dist/' }]})
  ];

  if(isProd)
    plugins.push(terser());

  plugins.push(
    license({
      banner: {
      commentStyle: 'regular',
      content: 
        `<%= pkg.name %> <%= pkg.version %> [<%= pkg.homepage %>]
        
        ${licenseTxt}

        
        ============================    Dependencies     ==============================
        
        <% _.forEach(dependencies, function (dependency) { %>
          <%= dependency.name %> <%= dependency.version %> [<%= dependency.homepage %>]
          Licensed under <%= dependency.license %>

        <% }) %>`,
      }
    },
  ));

  return plugins;
}

const config = {
  input: './demo/index.html',
  output: {
    dir: 'dist',
    format: 'esm',
    sourcemap: true,
  },
};

export default (args)=>{
  const isProduction = !! args.configProduction;
  config.plugins = getPlugins(isProduction);

  return config;
}