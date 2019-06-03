let Notifications = require("../lib/notification.js");

module.exports = sendNotificationsMiddleware;
/**
 * @summary: A middleware to send notifications. Behavior defined by the
 *           notificationKind prop on the req object hopefully set by a previous
 *           controller
 * @param req: The Express request object
 * @param res: The Express response object
 * @param next: The Express next function
 * @returns: void
 */
function sendNotificationsMiddleware(req, res, next) {
    let { tandaID, notificationKind } = req;
    let notification = createNotification(notificationKind, req);

    // this promise shouldn't be `await`ed because the request shouldn't
    // block on delivery. error handling happens inside .deliver()
    notification.deliver();

    next();
}

/**
 * @summary: Instantiates the correct subclass of Notification specified by kind
 * @param kind: The Notification.prototype.kind to match against
 * @param req: The Express request object
 * @returns: void
 */
function createNotification(kind, req) {
    let NotificationImplementation = Object.values(Notifications).find(
        clazz => clazz.prototype.kind == kind
    );

    // passing a request object to the notification system smells like a leaky
    // abstraction but each notification implementation needs different data
    return new NotificationImplementation(req);
}
