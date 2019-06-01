module.exports = unimplementedMiddleware;
function unimplementedMiddleware(req, res, next) {
    res.set("Content-Type", "text/plain");
    res.send(500, `[${req.method} ${req.path}] unimplemented\n`);
}

