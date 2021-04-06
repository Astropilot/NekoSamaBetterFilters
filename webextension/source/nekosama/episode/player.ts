import $ from 'jquery';
import videojs from 'video.js';
require('@silvermine/videojs-quality-selector')(videojs);
import 'videojs-hotkeys';

import { optionsStorage } from '../../options-storage';

export interface VideoSource extends videojs.Tech.SourceObject {
  label: string;
  selected: boolean;
};

export function initPlayer(onActionCallback: (action: string) => void): videojs.Player {
  $('#display-player').html(`
  <video id="video_player" class="video-js vjs-big-play-centered" controls controlslist="nodownload" preload="none" poster="" data-matomo-title="mqn9EBYnlZQO1e7">
    <p class="vjs-no-js">To view this video please enable JavaScript, and consider upgrading to a web browser that <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a></p>
  </video>
`);

  class BrandButon extends videojs.getComponent('Component') {
    constructor(player: videojs.Player, options = {}) {
      super(player, options);
      this.addClass('vjs-custom-brand');
      $(this.el()).html('<a href="https://neko-sama.fr" target="_blank" rel="noopener noreferrer"></a>');
    }
  }

  class PreviousButton extends videojs.getComponent('Button') {
    constructor(player: videojs.Player, options = {}) {
      super(player, options);
      this.addClass('vjs-control-btn');
      this.controlText('Episode précédent');
      $('.vjs-icon-placeholder', this.el()).addClass('vjs-icon-previous-item');
    }

    handleClick() {
      onActionCallback('previous');
    }
  }

  class NextButton extends videojs.getComponent('Button') {
    constructor(player: videojs.Player, options = {}) {
      super(player, options);
      this.addClass('vjs-control-btn');
      this.controlText('Episode suivant');
      $('.vjs-icon-placeholder', this.el()).addClass('vjs-icon-next-item');
    }

    handleClick() {
      onActionCallback('next');
    }
  }

  videojs.registerComponent('previousButton', PreviousButton);
  videojs.registerComponent('nextButton', NextButton);
  videojs.registerComponent("brandButton", BrandButon);

  const player: videojs.Player = videojs('video_player', {
    playbackRates: [.25, .5, .75, 1, 1.25, 1.5, 1.75, 2],
    controlBar: {
      children: [
        'previousButton',
        'playToggle',
        'nextButton',
        'volumePanel',
        'currentTimeDisplay',
        'timeDivider',
        'remainingTimeDisplay',
        'progressControl',
        'brandButton',
        'playbackRateMenuButton',
        'descriptionsButton',
        'subsCapsButton',
        'qualitySelector',
        'fullscreenToggle',
      ]
    }
  });

  player.ready(async function () {
    (this as any).hotkeys({ // TODO: Need a proper fix to add the hotkey method to the interface to avoid casting into any
      volumeStep: 0.1,
      seekStep: 5,
      enableModifiersForNumbers: false
    });

    const { volume } = await optionsStorage.getAll();
    player.volume(volume);
  });
  player.on('volumechange', function () {
    optionsStorage.set({ volume: player.volume() });
  });

  return player;
}
