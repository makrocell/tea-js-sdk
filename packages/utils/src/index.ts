
import * as _ from 'lodash';
import moment from 'moment';
import * as uuid_pkg from 'uuid';

import crypto from './crypto';

export const uuid = (): string => {
  return uuid_pkg.v4();
};

export const sleep = (time: number) => {
  return new Promise((resolve) => setTimeout(resolve, time));
}
export const forge = require('node-forge');
export const axios = require('axios');

export {
  _,
  moment,
  crypto,
};
