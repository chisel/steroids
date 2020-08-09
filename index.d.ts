import Util from './src/common/util';

declare global {

  interface SteroidsConfig {

    templatePath: string;
    assetsPath: string;
    util: Util;

  }

}
