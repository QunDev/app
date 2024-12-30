import PhoneService from "~/services/phone.service.ts";
import {CREATED, OK} from "~/core/success.reponse.ts";
import {NextFunction, Request, Response} from "express";
class PhoneController {
  static async addPhones(req: Request, res: Response, next: NextFunction) {
    const { phoneRecords, appId, countryId } = req.body;
    const result = await PhoneService.addPhones(phoneRecords, appId, countryId, req.apiKeyRecord?.userId as number);
    new CREATED({
      message: "Phones added successfully.",
      metadata: result.reduce((acc, item) => acc + item.count, 0),
    }).send(res);
  }

  static async getRandomPhone(req: Request, res: Response, next: NextFunction) {
    try {
      const randomPhone = await PhoneService.getRandomPhone();

      if (!randomPhone) {
        return res.status(404).json({
          message: "No phone number found that meets the criteria.",
        });
      }

      new OK({
        message: "Random phone number retrieved successfully.",
        metadata: { phoneNumber: randomPhone },
      }).send(res);
    } catch (error) {
      next(error);
    }
  }
}

export default PhoneController;