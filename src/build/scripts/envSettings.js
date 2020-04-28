const fsExtra = require('fs-extra');

function createEnvSettingsFile(settingsFile) {
    fsExtra.ensureFile(settingsFile).then((f) => {
        fsExtra.writeFileSync(
            settingsFile,
            `window.appSettings = {AUTH_PROXY_URL: '${process.env.AUTH_PROXY_URL}'};`,
        );
    });
}

module.exports = createEnvSettingsFile;
