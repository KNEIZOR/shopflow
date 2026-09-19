import path from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
    plugins: [react()],

    resolve: {
        alias: {
            '@': path.resolve(import.meta.dirname, './src'),
        },
    },

    css: {
        modules: {
            generateScopedName:
                mode === 'development' ? '[name]_[local]' : '[hash:base64:5]',
        },
    },
}));
