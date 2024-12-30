import {prisma} from "~/utils/prismaClient.ts";

class CountryPhoneRepository {
  static async create({ country, numberCode, userId }: {country: string; numberCode: string, userId: number}) {
    return prisma.countryPhone.create({
      data: {
        country,
        numberCode,
        userId
      },
    });
  }

  static async findByCountryAndUserId({ country, userId }: {country: string; userId: number}) {
    return prisma.countryPhone.findFirst({
      where: {
        country,
        userId
      }
    });
  }
}

export default CountryPhoneRepository;