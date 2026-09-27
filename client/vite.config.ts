import path from 'node:path';

import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';

const reactRouterPath = path.resolve(
    import.meta.dirname,
    './node_modules/react-router/dist/production/index.mjs',
);

const reactRouterDomPath = path.resolve(
    import.meta.dirname,
    './node_modules/react-router/dist/production/dom-export.mjs',
);

export default defineConfig(({ mode }) => ({
    plugins: [
        react(),

        ...(mode === 'production'
            ? [
                  visualizer({
                      filename: './dist/bundle-stats.json',
                      open: false,
                      gzipSize: true,
                      brotliSize: true,
                      template: 'raw-data',
                  }),
              ]
            : []),
    ],

    resolve: {
        alias: [
            {
                find: /^react-router$/,
                replacement: reactRouterPath,
            },
            {
                find: /^react-router\/dom$/,
                replacement: reactRouterDomPath,
            },
            {
                find: '@',
                replacement: path.resolve(import.meta.dirname, './src'),
            },
        ],
    },

    css: {
        modules: {
            generateScopedName:
                mode === 'development' ? '[name]_[local]' : '[hash:base64:5]',
        },
    },
}));
