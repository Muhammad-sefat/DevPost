export const emailVerificationTemplate = (
    name: string,
    otp: string
) => `
  <h2>Hello ${name},</h2>

  <p>Welcome to DevPost.</p>

  <p>Your verification code is:</p>

  <h1>${otp}</h1>

  <p>This code expires in 4 minutes.</p>
`;