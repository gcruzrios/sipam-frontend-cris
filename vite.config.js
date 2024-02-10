import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';

const proxyTarget = 'https://172.173.213.146/WSSIPAM/wsSIPAM';
//const docsProxyTarget = 'https://api.conapam.go.cr/docsSIPAM';


const docsProxyTarget = 'https://api.conapam.go.cr/docsSIPAM';
const mockApiTarget = 'https://sipam-mock-be.vercel.app';
const googleApisTarget = 'https://maps.googleapis.com';






const config = () => {
    return defineConfig({
        plugins: [
            react(),
        ],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        test: {
            globals: true,
            environment: 'jsdom',
        },
        base: '/',
        server: {
            historyApiFallback: true,
            proxy: {
                '/api': {
                    target: proxyTarget,
                    rewrite: (path) => path.replace(/^\/api/, ''),
                    secure: false,
                    changeOrigin: true,
                },
                '/docs':
                    {
                        target: docsProxyTarget,
                        rewrite: (path) => path.replace(/^\/docs/, ''),
                        secure: false,
                        changeOrigin: true,
                    },
                '/mock': {
                    target: mockApiTarget,
                    rewrite: (path) => path.replace(/^\/mock/, ''),
                    secure: false,
                    changeOrigin: true,
                },
                '/googleapis': {
                    target: googleApisTarget,
                    rewrite: (path) => path.replace(/^\/googleapis/, ''),
                    secure: false,
                    changeOrigin: true,
                },
            }
        }
        
    });

    
};

export default config;