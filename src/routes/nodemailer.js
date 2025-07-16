const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password'  // NOT your regular Gmail password
  }
});

function sendTicket({ from, title, content }) {
  const mailOptions = {
    from,
    to: 'chenbrian444@gmail.com',
    subject: title,
    text: content,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error("Error:", error);
    }
    console.log("Email sent:", info.response);
  });
}

module.exports = { sendTicket }