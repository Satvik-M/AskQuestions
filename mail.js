const nodemailer = require("nodemailer");

module.exports.client = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  secure: false,
  auth: {
    user: "apikey",
    pass: "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",
  },
});
module.exports.email = {
  from: "satvikmakharia@gmail.com",
  to: "kingpinthe5@gmail.com",
  subject: "Hello",
  text: "Hello world",
  html: "<b>Hello world</b>",
};

// client.sendMail(email, function (err, info) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("Message sent: " + info.response);
//   }
// });

// use this funtion where you want your email to be sent
