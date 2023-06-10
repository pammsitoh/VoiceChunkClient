module.exports = {
  // ...otras configuraciones...
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      platforms: ['win32'],
      config: {
        // configuración para Windows
      }
    }
  ]
}
