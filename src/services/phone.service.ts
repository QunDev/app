import * as phoneRepository from '~/repositories/phone.repository.ts';
import {ConflictError, NotFoundError, UnprocessableEntity} from '~/core/error.response.ts';

export const getAllPhones = async () => {
  return phoneRepository.getPhones();
};

export const getPhone = async (id: number) => {
  const phone = await phoneRepository.getPhoneById(id);
  if (!phone) {
    throw new NotFoundError('Phone not found');
  }
  return phone;
};

export const createNewPhones = async ({data, countryPhoneId, userId}: {data: any[], countryPhoneId: number, userId: number}) => {
  if (data.length > 200000) {
    throw new UnprocessableEntity('Cannot insert more than 100,000 records at once');
  }
  console.log(`Phones to insert: ${data[0]}`);

  // Check for duplicate phone numbers
  const existingPhones = await phoneRepository.getPhones();
  const existingNumbers = new Set(existingPhones.map(phone => phone.number));

  const uniquePhones = data.filter(phone => {
    return !existingNumbers.has(phone);
  });
  if (uniquePhones.length === 0) {
    throw new ConflictError('All phone numbers are duplicates');
  }

  // Add countryPhoneId and userId to each phone
  const phonesToInsert = uniquePhones.map(phone => ({
    number: phone,
    countryPhoneId,
    userId
  }));

  // Batch insert phones using transactions and parallel processing
  const batchSize = 1000; // Adjust batch size as needed
  const batches = [];
  for (let i = 0; i < phonesToInsert.length; i += batchSize) {
    batches.push(phonesToInsert.slice(i, i + batchSize));
  }

  await Promise.all(
    batches.map(batch => phoneRepository.createPhones(batch))
  );

  return { count: phonesToInsert.length };
};

export const updateExistingPhone = async (id: number, data: any) => {
  const phone = await phoneRepository.getPhoneById(id);
  if (!phone) {
    throw new NotFoundError('Phone not found');
  }

  if (!data || Object.keys(data).length === 0) {
    throw new UnprocessableEntity('At least one field is required');
  }

  return await phoneRepository.updatePhone(id, data);
};

export const removePhone = async (id: number) => {
  const phone = await phoneRepository.getPhoneById(id);
  if (!phone) {
    throw new NotFoundError('Phone not found');
  }

  await phoneRepository.deletePhone(id);
};

export const removeAllPhones = async () => {
  await phoneRepository.deleteAllPhones();
}

export const getRandomPhoneByAppId = async (appId: number) => {
  const phone = await phoneRepository.getRandomPhoneByAppId(appId);
  if (!phone) {
    throw new NotFoundError('Phone not found');
  }
  return phone;
};

export const updateMultiplePhones = async (data: { id: number, updateData: any }[]) => {
  if (!data || data.length === 0) {
    throw new UnprocessableEntity('No records to update');
  }

  return await phoneRepository.updatePhones(data);
};

export const updateAppIdAllPhones = async (appId: number, phoneIds: number[]) => {
  if (!phoneIds || phoneIds.length === 0) {
    throw new UnprocessableEntity('No phone IDs provided');
  }

  if (!appId) {
    throw new UnprocessableEntity('App ID is required');
  }

  const changePhoneIdsToNumber = phoneIds.map(phoneId => Number(phoneId));

  return await phoneRepository.updateAppIdAllPhones(appId, changePhoneIdsToNumber);
}