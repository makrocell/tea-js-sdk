
import * as _ from 'lodash';
import moment from 'moment';
import * as uuid_pkg from 'uuid';

export const uuid = (): string => {
  return uuid_pkg.v4();
};

export const sleep = (time: number) => {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export {
  _,
  moment,
};
