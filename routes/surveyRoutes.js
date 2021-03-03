const _ = require("lodash");
const { Path } = require("path-parser");
const { URL } = require("url");
const requireLogin = require("../middlewares/requireLogin");
const requireCredits = require("../middlewares/requireCredits");
const mongoose = require("mongoose");
const mailer = require("../services/mailer");
const surveyTemplate = require("../services/emailTemplates/surveyTemplate");

const Survey = mongoose.model("surveys");

module.exports = (app) => {
  app.get(
    ["/api/surveys", "/api/surveys/:page"],
    requireLogin,
    async (req, res) => {
      const limit = 5;
      const { page, skip, totalPages } = await require("../services/paginate")(
        "surveys",
        req.params.page,
        limit
      );

      const surveys = await Survey.find(
        {
          _user: req.user.id,
        },
        ["title", "body", "dateSent", "yes", "no"],
        {
          skip,
          limit,
          sort: {
            dateSent: -1,
          },
        }
      );

      res.send({ data: surveys, totalPages, page });
    }
  );

  app.get("/api/surveys/:surveyId/:choice", (req, res) => {
    res.send("Thanks for voting!");
  });

  app.post("/api/surveys/webhooks", (req, res) => {
    const p = new Path("/api/surveys/:surveyId/:choice");

    _.chain(req.body)
      .map(({ email, url }) => {
        const pathName = url ? new URL(url).pathname : "";
        const match = p.test(pathName);

        if (match) {
          return { email, surveyId: match.surveyId, choice: match.choice };
        }
      })
      .compact()
      .uniqBy("email", "surveyId")
      .each(({ surveyId, email, choice }) => {
        Survey.updateOne(
          {
            _id: surveyId,
            recipients: {
              $elemMatch: { email, responded: false },
            },
          },
          {
            $inc: { [choice]: 1 },
            $set: { "recipients.$.responded": true },
            lastResponded: new Date(),
          }
        ).exec();
      })
      .value();

    res.send({});
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
