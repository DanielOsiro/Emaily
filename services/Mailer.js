const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = async ({ subject, recipients }, content) => {
  recipients = recipients.map(({ email }) => email);

  const msg = {
    to: recipients, // Change to your recipient
    from: "danielosiro@gmail.com", // Change to your verified sender
    subject: subject,
    text: content,
    html: content,
  };

  await sgMail
    .sendMultiple(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};
