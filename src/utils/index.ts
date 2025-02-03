import _ from 'lodash'
import crypto from 'crypto'

export const getInfoData = ({ fileds = [], object = {} }: { fileds: string[]; object?: any }) => {
  return _.pick(object, fileds)
}

export function hashFunction(plaintext: string): string {
  return crypto.createHash('sha256').update(plaintext).digest('hex')
}

export const arrayAccount = [];