const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res
        .status(401)
        .json({ message: "Token is missing, Access denied!" });

    const token = authHeader.split(" ")[1];
    // console.log(token);

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(verified);
    req.user = verified;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token!" });
  }
};

module.exports = verifyToken;
