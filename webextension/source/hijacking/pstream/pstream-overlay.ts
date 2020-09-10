import {nodeMatchSelector, nodeContentStartsWith, hijackDOM, runInPageContext} from '../utils';
import {optionsStorage} from '../../options-storage';

interface VideoSource {
  type: string;
  src: string;
  label: string;
  selected: boolean;
};

declare const vsuri: any;

const onNewNode = (addedNode: any) => {
  if (nodeMatchSelector(addedNode, 'script[data-cfasync="false"]')) {
    addedNode.textContent = '';
    return true;
  }

  if (nodeMatchSelector(addedNode, 'script[type="text/javascript"]')) {
    if (nodeContentStartsWith(addedNode, 'var vsuri')) {
      addedNode.textContent = addedNode.textContent.replace(
        'var safeloadPBAFS = false;',
        'var safeloadPBAFS = true;'
      ).replace(
        'document.head.appendChild(importFAB);',
        ''
      );

      return true;
    }
  }

  return false;
};

(async () => {
  const {adblock, streamResolution} = await optionsStorage.getAll();

  if (adblock) {
    hijackDOM(document.documentElement, 2, onNewNode);

    const sendEvent = (streamResolution: string) => {
      jQuery(document).on('ready', () => {
        jQuery('.bruh-overlay').remove();

        jQuery.getJSON(vsuri, function(sources) {
          const player = videojs.getPlayer('video_player');
          const playerSources: VideoSource[] = [];
          let prefResolution = parseInt(streamResolution, 10);

          const resolutions = Object.keys(sources).sort((a, b) => {
            const c = parseInt(a, 10);
            const d = parseInt(b, 10);
            return isNaN(c) || isNaN(d) ? c > d ? 1 : -1 : c - d
          }).reverse();

          for (let resolution of resolutions) {
            resolution = resolution.split('x')[resolution.split('x').length - 1];
            const numericResolution = parseInt(resolution, 10);

            if (numericResolution === prefResolution || prefResolution > numericResolution) {
              prefResolution = numericResolution;
              break;
            }
          }

          resolutions.forEach(function(resolution) {
            const pureResolution = resolution.split('x')[resolution.split('x').length - 1];
            const numericResolution = parseInt(pureResolution, 10);
            const source: VideoSource = {
              type: 'video/mp4',
              src: sources[resolution],
              label: pureResolution + 'p',
              selected: numericResolution === prefResolution
            };
            playerSources.push(source);
          });

          player.src(playerSources);
        });
      });
    };

    document.addEventListener('DOMContentLoaded', () => {
      runInPageContext(sendEvent, true, streamResolution);
    });
  }
})();
