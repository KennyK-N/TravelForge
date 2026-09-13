export default function validateInput(schema, source = "body") {
  return (req, res, next) => {
    try {
      const result = schema.safeParse(req[source]);

      if (!result.success) {
        const issue = result.error.issues[0];

        const err = new Error(issue.message);
        err.data = issue;

        throw err;
      }

      req.validated = req.validated || {};
      req.validated[source] = result.data;
      next();
    } catch (err) {
      err.statusCode = 400;
      next(err);
    }
  };
}
