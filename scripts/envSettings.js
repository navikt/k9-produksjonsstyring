const fsExtra = require('fs-extra');

function createEnvSettingsFile(settingsFile) {
  fsExtra.ensureFile(settingsFile).then(f => {
    fsExtra.writeFileSync(
      settingsFile,
      `window.appSettings = {OIDC_AUTH_PROXY: '${process.env.OIDC_AUTH_PROXY}', REDIRECT_URL: '${process.env.REDIRECT_URL}', 
      K9_PUNSJ_URL: '${process.env.K9_PUNSJ_URL}'};,
      FEATURE_TOGGLES: '${process.env.FEATURE_TOGGLES}`,
    );
  });
}

module.exports = createEnvSettingsFile;
