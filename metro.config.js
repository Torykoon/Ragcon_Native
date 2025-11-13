const { getDefaultConfig } = require("expo/metro-config");
const { withUniwindConfig } = require('uniwind/metro'); 
 
const config = getDefaultConfig(__dirname)
 
// 🔹 txt / jsonl 을 "asset" 확장자에 추가
config.resolver.assetExts.push('txt', 'jsonl');

module.exports = withUniwindConfig(config, {  
  cssEntryFile: './global.css',
  dtsFile: './src/uniwind-types.d.ts',
  extraThemes: [
    'lavender-light',
    'lavender-dark',
    'mint-light',
    'mint-dark',
    'sky-light',
    'sky-dark',
  ],
});