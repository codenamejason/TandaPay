/**
 * @summary
 * @param {Object} body
 * @param {Object} user
 * @returns {Boolean}
 */
function haveSettingsChanged(body, user) {
  const {
    name,
    email,
    phone,
    oldPassword,
    newPassword,
    confirmPassword
  } = body;
  return (
    name !== user.name ||
    email !== user.email ||
    phone !== user.phone ||
    oldPassword ||
    newPassword ||
    confirmPassword
  );
}

export { haveSettingsChanged };
