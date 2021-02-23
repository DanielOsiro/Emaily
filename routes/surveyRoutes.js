const requireLogin = require("../middlewares/requireLogin");
const requireCredits = require("../middlewares/requireCredits");
const mongoose = require("mongoose");
const mailer = require("../services/mailer");
const surveyTemplate = require("../services/emailTemplates/surveyTemplate");

const Survey = mongoose.model("surveys");

module.exports = (app) => {
  app.get("/api/surveys/thanks", (req, res) => {
    res.send("Thanks for voting!");
  });

  app.post("/api/surveys", requireLogin, requireCredits, async (req, res) => {
    const { title, body, subject, recipients } = req.body;

    const survey = new Survey({
      title,
      body,
      subject,
      recipients: recipients
        .split(",")
        .map((email) => ({ email: email.trim() })),
      _user: req.user.id,
      dateSent: Date.now(),
    });

    // Send email
    try {
      await mailer(survey, surveyTemplate(survey));
      await survey.save();

      req.user.credits--;

      const user = await req.user.save();

      res.send(user);
    } catch (err) {
      res.status(422).send(err);
    }
  });
};
