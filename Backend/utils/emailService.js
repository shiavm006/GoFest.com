import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendRegistrationEmail(registration) {
  const { user, fest } = registration;

  if (!user?.email) return;

  const to = user.email;
  const subject = `Registration confirmed for ${fest.title}`;

  const html = `
    <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #111827;">
      <div style="max-width: 640px; margin: 0 auto; padding: 24px;">
        <div style="border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
          <div style="background: linear-gradient(135deg, #2563eb, #4f46e5); padding: 20px 24px; color: white;">
            <h1 style="margin: 0; font-size: 20px; font-weight: 600;">Your registration is confirmed 🎉</h1>
            <p style="margin: 4px 0 0; font-size: 14px; opacity: 0.9;">
              Thank you for registering for ${fest.title}.
            </p>
          </div>
          <div style="padding: 20px 24px; background-color: #ffffff;">
            <p style="margin-top: 0;">Hi ${user.name || "there"},</p>
            <p>
              You have successfully registered for
              <strong>${fest.title}</strong> hosted by
              <strong>${fest.college}</strong>.
            </p>
            <div style="margin: 16px 0; padding: 12px 14px; background-color: #f9fafb; border-radius: 10px; border: 1px solid #e5e7eb; font-size: 14px;">
              <p style="margin: 0 0 6px; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 0.06em; color: #6b7280;">
                Event details
              </p>
              <p style="margin: 0;"><strong>📅 Date:</strong> ${fest.date}</p>
              <p style="margin: 0;"><strong>📍 Location:</strong> ${fest.location?.city}, ${fest.location?.state}</p>
              <p style="margin: 0;"><strong>🏷️ Entry:</strong> ${
                fest.entryType === "Paid" ? `Paid (₹${fest.entryFee || 0})` : "Free"
              }</p>
            </div>
            <p style="margin: 16px 0 0; font-size: 13px; color: #6b7280;">
              Registration ID:
              <span style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;">
                ${registration._id}
              </span>
            </p>
            <p style="margin: 16px 0 0;">
              We’re excited to see you at the fest! If you have any questions, you can reach out to the organizer at
              <strong>${fest.organizer?.email || "their listed contact"}</strong>.
            </p>
          </div>
          <div style="padding: 12px 24px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center; font-size: 12px; color: #9ca3af;">
            <p style="margin: 0;">Sent by GoFest.com</p>
          </div>
        </div>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      to,
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      subject,
      html,
    });
  } catch (error) {
    console.error("Failed to send registration email:", error);
  }
}

export async function sendOrganizerNotification(registration) {
  const { user, fest } = registration;
  const organizerEmail = fest.hostedBy?.email || fest.organizer?.email;

  if (!organizerEmail) {
    console.log("No organizer email found for fest:", fest.title);
    return;
  }

  const subject = `New registration for ${fest.title}`;

  const html = `
    <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #111827;">
      <div style="max-width: 640px; margin: 0 auto; padding: 24px;">
        <div style="border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
          <div style="background-color: #111827; padding: 18px 24px; color: white;">
            <h1 style="margin: 0; font-size: 18px; font-weight: 600;">New registration received</h1>
          </div>
          <div style="padding: 20px 24px; background-color: #ffffff; font-size: 14px;">
            <p style="margin-top: 0;">Hi ${fest.organizer?.name || "Organizer"},</p>
            <p>
              A new participant has registered for <strong>${fest.title}</strong>.
            </p>
            <div style="margin: 16px 0; padding: 12px 14px; background-color: #f9fafb; border-radius: 10px; border: 1px solid #e5e7eb;">
              <p style="margin: 0 0 6px; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 0.06em; color: #6b7280;">
                Participant
              </p>
              <p style="margin: 0;"><strong>Name:</strong> ${user.name}</p>
              <p style="margin: 0;"><strong>Email:</strong> ${user.email}</p>
              ${user.college ? `<p style="margin: 0;"><strong>College:</strong> ${user.college}</p>` : ""}
            </div>
            <p style="margin: 16px 0 0; font-size: 13px; color: #6b7280;">
              Total registrations count in the dashboard may take a short time to update.
            </p>
          </div>
          <div style="padding: 12px 24px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center; font-size: 12px; color: #9ca3af;">
            <p style="margin: 0;">GoFest.com organizer notification</p>
          </div>
        </div>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      to: organizerEmail,
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      subject,
      html,
    });
  } catch (error) {
    console.error("Failed to send organizer notification:", error);
  }
}


