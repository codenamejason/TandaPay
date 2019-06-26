// a simple placeholder controller to represent a route that is unimplemented

module.exports = unimplementedMiddleware;
/**
 * @summary: Responds to the request with 500, the path being requested, and the
 *           text "unimplemented".
 * @param req: The Express request object
 * @param res: The Express response object
 * @param next: The Express next function
 * @returns: void
 */
function unimplementedMiddleware(req, res, next) {
    res.set("Content-Type", "text/plain");
    res.send(500, `[${req.method} ${req.path}] unimplemented\n`);
}

