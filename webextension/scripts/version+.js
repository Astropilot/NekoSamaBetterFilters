const fs = require('fs');
const versionFileList = [
  './package.json',
  './package-lock.json',
  './source/manifest.json'
];

versionFileList.forEach(file => {
  fs.readFile(file, 'utf8', (err, data) => {
    console.log(`Increment ${file} build number`);
    if (err) {
      return console.warn(err);
    }

    // Get JSON
    const json = JSON.parse(data);

    if (typeof json.version === 'undefined') {
      json.version = '1.0.0';
    } else {
      const currentVersion = String(json.version).split('.');
      const newVersion = {
        major: Number(currentVersion[0]),
        minor: Number(currentVersion[1]),
        build: Number(currentVersion[2]) + 1
      };
      const targetVersion = `${newVersion.major}.${newVersion.minor}.${newVersion.build}`;
      console.log(`Current Version: ${json.version} -> Target Version: ${targetVersion}\n`);
      json.version = targetVersion;
    }

    // Write JSON
    fs.writeFile(file, JSON.stringify(json, null, 2), err => console.warn(err ? err : ''));
  });
});
