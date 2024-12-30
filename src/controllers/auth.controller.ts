import {NextFunction, Request, Response} from "express";
import {AuthService} from "~/services/auth.service.ts";
import {CREATED} from "~/core/success.reponse.ts";
import {getInfoData} from "~/utils";
import {ApiKeyService} from "~/services/apiKeyService.ts";

class AuthController {
  /**
   * Signup a new user
   * @param req - Express Request
   * @param res - Express Response
   * @param next - Express NextFunction
   */
  static async signup(req: Request, res: Response, next: NextFunction) {
    const {name, email, password} = req.body;

    // Signup the user via the service
    const user = await AuthService.signup(name, email, password);

    // create apiKey
    const apiKey = await ApiKeyService.createApiKey(name, user.user.id, -1, null);

    // Send a success response
    new CREATED({
      message: "User created successfully",
      metadata: {
        user: getInfoData({fileds: ['name', 'email'], object: user.user}),
        apiKey: getInfoData({fileds: ['key'], object: apiKey})
      }
    }).send(res);
  }
}

export default AuthController;