import _ from 'lodash'
import crypto from 'crypto'

export const getInfoData = ({ fileds = [], object = {} }: { fileds: string[]; object?: any }) => {
  return _.pick(object, fileds)
}

export function hashFunction(plaintext: string): string {
  return crypto.createHash('sha256').update(plaintext).digest('hex')
}

export function randomString(length: number) {
  let result = '';
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export const arrayAccount = [];