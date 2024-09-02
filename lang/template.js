require("dotenv").config();

module.exports.template = (body) => {

  body.companyName = process.env.BASE_DOMAIN; 

  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to SmartServe360!</title>
    <style>
      body {
        line-height: 1.6;
        margin: 0;
        padding: 0;
        background-color: #f2f2f2; /* Light gray background */
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #fff; /* White background for content area */
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Subtle shadow */
        border-radius: 5px;
        margin-top: 20px;
      }
      h1 {
        color: #333; /* Darker heading color */
        text-align: center;
        margin-bottom: 15px;
      }
      p {
        color: #666; /* Paragraph text color */
      }
      a {
        color: #2e7bff; /* Blue for links */
        text-decoration: none;
      }
      a:hover {
        text-decoration: underline; /* Underline on hover */
      }
      ul {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      li {
        margin-bottom: 10px;
      }
      li strong {
        color: #2e7bff; /* Bold text for credentials */
      }
      .signature {
        text-align: center;
        margin-top: 20px;
        color: #999;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Welcome to SmartServe360!</h1>
      <p style="color: #333;">Dear ${body?.fullName},</p>
      <p>We are delighted to inform you that an administrator has created an account for you at <a href="${body.companyName}">SmartServe360</a>.</p>
      <p>Here are your account details:</p>
      <ul>
        <li>Email: <strong style="color: #2e7bff;">${body?.email}</strong></li>
        <li>Password: <strong>${body?.password}</strong></li>
      </ul>
      <p>You can log in to your account using the provided credentials and access our services.</p>
      <p>If you have any questions or need assistance, please feel free to contact our support team at <a href="mailto:smartserve360@gmail.com">smartserve360@gmail.com</a>.</p>
      <p>Thank you for choosing SmartServe360. We look forward to serving you!</p>
      <div class="signature">
        <p>Best Regards,<br>SmartServe360 Team</p>
      </div>
    </div>
  </body>
  </html>
  `;
};
