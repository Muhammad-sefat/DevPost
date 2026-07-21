export const forgotPasswordTemplate = (
    name: string,
    otp: string
) => `
  <h2>Hello ${name},</h2>

  <p>You requested to reset your password on DevPost.</p>

  <p>Your password reset verification code is:</p>

  <h1>${otp}</h1>

  <p>This code expires in 4 minutes. If you did not request this, please ignore this email.</p>
`;
