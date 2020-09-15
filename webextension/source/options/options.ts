import * as browser from 'webextension-polyfill';
import { optionsStorage } from '../options-storage';

import './options.scss';

optionsStorage.syncForm('form');
browser;
