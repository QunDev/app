import * as countryPhoneRepository from '~/repositories/countryPhone.repository.ts';
import {ConflictError, NotFoundError, UnprocessableEntity} from '~/core/error.response.ts';

export const getAllCountryPhones = async () => {
  return await countryPhoneRepository.getCountryPhones();
};

export const getCountryPhone = async (id: number) => {
  const countryPhone = await countryPhoneRepository.getCountryPhoneById(id);
  if (!countryPhone) {
    throw new NotFoundError('Country phone not found');
  }
  return countryPhone;
};

export const createNewCountryPhone = async (data: any) => {
  const {country, numberCode} = data;

  // Check if numberCode already exists
  const existingCountryPhone = await countryPhoneRepository.getCountryPhoneByNumberCode(numberCode);
  if (existingCountryPhone) {
    throw new ConflictError('Number code already in use');
  }

  // Create the country phone
  const newCountryPhone = await countryPhoneRepository.createCountryPhone(data);
  return newCountryPhone;
};

export const updateExistingCountryPhone = async (id: number, data: any) => {
  const countryPhone = await countryPhoneRepository.getCountryPhoneById(id);
  if (!countryPhone) {
    throw new NotFoundError('Country phone not found');
  }

  // Check if numberCode already exists
  if (data.numberCode && data.numberCode !== countryPhone.numberCode) {
    const existingCountryPhone = await countryPhoneRepository.getCountryPhoneByNumberCode(data.numberCode);
    if (existingCountryPhone) {
      throw new ConflictError('Number code already in use');
    }
  }

  if (!data || Object.keys(data).length === 0) {
    throw new UnprocessableEntity('At least one field is required');
  }

  return await countryPhoneRepository.updateCountryPhone(id, data);
};

export const removeCountryPhone = async (id: number) => {
  const countryPhone = await countryPhoneRepository.getCountryPhoneById(id);
  if (!countryPhone) {
    throw new NotFoundError('Country phone not found');
  }

  await countryPhoneRepository.deleteCountryPhone(id);
};