function requireRole(...allowed) {
  return function (req, res, next) {
    if(!req.user)
      return res.status(401).json({ message: "Not Authorized" });
    if(!allowed.includes(req.user.role))
      return res.status(403).json({ message: "Forbiddemn - Insufficient Role" });
    next();
  };
}

module.exports = requireRole;
