const nodemailer = require('nodemailer');

async function contact(req, res) {
  const name = req.body.name;
  const email = req.body.email;
  const text = req.body.text;
  const lang = req.body.lang;
  if (!name || !email || !text) return res.sendStatus(400);

  const transporter = nodemailer.createTransport({
    host: process.env.NODE_ENV == 'production' ? 'mailserver.mailserver.svc.cluster.local' : 'mail.tarasa24.dev',
    port: 465,
    secure: true,
    auth: {
      user: 'tarasa24@tarasa24.dev',
      pass: process.env.emailPass,
    },
    tls: {
      servername: 'mail.tarasa24.dev',
    },
  });

  try {
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: 'tarasa24@tarasa24.dev',
      subject: `✉️ [tarasa24.dev] ${
        lang == 'cs' ? 'Zpráva od' : 'Message from'
      } ${name}`,
      text: text,
    });

    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
    console.log(error);
  }
}

module.exports = contact;

