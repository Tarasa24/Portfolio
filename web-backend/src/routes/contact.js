const nodemailer = require('nodemailer')

async function contact(req, res) {
  const name = req.body.name
  const email = req.body.email
  const text = req.body.text
  const lang = req.body.lang
  if (!name || !email || !text) return res.sendStatus(400)

  let transporter
  if (process.env.NODE_ENV === 'production')
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
  else {
    const account = await nodemailer.createTestAccount()
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: account.user,
        pass: account.pass,
      },
    })
  }

  const mail = {
    from:
      process.env.NODE_ENV === 'test'
        ? 'tarasa24@tarasa24.dev'
        : process.env.mailUser,
    replyTo: `${name} <${email}>`,
    to:
      process.env.NODE_ENV === 'test'
        ? 'tarasa24@tarasa24.dev'
        : process.env.mailUser,
    subject: `✉️ [tarasa24.dev] ${
      lang == 'cs' ? 'Zpráva od' : 'Message from'
    } ${name}`,
    text: text,
  }

  try {
    const info = await transporter.sendMail(mail)
    if (process.env.NODE_ENV === 'production') res.sendStatus(200)
    else res.send(nodemailer.getTestMessageUrl(info))
  } catch (error) {
    res.sendStatus(500)
    console.log(error)
  }
}

module.exports = contact
