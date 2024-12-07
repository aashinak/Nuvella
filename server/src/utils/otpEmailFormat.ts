const emailFormat = (
    otp: number,
    userName: string,
    usecase: string
): string => {
    const format = `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0;">
      <div style="background-color: #ffffff; max-width: 600px; margin: 20px auto; padding: 20px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);">
        <div style="text-align: center; background-color: #4CAF50; padding: 15px; border-radius: 8px 8px 0 0; color: white; font-size: 24px; font-weight: bold;">
          ${usecase}
        </div>
        <div style="padding: 30px; text-align: center;">
          <p style="font-size: 18px; color: #333; font-weight: 600; margin-bottom: 10px;">Hi ${userName},</p>
          <p style="font-size: 16px; color: #555; line-height: 1.6;">We received a request to access your account. Please use the following OTP to complete your verification:</p>
          <div style="margin: 20px auto; padding: 15px 30px; display: inline-block; background: linear-gradient(135deg, #4CAF50, #67e567); color: #fff; font-size: 32px; font-weight: bold; border-radius: 8px; letter-spacing: 4px;">
            ${otp}
          </div>
          <p style="font-size: 16px; color: #555; line-height: 1.6; margin-top: 20px;">This OTP is valid for the next <strong>5 minutes</strong>. If you did not request this, please ignore this email or contact support.</p>
        </div>
        <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 14px; color: #777; border-radius: 0 0 8px 8px;">
          <p style="margin: 0;">Thank you for using <strong>Nuvella</strong>!</p>
          <p style="margin: 5px 0;">Need help? <a href="mailto:revconnecthelp@gmail.com" style="color: #4CAF50; text-decoration: none;">Contact Support</a></p>
        </div>
      </div>
    </body>
    </html>`;
    return format;
};

export default emailFormat;
