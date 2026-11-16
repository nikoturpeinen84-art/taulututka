// Ajetaan GitHubissa "npx cap add android" -komennon jälkeen: lisää kameraluvan, pystyasennon,
// näytön päälläpidon sekä Taulututkan kuvakkeet ja avausnäytön.
const fs = require('fs'), path = require('path');
const main = 'android/app/src/main';
const res = path.join(main, 'res');

let m = fs.readFileSync(path.join(main, 'AndroidManifest.xml'), 'utf8');
if (!m.includes('android.permission.CAMERA')) {
  m = m.replace('<uses-permission android:name="android.permission.INTERNET" />',
    '<uses-permission android:name="android.permission.INTERNET" />\n    <uses-permission android:name="android.permission.CAMERA" />\n    <uses-feature android:name="android.hardware.camera" android:required="false" />');
}
if (!m.includes('screenOrientation')) m = m.replace('android:name=".MainActivity"', 'android:name=".MainActivity"\n            android:screenOrientation="portrait"');
fs.writeFileSync(path.join(main, 'AndroidManifest.xml'), m);

fs.writeFileSync(path.join(main, 'java/fi/taulututka/app/MainActivity.java'), `package fi.taulututka.app;

import android.os.Bundle;
import android.view.WindowManager;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
    }
}
`);

for (const d of ['mdpi', 'hdpi', 'xhdpi', 'xxhdpi', 'xxxhdpi']) {
  const dir = path.join(res, 'mipmap-' + d);
  fs.copyFileSync(`ikoni-${d}.png`, path.join(dir, 'ic_launcher.png'));
  fs.copyFileSync(`ikoni-pyorea-${d}.png`, path.join(dir, 'ic_launcher_round.png'));
  fs.copyFileSync(`ikoni-etu-${d}.png`, path.join(dir, 'ic_launcher_foreground.png'));
}
const bg = path.join(res, 'values/ic_launcher_background.xml');
if (fs.existsSync(bg)) fs.writeFileSync(bg, fs.readFileSync(bg, 'utf8').replace(/#[0-9A-Fa-f]{6}/, '#0F1412'));

for (const dir of fs.readdirSync(res)) {
  const f = path.join(res, dir, 'splash.png');
  if (fs.existsSync(f)) fs.copyFileSync(dir.includes('land') ? 'avaus-vaaka.png' : 'avaus-pysty.png', f);
}
console.log('Android-projekti muokattu Taulututkaa varten.');
