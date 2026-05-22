import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'

dotenv.config()

const app = express()

app.use(cors({
  origin: [
    'https://xlive-pro.vercel.app',
    'http://localhost:5173'
  ],
  methods: ['POST'],
}))

app.use(express.json())

const PORT = process.env.PORT || 5000

// Mail transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
})

transporter.verify((error, success) => {
  if (error) {
    console.log("SMTP ERROR:", error)
  } else {
    console.log("SMTP READY")
  }
})

// Contact route
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      })
    }

    // Admin email
    const adminMail = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Contact Submission from ${name}`,
      html: `
<div style="margin:0;padding:40px 20px;background:#0a0a0a;font-family:Arial,sans-serif;color:#f5f1ea;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center">

        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:680px;background:#111111;border:1px solid rgba(255,255,255,0.06);border-radius:24px;overflow:hidden;">

          <!-- Top Accent -->
          <tr>
            <td style="height:4px;background:#e84530;"></td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:48px;">

              <p style="margin:0 0 12px;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#7d7d7d;">
                XLIVE CONTACT
              </p>

              <h1 style="margin:0 0 32px;font-size:34px;line-height:1.1;color:#f5f1ea;font-weight:700;">
                New Contact<br />
                Submission
              </h1>

              <table width="100%" cellpadding="0" cellspacing="0" border="0">

                <tr>
                  <td style="padding-bottom:20px;">
                    <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#7d7d7d;">
                      Name
                    </p>

                    <p style="margin:0;font-size:16px;color:#ffffff;">
                      ${name}
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding-bottom:20px;">
                    <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#7d7d7d;">
                      Email
                    </p>

                    <p style="margin:0;font-size:16px;color:#ffffff;">
                      ${email}
                    </p>
                  </td>
                </tr>

                <tr>
                  <td>
                    <p style="margin:0 0 12px;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#7d7d7d;">
                      Message
                    </p>

                    <div style="padding:24px;background:#171717;border-radius:18px;border:1px solid rgba(255,255,255,0.05);font-size:15px;line-height:1.8;color:#d8d8d8;">
                      ${message}
                    </div>
                  </td>
                </tr>

              </table>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</div>
`,
    }

    // User confirmation email
    const userMail = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'We Received Your Message | XLIVE',
      html: `
<div style="margin:0;padding:40px 20px;background:#0a0a0a;font-family:Arial,sans-serif;color:#f5f1ea;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center">

        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:680px;background:#111111;border:1px solid rgba(255,255,255,0.06);border-radius:24px;overflow:hidden;">

          <!-- Accent -->
          <tr>
            <td style="height:4px;background:#e84530;"></td>
          </tr>

          <!-- Main -->
          <tr>
            <td style="padding:48px;">

              <p style="margin:0 0 12px;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#7d7d7d;">
                XLIVE
              </p>

              <h1 style="margin:0 0 24px;font-size:38px;line-height:1.05;color:#f5f1ea;font-weight:700;">
                Thank You<br />
                For Reaching Out.
              </h1>

              <p style="margin:0 0 28px;font-size:16px;line-height:1.8;color:#b7b7b7;">
                We’ve received your message and our team will get back to you shortly.
              </p>

              <div style="padding:24px;background:#171717;border-radius:18px;border:1px solid rgba(255,255,255,0.05);margin-bottom:32px;">

                <p style="margin:0 0 10px;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#7d7d7d;">
                  Your Message
                </p>

                <p style="margin:0;font-size:15px;line-height:1.8;color:#d8d8d8;">
                  ${message}
                </p>

              </div>

              <p style="margin:0;font-size:14px;color:#8f8f8f;">
                — XLIVE Team
              </p>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</div>
`,
    }

    await transporter.sendMail(adminMail)
    await transporter.sendMail(userMail)

    return res.status(200).json({
      success: true,
      message: 'Message sent successfully',
    })
  } catch (error) {
    console.error(error)

    return res.status(500).json({
      success: false,
      message: 'Something went wrong',
    })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})