const validate = (schema) => (req, res, next) => {
  const data = {
    body: req.body,
    params: req.params,
    query: req.query,
  };

  const result = schema.safeParse(data);

  if (!result.success) {
    const errors = {};

    result.error.issues.forEach((issue) => {
      const field = issue.path.join(".");
      errors[field] =
        issue.code === "invalid_type" ? `${field} is required` : issue.message;
    });

    return res.status(400).json({
      message: "Validation error",
      errors,
    });
  }

  req.body = result.data.body ?? result.data;
  next();
};

export default validate;
