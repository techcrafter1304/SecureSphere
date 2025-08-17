function admin(req, res, next) {
  if (!req.user.isAdmin) {
    return res.status(403).json({ msg: 'Admin resource. Access denied.' });
  }
  next();
}

module.exports = admin;
