import _ from 'lodash';

export const getInfoData = ({ fileds = [], object = {} }: {fileds: string[], object?: any}) => {
  return _.pick(object, fileds);
}