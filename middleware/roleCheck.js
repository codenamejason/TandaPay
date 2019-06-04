/**
 * @summary: Creates a middleware that 403's if the req.user.role does not match
 *           the specified role.
 * @param roleRequired: The role to match agaist
 * @returns: void
 */
function createRoleCheck(roleRequired) {
    return function roleCheckMiddleware(req, res, next) {
        let { user } = req;

        if (user.role === roleRequired) {
            next();
        } else {
            return res.status(403).send({ error: "Incorrect role" });
        }
    };
}

// prettier-ignore
module.exports = {
           adminOnly: createRoleCheck("admin"),
       secretaryOnly: createRoleCheck("secretary"),
    policyholderOnly: createRoleCheck("policyholder"),
};
