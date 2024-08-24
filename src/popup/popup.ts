import './popup.css';
import * as Util from '../shared/utils';
import { configStorage } from '../shared/storage';
import { Controls } from '../shared/const';

(async () => {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  const hostname: string = Util.getHostName(tab.url as string);
  loadConfigs(hostname);
  Util.getDomElement('siteInfo').innerText = 'www.' + hostname;

  [
    Controls.blackSats,
    Controls.palindromeSats,
  ].forEach((Element) => {
    Util.getInput(Element).addEventListener('change', () => saveConfig(hostname));
  });

  Util.getInput(Controls.enableSetting).addEventListener('change', () => clearConfigAll(hostname));
})();

function loadConfigs(hostname: string): void {
  configStorage.get((configs) => {
    const pageConfig = configs.pageStyle.find((config) => config.url === hostname);

    if (pageConfig) {
      Util.getInput(Controls.enableSetting).checked = pageConfig.enableSetting;
      Util.getInput(Controls.palindromeSats).checked = pageConfig.palindromeSats;
      Util.getInput(Controls.blackSats).checked = pageConfig.blackSats;
    }
  });
}

function saveConfig(hostname: string): void {
  configStorage.get((configs) => {
    let findPageStyleIndex = configs.pageStyle.findIndex((config) => config.url === hostname);

    if (findPageStyleIndex === -1) {
      configs.pageStyle.push({
        url: hostname,
        enableSetting: false,
        palindromeSats: false,
        blackSats: false
      })
      findPageStyleIndex = configs.pageStyle.length - 1
    }

    configs.pageStyle[findPageStyleIndex].blackSats = Util.getInput(Controls.blackSats).checked;
    configs.pageStyle[findPageStyleIndex].enableSetting = Util.getInput(Controls.enableSetting).checked;
    configs.pageStyle[findPageStyleIndex].palindromeSats = Util.getInput(Controls.palindromeSats).checked;

    configStorage.set(configs);
  });
}

function clearConfigAll(hostname: string): void {
  if (!Util.getInput(Controls.enableSetting).checked) {
    configStorage.get((configs) => {
      const findPageStyleIndex = configs.pageStyle.findIndex((config) => config.url === hostname);

      if (findPageStyleIndex != -1) {
        configs.pageStyle[findPageStyleIndex].enableSetting = false;
        configs.pageStyle[findPageStyleIndex].blackSats = false;
        configs.pageStyle[findPageStyleIndex].palindromeSats = false;

        Util.getInput(Controls.palindromeSats).checked = false;
        Util.getInput(Controls.blackSats).checked = false;

        configStorage.set(configs);
      }
    });
  } else {
    configStorage.get((configs) => {
      const findPageStyleIndex = configs.pageStyle.findIndex((config) => config.url === hostname);

      if (findPageStyleIndex != -1) {
        configs.pageStyle[findPageStyleIndex].enableSetting = true;
        configStorage.set(configs);
      }
    });
  }
}