let mongoose = require("mongoose");
let assert = require("assert");
let { sendEmail, sendSMS } = require("./twilio");

let User = mongoose.model("users");
let Group = mongoose.model("groups");

class Notification {
    /**
     * @summary: Creates a generic Notification object. Needs only a `groupID`
     *           on the relevant request object (as do all Notifications)
     * @param req: The Express request object that triggered this notification
     * @returns: A new Notification object
     */
    constructor(req) {
        let { groupID } = req;
        assert(groupID != null);

        this.groupID = groupID;
        this.delivered = false;
    }

    /**
     * @summary: Produces notification text using data fetched by `.prepare`
     * @returns: The notification text
     */
    async render() {
        return "Test notification please ignore";
    }

    /**
     * @summary: Produces notification subject (if applicable)
     * @returns: The subject text
     */
    async renderSubject() {
        return "Test notification";
    }

    /**
     * @summary: Attempts to deliver the Notification to all members of its
     *           tanda. Respects each user's notification preferences
     * @returns: void
     */
    async deliver() {
        if (!this.delivered) this.delivered = true;
        else throw new Error("this notification has already been delivered");

        let userIDs = (await Group.findById(this.groupID)).members;
        let users = await Promise.all(userIDs.map(id => User.findById(id)));

        for (let user of users) {
            let { email, sms } = shouldNotifyWith(user, this);

            if (sms) {
                await sendSMS(user.phone, await this.render());
            }

            if (email) {
                await sendEmail(
                    user.email,
                    await this.renderSubject(),
                    await this.render()
                );
            }
        }
    }
}

class ClaimCreatedNotification extends Notification {
    /**
     * @summary: Creates a ClaimCreatedNotification to notify users that a
     *           claim has been created. Expects a claimantID on the req object
     * @param req: The Express request object that triggered this notification
     * @returns: The ClaimUpdatedNotification object
     */
    constructor(req) {
        let { claimantID } = req;
        super(req);

        assert(claimantID != null);
        this.claimantID = claimantID;

        this.ready = this.prepare();
    }

    /**
     * @summary: Fetches the claimant via their _id
     * @returns: void
     */
    async prepare() {
        this.claimant = await User.findById(this.claimantID);
    }

    /**
     * @summary: Generates notification text
     * @returns: The notification text
     */
    async render() {
        await this.ready;
        return `New claim created by ${this.claimant.name}`;
    }

    /**
     * @summary: Generates the notification subject text (if applicable)
     * @returns: The notification subject text
     */
    async renderSubject() {
        return "New Tanda claim";
    }
}

class ClaimUpdatedNotification extends Notification {
    /**
     * @summary: Creates a ClaimUpdatedNotification to notify users that a
     *           claim has been updated. Expects a claimantID on the req object
     * @param req: The Express request object that triggered this notification
     * @returns: The ClaimUpdatedNotification object
     */
    constructor(req) {
        let { claimantID } = req;
        super(req);

        assert(claimantID != null);
        this.claimantID = claimantID;

        this.ready = this.prepare();
    }

    /**
     * @summary: Fetches the claimant via their _id
     * @returns: void
     */
    async prepare() {
        this.claimant = await User.findById(this.claimantID);
    }

    /**
     * @summary: Generates notification text
     * @returns: The notification text
     */
    async render() {
        await this.ready;
        return `Claim updated by ${this.claimant.name}`;
    }

    /**
     * @summary: Generates the notification subject text (if applicable)
     * @returns: The notification subject text
     */
    async renderSubject() {
        return "Tanda claim details updated";
    }
}

class ClaimApprovedNotification extends Notification {
    /**
     * @summary: Creates a ClaimApprovedNotification to notify users that a
     *           claim has been approved. Expects a claimantID and approverID on
     *           the req object
     * @param req: The Express request object that triggered this notification
     * @returns: The ClaimApprovedNotification object
     */
    constructor(req) {
        let { claimantID, approverID } = req;
        super(req);

        assert(claimantID != null && approverID != null);
        this.claimantID = claimantID;
        this.approverID = approverID;

        this.ready = this.prepare();
    }

    /**
     * @summary: Fetches the claimant and approver via their _ids
     * @returns: void
     */
    async prepare() {
        this.claimant = await User.findById(this.claimantID);
        this.approver = await User.findById(this.approverID);
    }

    /**
     * @summary: Generates notification text
     * @returns: The notification text
     */
    async render() {
        await this.ready;
        let { approver, claimant } = this;
        return `Claim approved by ${approver.name} for ${claimant.name}`;
    }

    /**
     * @summary: Generates the notification subject text (if applicable)
     * @returns: The notification subject text
     */
    async renderSubject() {
        return "Tanda claim approved";
    }
}

class PremiumPaidNotification extends Notification {
    /**
     * @summary: Creates a PremiumPaidNotification to notify users that a
     *           peer has paid their premium.
     * @param req: The Express request object that triggered this notification
     * @returns: The PremiumPaidNotification object
     */
    constructor(req) {
        let { payerID } = req;
        super(req);

        assert(payerID != null);
        this.payerID = payerID;

        this.ready = this.prepare();
    }

    /**
     * @summary: Fetches the payer via their _id
     * @returns: void
     */
    async prepare() {
        this.payer = await User.findById(this.payerID);
    }

    /**
     * @summary: Generates notification text
     * @returns: The notification text
     */
    async render() {
        await this.ready;
        return `Premium paid by ${this.payer.name}`;
    }

    /**
     * @summary: Generates the notification subject text (if applicable)
     * @returns: The notification subject text
     */
    async renderSubject() {
        return "Tanda premium paid by " + this.payer.name;
    }
}

Notification.prototype.kind = "example";
ClaimCreatedNotification.prototype.kind = "claim_created";
ClaimUpdatedNotification.prototype.kind = "claim_updated";
ClaimApprovedNotification.prototype.kind = "claim_approved";
PremiumPaidNotification.prototype.kind = "premium_paid";

module.exports = {
    Notification,
    ClaimCreatedNotification,
    ClaimUpdatedNotification,
    ClaimApprovedNotification,
    PremiumPaidNotification,
};

/**
 * @summary: Determines by which methods (if any) this notification should be
 *           delivered to a given user
 * @param user: The user whose preferences are being checked
 * @param notification: The notification to be (potentially) delivered
 * @returns: An object whose keys are delivery methods and values are booleans
 */
function shouldNotifyWith(user, notification) {
    let { settings } = user;
    let { kind } = notification;

    let sms = settings.find(s => s.code == kind && s.domain == "sms") != null;
    let email =
        settings.find(s => s.code == kind && s.domain == "email") != null;

    return { sms, email };
}
