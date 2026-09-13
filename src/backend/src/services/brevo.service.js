import brevo from "#backend/brevo/brevoClient.js";
import config from "#backend/config/index.js";

export async function sendResetPasswordEmail({ user, url }) {
  await brevo.transactionalEmails.sendTransacEmail({
    sender: {
      name: config.APP_NAME,
      email: config.BREVO_SENDER_EMAIL,
    },
    to: [
      {
        email: user.email,
        name: user.name ?? "",
      },
    ],
    subject: "Reset your password",
    htmlContent: `
      <p>Hello ${user.name ?? "there"},</p>

      <p>You requested to reset your password.</p>

      <p>
        <a href="${url}">
          Reset your password
        </a>
      </p>

      <p>If you didn't request this, you can safely ignore this email.</p>
    `,
  });
}

export async function sendCreateTaskEmail({
  user,
  planName,
  startDate,
  endDate,
  toCity,
  toCountry,
  url,
}) {
  await brevo.transactionalEmails.sendTransacEmail({
    sender: {
      name: config.APP_NAME,
      email: config.BREVO_SENDER_EMAIL,
    },
    to: [
      {
        email: user.email,
        name: user.name ?? "",
      },
    ],
    subject: `Your travel plan "${planName}" is ready`,
    htmlContent: `
      <p>Hello ${user.name ?? "there"},</p>

      <p>Your travel plan details:</p>

      <p><strong>Plan Name:</strong> ${planName}</p>
      <p><strong>Destination:</strong> ${toCity}, ${toCountry}</p>
      <p><strong>Start Date:</strong> ${startDate.toISOString().split("T")[0]}</p>
      <p><strong>End Date:</strong> ${endDate.toISOString().split("T")[0]}</p>

      <p>
        <a href="${url}">
          View your travel plan
        </a>
      </p>

      <p>Thank you for using ${config.APP_NAME}.</p>
    `,
  });
}
