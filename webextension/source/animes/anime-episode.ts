import {runInPageContext} from '../hijacking/utils';
import $ from 'jquery';
import 'semantic-ui-dropdown/dropdown';

const sourceChoice = `
  <div id="quality-selector" class="ui dropdown labeled icon with-svg-left button">
  <svg class="n" viewBox="0 0 512 512"><path fill="currentColor" d="M216 0h80c13.3 0 24 10.7 24 24v168h87.7c17.8 0 26.7 21.5 14.1 34.1L269.7 378.3c-7.5 7.5-19.8 7.5-27.3 0L90.1 226.1c-12.6-12.6-3.7-34.1 14.1-34.1H192V24c0-13.3 10.7-24 24-24zm296 376v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h146.7l49 49c20.1 20.1 52.5 20.1 72.6 0l49-49H488c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"></path></svg>
    <div class="text">Télécharger l'épisode via %host%</div>
    <div class="menu">
      %items%
    </div>
  </div>
`;

function resetDownload() {
  $('.anime-info > .actions').empty();
}

$('#host-dropdown').dropdown('setting', 'onChange', resetDownload);

browser.runtime.onMessage.addListener(downloads => {
  let items = '';
  const host = $('#host-dropdown > .text').contents().filter(function(){
    return this.nodeType == 3;
  })[0].nodeValue || '';

  for (const source of Object.keys(downloads)) {
    items += `<a href="${downloads[source]}" class="item" target="_blank">Télécharger en ${source}p</a>`;
  }

  $('.anime-info > .actions').html(
    sourceChoice.replace('%items%', items).replace('%host%', host.toLowerCase())
  );

  const setupDownload = () => {
    jQuery('#quality-selector').dropdown({
      action: 'nothing'
    });
  };

  runInPageContext(setupDownload, true);
});

browser.runtime.sendMessage({from: 'anime-episode'});
