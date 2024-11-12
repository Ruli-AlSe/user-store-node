import { Router } from 'express';
import { AuthController } from './controller';
import { AuthService } from '../service/auth.service';
import { EmailService } from '../service/email.service';
import { envs } from '../../config';

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();
    const emailService = new EmailService(
      envs.MAILER_SERVICE,
      envs.MAILER_EMAIL,
      envs.MAILER_SECRET_KEY
    );
    const authService = new AuthService(emailService);

    const controller = new AuthController(authService);

    router.post('/login', controller.loginUser);
    router.post('/register', controller.registerUser);

    router.get('/validate-email/:token', controller.validateEmail);

    return router;
  }
}
