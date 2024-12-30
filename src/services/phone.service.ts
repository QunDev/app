import PhoneRepository from "~/repositories/phone.repository.ts";

class PhoneService {
  static async addPhones(phoneRecords: Array<string>, appId: number, countryId: number, userId: number) {
    if (!phoneRecords || phoneRecords.length === 0) {
      throw new Error("No phone records provided.");
    }

    if (phoneRecords.length > 100_000) {
      throw new Error("You can only add up to 100,000 records at once.");
    }

    return PhoneRepository.batchCreate(phoneRecords, appId, countryId, userId);
  }

  static async getRandomPhone(): Promise<string | null> {
    return PhoneRepository.getRandomPhoneAndUpdate();
  }
}

export default PhoneService;