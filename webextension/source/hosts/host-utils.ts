export interface VideoSource {
  type: string;
  src: string;
  label: string;
  selected: boolean;
};

export const playerOverlay = (playerId: string, host: string) => {
  const player = videojs.getPlayer(playerId);
  const Button = videojs.getComponent('Button');

  const PreviousButton = videojs.extend(Button, {
    constructor: function () {
      Button.apply(this, arguments);
      this.controlText('Episode précédent');
      jQuery('.vjs-icon-placeholder', this.el()).addClass('vjs-icon-previous-item');
    },
    handleClick: function () {
      window.top.postMessage({ action: 'previous', host: host }, 'https://www.neko-sama.fr');
    }
  });
  const NextButton = videojs.extend(Button, {
    constructor: function () {
      Button.apply(this, arguments);
      this.controlText('Episode suivant');
      jQuery('.vjs-icon-placeholder', this.el()).addClass('vjs-icon-next-item');
    },
    handleClick: function () {
      window.top.postMessage({ action: 'next', host: host }, 'https://www.neko-sama.fr');
    }
  });

  videojs.registerComponent('PreviousButton', PreviousButton);
  videojs.registerComponent('NextButton', NextButton);

  player.getChild('controlBar').addChild('previousButton', {}, 0);
  player.getChild('controlBar').addChild('nextButton', {}, 2);

  window.top.postMessage({ episodes: true, host: host }, 'https://www.neko-sama.fr');
  window.onmessage = function (event: MessageEvent<any>) {
    if (!Object.prototype.hasOwnProperty.call(event.data, 'isPrevious') ||
      !Object.prototype.hasOwnProperty.call(event.data, 'isNext')) {
      return;
    }

    if (event.data.isPrevious) {
      player.getChild('controlBar').getChild('previousButton').enable();
    } else {
      player.getChild('controlBar').getChild('previousButton').disable();
    }

    if (event.data.isNext) {
      player.getChild('controlBar').getChild('nextButton').enable();
    } else {
      player.getChild('controlBar').getChild('nextButton').disable();
    }
  };
};
