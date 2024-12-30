import CountryPhoneRepository from "~/repositories/countryPhone.repository.ts";

class CountryPhoneService {
  static async create({country, numberCode, userId}: {
    country: string;
    numberCode: string;
    userId: number;
  }) {
    const countryPhone = await CountryPhoneRepository.findByCountryAndUserId({
      country,
      userId,
    });

    if (countryPhone) {
      throw new Error("Country Phone already exists.");
    }

    return CountryPhoneRepository.create({
      country,
      numberCode,
      userId,
    });
  }
}

export default CountryPhoneService;