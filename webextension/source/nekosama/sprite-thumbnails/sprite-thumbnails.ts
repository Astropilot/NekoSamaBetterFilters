import videojs, { VideoJsPlayer } from 'video.js';


const Plugin = videojs.getPlugin('plugin');

export interface SpriteThumbnailsPluginOptions {
  url: string;
  width: number;
  height: number;
  interval?: number;
  responsive?: number;
}

class SpriteThumbnailsPlugin extends Plugin {

  static defaultOptions: SpriteThumbnailsPluginOptions = {
    url: '',
    width: 0,
    height: 0,
    interval: 1,
    responsive: 600
  }

  options: SpriteThumbnailsPluginOptions;

  constructor(player: VideoJsPlayer, options?: SpriteThumbnailsPluginOptions) {
    super(player);

    this.options = videojs.mergeOptions(SpriteThumbnailsPlugin.defaultOptions, options);

    const url = this.options.url;
    const height = this.options.height;
    const width = this.options.width;
    const responsive = this.options.responsive!;
    const interval = this.options.interval!;

    this.player.ready(() => {
      const dom = videojs.dom || videojs;
      const controls = player.controlBar;
      const progress = (controls as any).progressControl;
      const seekBar = progress.seekBar;
      const seekBarEl = seekBar.el();
      const mouseTimeDisplay = seekBar.mouseTimeDisplay;


    })
  }

  tooltipStyle(mouseTimeDisplay: any, obj: {[key: string]: string}) {
    Object.keys(obj).forEach((key) => {
      const val = obj[key];
      const ttstyle = mouseTimeDisplay.timeTooltip.el().style;

      if (val !== '') {
        ttstyle.setProperty(key, val);
      } else {
        ttstyle.removeProperty(key);
      }
    });
  };
}

(SpriteThumbnailsPlugin as any).defaultState = {};

(SpriteThumbnailsPlugin as any).VERSION = '1.0.0';

videojs.registerPlugin('spriteThumbnails', SpriteThumbnailsPlugin);

declare module 'video.js' {
  export interface VideoJsPlayer {
    spriteThumbnails: (options?: SpriteThumbnailsPluginOptions) => SpriteThumbnailsPlugin;
  }

  export interface VideoJsPlayerPluginOptions {
    examplePlugin?: SpriteThumbnailsPluginOptions;
  }
}


export default SpriteThumbnailsPlugin;

/**
 * Set up sprite thumbnails for a player.
 *
 * @function spriteThumbs
 * @param {Player} player
 *        The current player instance.
 * @param {Object} options
 *        Configuration options.
 */
function spriteThumbs(player: videojs.Player, options: SpriteConfig) {
  const url = options.url;
  const height = options.height;
  const width = options.width;
  const responsive = options.responsive;

  const dom = videojs.dom || videojs;
  const controls = player.controlBar;
  const progress = (controls as any).progressControl;
  const seekBar = progress.seekBar;
  const seekBarEl = seekBar.el();
  const mouseTimeDisplay = seekBar.mouseTimeDisplay;

  const tooltipStyle = (obj: {[key: string]: string}) => {
    Object.keys(obj).forEach((key) => {
      const val = obj[key];
      const ttstyle = mouseTimeDisplay.timeTooltip.el().style;

      if (val !== '') {
        ttstyle.setProperty(key, val);
      } else {
        ttstyle.removeProperty(key);
      }
    });
  };

  if (url && height && width && mouseTimeDisplay) {
    const img = dom.createEl('img', {
      src: url
    });

    const hijackMouseTooltip = (evt: any) => {
      const imgWidth = img.naturalWidth;
      const imgHeight = img.naturalHeight;

      if (player.controls() && imgWidth && imgHeight) {
        let position = dom.getPointerPosition(seekBarEl, evt).x * player.duration();

        position = position / options.interval!;

        const playerWidth = player.currentWidth();
        const scaleFactor = responsive && playerWidth < responsive ?
          playerWidth / responsive : 1;
        const columns = imgWidth / width;
        const scaledWidth = width * scaleFactor;
        const scaledHeight = height * scaleFactor;
        const cleft = Math.floor(position % columns) * -scaledWidth;
        const ctop = Math.floor(position / columns) * -scaledHeight;
        const bgSize = (imgWidth * scaleFactor) + 'px ' +
                       (imgHeight * scaleFactor) + 'px';
        const controlsTop = dom.findPosition(controls.el()).top;
        const seekBarTop = dom.findPosition(seekBarEl).top;
        // top of seekBar is 0 position
        const topOffset = -scaledHeight - Math.max(0, seekBarTop - controlsTop);

        tooltipStyle({
          'width': scaledWidth + 'px',
          'height': scaledHeight + 'px',
          'background-image': 'url(' + url + ')',
          'background-repeat': 'no-repeat',
          'background-position': cleft + 'px ' + ctop + 'px',
          'background-size': bgSize,
          'top': topOffset + 'px',
          'color': '#fff',
          'text-shadow': '1px 1px #000',
          'border': '1px solid #000',
          'margin': '0 1px'
        });
      }
    };

    progress.off('mousemove', hijackMouseTooltip);
    progress.off('touchmove', hijackMouseTooltip);
    player.removeClass('vjs-sprite-thumbnails');

    tooltipStyle({
      'width': '',
      'height': '',
      'background-image': '',
      'background-repeat': '',
      'background-position': '',
      'background-size': '',
      'top': '',
      'color': '',
      'text-shadow': '',
      'border': '',
      'margin': ''
    });

    progress.on('mousemove', hijackMouseTooltip);
    progress.on('touchmove', hijackMouseTooltip);
    player.addClass('vjs-sprite-thumbnails');
  } else {
    player.removeClass('vjs-sprite-thumbnails');

    tooltipStyle({
      'width': '',
      'height': '',
      'background-image': '',
      'background-repeat': '',
      'background-position': '',
      'background-size': '',
      'top': '',
      'color': '',
      'text-shadow': '',
      'border': '',
      'margin': ''
    });
  }
}
