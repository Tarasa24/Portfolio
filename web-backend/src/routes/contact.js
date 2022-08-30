const nodemailer = require('nodemailer')
const emailValidator = require('deep-email-validator')

async function contact(req, res) {
  const name = req.body.name
  const email = req.body.email
  const text = req.body.text
  const lang = req.body.lang
  if (!name || !email || !text) {
    return res.status(400).json({
      error: 'Please fill in all fields',
    })
  }

  const validationResult = await emailValidator.validate({
    email: email,
    validateRegex: true,
    validateMx: true,
    validateTypo: false,
    validateDisposable: true,
    validateSMTP: false,
  })
  if (!validationResult.valid) {
    return res.status(400).json({
      error: 'Please enter a valid email address | ' + validationResult.reason,
    })
  }

  let transporter
  transporter = nodemailer.createTransport({
    host: process.env.mailHost,
    port: 465,
    secure: true,
    auth: {
      user: process.env.mailUser,
      pass: process.env.mailPass,
    },
    tls: {
      servername: 'mail.tarasa24.dev',
    },
  })

  const mail = {
    from: process.env.mailUser ?? 'tarasa24@tarasa24.dev',
    replyTo: `${name} <${email}>`,
    to: process.env.mailUser ?? 'tarasa24@tarasa24.dev',
    subject: `✉️ [tarasa24.dev] ${
      lang == 'cs' ? 'Zpráva od' : 'Message from'
    } ${name}`,
    text: text,
  }

  try {
    await transporter.sendMail(mail)
    res.sendStatus(200)
  } catch (error) {
    res.status(500).json({
      error,
    })
  }
}

module.exports = contact
