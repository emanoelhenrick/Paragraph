const path = require('path')
const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

process.env.APP_ROOT = path.join(__dirname, '..')
const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

module.exports = {
  packagerConfig: {
    asar: true,
    icon: "/home/manel/Documents/dev/Paragraph/public/icon.png"
  },
  rebuildConfig: {},
  makers: [
    {
      "name": "@electron-forge/maker-squirrel",
      "config": {
        "name": "Paragraph",
        "noMsi": true,
        "shortcutName": "Pr",
        "createDesktopShortcut": true
      }
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {
        "name": "Paragraph",
        "icon": "/home/manel/Documents/dev/Paragraph/public/icon.png"
      },
    }
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
