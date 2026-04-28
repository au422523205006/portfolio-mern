const checkAuth = (req, res, next) => {
  const token = req.headers.authorization;

  if (token === "secret123") {
    next();
  } else {
    res.status(403).json({ message: "Unauthorized ❌" });
  }
};

module.exports = checkAuth;