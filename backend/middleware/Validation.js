const yup = require("yup");

function validation(schema) {
  return async function (req, res, next) {
    if (!req.body) return res.status(422).json({ error: "Empty body response is not expected" });

    const schemaToValidate = yup.object({
      body: schema,
    });

    try {
      await schemaToValidate.validate({ body: req.body }, { abortEarly: true });
      next();
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        res.status(422).json({ error: error.message });
      }
    }
  };
}

module.exports = validation;
