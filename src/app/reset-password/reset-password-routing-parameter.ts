/**
 * In a separate file (not in reset-password-routing.module.ts) so angular compiler does not warn about circular dependency
 * src/app/reset-password/reset-password.component.ts -> src/app/reset-password/reset-password-routing.module.ts -> src/app/reset-password/reset-password.component.ts
 */
export const RESET_PASSWORD_TOKEN_PARAM = 'resetPasswordToken';
