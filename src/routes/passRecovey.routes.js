import { Router } from "express";
import { resetPasswordController } from '../controllers/resetPassword.controller.js';

export const passRecoveryRouter = Router();

// Ruta para solicitar la recuperación de contraseña
passRecoveryRouter.get('/forgot-password', resetPasswordController.renderForgotPasswordForm);

passRecoveryRouter.post('/forgot-password', resetPasswordController.sendResetEmail);

// Ruta para restablecer la contraseña
passRecoveryRouter.get('/reset-password/:token', resetPasswordController.renderResetPasswordForm);

passRecoveryRouter.post('/reset-password/:token', resetPasswordController.resetPassword);