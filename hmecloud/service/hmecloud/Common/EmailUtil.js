require('dotenv').config()
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secureConnection: false,
  auth: {
    user: process.env.SMTP_USER_NAME,
    pass: process.env.SMTP_PASSWORD
  },
  tls: {
    ciphers: 'SSLv3'
  }
})

/**
 * Send Email to specfied to Address
 * @param toAddress email id
 * @param subject :file type time measure report from date- to date (ReportTemplate_Type) // HME CLOUD: Summarized CSV Daypart Report 2018-03-09  - 2018-03-09  (Cumulative)
 * @param attachment
 */

const send = (toAddress, subject, attachment, callBack) => {
  let mailOptions = {
    from: process.env.SMTP_FROM,
    to: toAddress,
    subject: 'HME CLOUD: Summarized' + subject,
    text:
      'This is a one-time email from HME CLOUD. You received this email because you requested this report to be sent to you.' +
      'No future email will be sent to you unless you make a request through HME CLOUD.',
    attachments: attachment
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      callBack(false)
    } else {
      callBack(true)
    }
  })
}

module.exports = {
  send
}
