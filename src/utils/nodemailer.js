const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'strongtechman@gmail.com',
    pass: 'mmls igfm lyis igtr'  // NOT your regular Gmail password
  }
});

async function sendTicket({ from, title, content, category, priority }) {
  const mailOptions = {
    from,
    to: 'chenbrian444@gmail.com',
    subject: title,
    text: content,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Mail sent:', info);
  } catch (err) {
    console.error("Error:", error);
  }
}

module.exports = { sendTicket }