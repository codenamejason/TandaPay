let Notifications = require("../lib/notification.js");

module.exports = sendNotificationsMiddleware;
function sendNotificationsMiddleware(req, res, next) {
    let { tandaID, notificationKind } = req;
    let notification = createNotification(notificationKind, req);

    // this promise shouldn't be `await`ed because the request shouldn't
    // block on delivery. error handling happens inside .deliver()
    notification.deliver();

    next();
}

function createNotification(kind, req) {
    let NotificationImplementation = Object.values(Notifications).find(
        clazz => clazz.prototype.kind == kind
    );

    // passing a request object to the notification system smells like a leaky
    // abstraction but each notification implementation needs different data
    return new NotificationImplementation(req);
}
