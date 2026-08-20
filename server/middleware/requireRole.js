/**
 * TASK 7.1 - Authorization, not authentication.
 *
 * requireRole is a middleware FACTORY: requireRole("staff") returns a middleware.
 *
 *   - no req.user            -> 401 (we do not know you)
 *   - role not in allowed    -> 403 (we know you, and the answer is no)
 *   - otherwise              -> next()
 *
 * Use rest parameters so requireRole("staff", "admin") also works.
 * It must always run AFTER protect, because it reads req.user.
 */
function requireRole(...allowed) {
  return function (req, res, next) {
    // TODO (Task 7.1): implement the two checks described above
    return res
      .status(500)
      .json({ msg: "requireRole() is not implemented yet - see Task 7.1" });
  };
}

module.exports = requireRole;
