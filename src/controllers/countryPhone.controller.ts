import CountryPhoneService from "~/services/countryPhone.service.ts";
import {CREATED} from "~/core/success.reponse.ts";
import {getInfoData} from "~/utils";
import {NextFunction, Request, Response} from "express";

class CountryPhoneController {
  static async create(req: Request, res: Response, next: NextFunction) {
    const {country, numberCode} = req.body;
    const userId = req.apiKeyRecord?.userId as number;

    const countryNew = await CountryPhoneService.create({
      country,
      numberCode,
      userId
    });

    new CREATED({
      message: "Country Phone created successfully.",
      metadata: getInfoData({
        fileds: ["country", "numberCode"],
        object: countryNew,
      }),
    }).send(res);

  };
}

export default CountryPhoneController;