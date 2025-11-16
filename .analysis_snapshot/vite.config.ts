import netlify from '@netlify/vite-plugin-tanstack-start'
import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import viteTsConfigPaths from 'vite-tsconfig-paths'

const config = defineConfig({
  plugins:  [
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    netlify(),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
        viteStaticCopy({
      targets: [
        {
          src: 'instrument.server.mjs', 
          dest: '.',        
          rename: 'index.mjs'           
        }
      ]
    })
  ],
  optimizeDeps: {
    include: ['@clerk/tanstack-react-start', 'cookie'],
  },
})

export default config
