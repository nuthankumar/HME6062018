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
 * Expects To address and attachment for sending the details to sender
 * @param To: email id
 * @param attachment
 */

const send = (toAddress, attachment, callBack) => {
  let mailOptions = {
    from: process.env.SMTP_FROM,
    to: toAddress,
    subject: 'HME CLOUD: Summarized:',
    text:
      'This is a one-time email from HME CLOUD. You received this email because you requested this report to be sent to you.' +
      'No future email will be sent to you unless you make a request through HME CLOUD.',
    attachments: attachment
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error)
      callBack(false)
    } else {
      callBack(true)
    }
  })
}

module.exports = {
  send
}
