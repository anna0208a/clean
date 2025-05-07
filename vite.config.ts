import { defineConfig, PluginOption } from 'vite'
import { tamaguiPlugin } from '@tamagui/vite-plugin'
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    // tamaguiPlugin(tamaguiConfig),
    tamaguiPlugin({
      components: ['tamagui'],
      // config: './app/theme/tamagui.config.ts', // THROWS ERROR
      config: './src/tamagui.config.ts', // IT WORKS
      logTimings: true,
    }) as PluginOption,
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@page': resolve(__dirname, './src/page'),  // ← 這行補上！
      '@style': resolve(__dirname, './src/styles'),  // ← 這行補上！
      '@img': resolve(__dirname, './src/assets/img'), // ← 還有這行！
      '@component': resolve(__dirname, './src/components') // ← 還有這行！
    },
  },
})
