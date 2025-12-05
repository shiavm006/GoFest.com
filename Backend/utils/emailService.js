import sgMail from "@sendgrid/mail";

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export async function sendRegistrationEmail(registration) {
  const { user, fest } = registration;

  if (!user?.email) return;
  console.log("Sending registration email to:", user.email);
  const to = user.email;
  const subject = `Registration confirmed for ${fest.title}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f5f5f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f7; padding: 48px 16px;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);">
              <tr>
                <td style="padding: 48px 40px 40px;">
                  <div style="margin-bottom: 32px;">
                    <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #007AFF 0%, #5856D6 100%); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 24px;">
                      <span style="font-size: 24px;">✓</span>
                    </div>
                    <h1 style="margin: 0 0 8px; font-size: 28px; font-weight: 600; color: #1d1d1f; letter-spacing: -0.5px; line-height: 1.2;">Registration Confirmed</h1>
                    <p style="margin: 0; font-size: 17px; color: #86868b; line-height: 1.5;">Thank you for registering for ${fest.title}</p>
                  </div>
                  
                  <div style="margin-bottom: 40px;">
                    <p style="margin: 0 0 24px; font-size: 17px; color: #1d1d1f; line-height: 1.6;">Hi ${user.name || "there"},</p>
                    <p style="margin: 0 0 24px; font-size: 17px; color: #1d1d1f; line-height: 1.6;">
                      You're all set! Your registration for <strong style="color: #1d1d1f; font-weight: 600;">${fest.title}</strong> at <strong style="color: #1d1d1f; font-weight: 600;">${fest.college}</strong> has been confirmed.
                    </p>
                  </div>

                  <div style="background-color: #f5f5f7; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-bottom: 16px; border-bottom: 1px solid #e5e5e7;">
                          <div style="font-size: 13px; font-weight: 600; color: #86868b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Date</div>
                          <div style="font-size: 17px; color: #1d1d1f; font-weight: 500;">${fest.date}</div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 16px 0; border-bottom: 1px solid #e5e5e7;">
                          <div style="font-size: 13px; font-weight: 600; color: #86868b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Location</div>
                          <div style="font-size: 17px; color: #1d1d1f; font-weight: 500;">${fest.location?.city}, ${fest.location?.state}</div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top: 16px;">
                          <div style="font-size: 13px; font-weight: 600; color: #86868b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Entry</div>
                          <div style="font-size: 17px; color: #1d1d1f; font-weight: 500;">${
                            fest.entryType === "Paid" ? `₹${fest.entryFee || 0}` : "Free"
                          }</div>
                        </td>
                      </tr>
                    </table>
                  </div>

                  <div style="padding: 16px; background-color: #f5f5f7; border-radius: 8px; margin-bottom: 32px;">
                    <div style="font-size: 13px; color: #86868b; margin-bottom: 4px;">Registration ID</div>
                    <div style="font-family: 'SF Mono', 'Monaco', 'Menlo', monospace; font-size: 13px; color: #1d1d1f; font-weight: 500;">${registration._id}</div>
                  </div>

                  <p style="margin: 0; font-size: 15px; color: #86868b; line-height: 1.6;">
                    Questions? Contact the organizer at <a href="mailto:${fest.organizer?.email || ''}" style="color: #007AFF; text-decoration: none;">${fest.organizer?.email || "their listed contact"}</a>
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding: 24px 40px; background-color: #f5f5f7; border-top: 1px solid #e5e5e7;">
                  <p style="margin: 0; font-size: 13px; color: #86868b; text-align: center;">GoFest.com</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  try {
    await sgMail.send({
      to,
      from: process.env.EMAIL_FROM || process.env.SENDGRID_FROM_EMAIL || "noreply@gofest.com",
      subject,
      html,
    });
    console.log("Sent registration email to:", to);
  } catch (error) {
    console.error("Failed to send registration email:", error);
    if (error.response) {
      console.error("SendGrid error details:", error.response.body);
    }
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
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f5f5f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f7; padding: 48px 16px;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);">
              <tr>
                <td style="padding: 48px 40px 40px;">
                  <div style="margin-bottom: 32px;">
                    <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #34C759 0%, #30D158 100%); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 24px;">
                      <span style="font-size: 24px; color: #ffffff;">+</span>
                    </div>
                    <h1 style="margin: 0 0 8px; font-size: 28px; font-weight: 600; color: #1d1d1f; letter-spacing: -0.5px; line-height: 1.2;">New Registration</h1>
                    <p style="margin: 0; font-size: 17px; color: #86868b; line-height: 1.5;">Someone just registered for ${fest.title}</p>
                  </div>
                  
                  <div style="margin-bottom: 40px;">
                    <p style="margin: 0 0 24px; font-size: 17px; color: #1d1d1f; line-height: 1.6;">Hi ${fest.organizer?.name || "Organizer"},</p>
                    <p style="margin: 0 0 24px; font-size: 17px; color: #1d1d1f; line-height: 1.6;">
                      A new participant has registered for <strong style="color: #1d1d1f; font-weight: 600;">${fest.title}</strong>.
                    </p>
                  </div>

                  <div style="background-color: #f5f5f7; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
                    <div style="font-size: 13px; font-weight: 600; color: #86868b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 20px;">Participant Details</div>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-bottom: 16px; border-bottom: 1px solid #e5e5e7;">
                          <div style="font-size: 13px; font-weight: 600; color: #86868b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Name</div>
                          <div style="font-size: 17px; color: #1d1d1f; font-weight: 500;">${user.name}</div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 16px 0; ${user.college ? 'border-bottom: 1px solid #e5e5e7;' : ''}">
                          <div style="font-size: 13px; font-weight: 600; color: #86868b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Email</div>
                          <div style="font-size: 17px; color: #1d1d1f; font-weight: 500;"><a href="mailto:${user.email}" style="color: #007AFF; text-decoration: none;">${user.email}</a></div>
                        </td>
                      </tr>
                      ${user.college ? `
                      <tr>
                        <td style="padding-top: 16px;">
                          <div style="font-size: 13px; font-weight: 600; color: #86868b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">College</div>
                          <div style="font-size: 17px; color: #1d1d1f; font-weight: 500;">${user.college}</div>
                        </td>
                      </tr>
                      ` : ''}
                    </table>
                  </div>

                  <p style="margin: 0; font-size: 15px; color: #86868b; line-height: 1.6;">
                    View all registrations in your dashboard. The count may take a moment to update.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding: 24px 40px; background-color: #f5f5f7; border-top: 1px solid #e5e5e7;">
                  <p style="margin: 0; font-size: 13px; color: #86868b; text-align: center;">GoFest.com</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  try {
    await sgMail.send({
      to: organizerEmail,
      from: process.env.EMAIL_FROM || process.env.SENDGRID_FROM_EMAIL || "noreply@gofest.com",
      subject,
      html,
    });
    console.log("Sent organizer notification to:", organizerEmail);
  } catch (error) {
    console.error("Failed to send organizer notification:", error);
    if (error.response) {
      console.error("SendGrid error details:", error.response.body);
    }
  }
}


