// Helper Functions
function loginCheck(req, res, next) {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.sendStatus(404);
  }
}

function refreshSession(req, res, next) {
  if (req.session) {
    req.session.touch();
  }
  next();
}

function doNotCache(req, res, next) {
  res.set({
    "Cache-Control": "no-store, no-cache, must-revalidate, private",
    Pragma: "no-cache",
    Expires: "0",
  });
  next();
}

// Redirect from login page to admin console if already logged in
function redirect(req, res, next) {
  if (req.session.userId) {
    return res.redirect(
      `http://joegallina.com/portfolio/charisma${process.env.SECRET1}`
    );
  }
  next();
}

module.exports = { loginCheck, refreshSession, doNotCache, redirect };
