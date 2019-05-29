let db = require("./db");
let assert = require('assert')
let { sendEmail, sendSMS } = require("./twilio");

class Notification {
    constructor(tandaID, props = {}) {
        assert(tandaID != null)

        this.tandaID = tandaID;
        this.delivered = false;

        Object.assign(this, props);
        this.ready = this.prepare();
    }

    async prepare() {}

    async render() {
        return "Test notification please ignore";
    }

    async deliver() {
        if (!this.delivered) this.delivered = true;
        else throw new Error("this notification has already been delivered");

        let userIDs = (await db.getTandaByID()).members;
        let users = await Promise.all(userIDs.map(db.getUserByID));

        for (let user of users) {
            let { email, sms } = shouldNotifyWith(user, this);

            if (sms) {
                await sendSMS(user.phone, await this.render());
            }

            if (email) {
                await sendEmail(user.email, await this.render());
            }
        }
    }
}

class ClaimCreatedNotification extends Notification {
    constructor(tandaID, claimantID) {
        assert(claimantID != null)
        super(tandaID, { claimantID });
    }

    async prepare() {
        this.claimant = await db.getUserByID(this.claimantID);
    }

    async render() {
        await this.ready;
        return `New claim created by ${this.claimant.name}`;
    }
}

class ClaimUpdatedNotification extends Notification {
    constructor(tandaID, claimantID) {
        assert(claimantID != null)
        super(tandaID, { claimantID });
    }

    async prepare() {
        this.claimant = await db.getUserByID(this.claimantID);
    }

    async render() {
        await this.ready;
        return `Claim updated by ${this.claimant.name}`;
    }
}

class ClaimApprovedNotification extends Notification {
    constructor(tandaID, claimantID, approverID) {
        assert(claimantID != null && approverID != null)
        super(tandaID, { claimantID, approverID });
    }

    async prepare() {
        this.claimant = await db.getUserByID(this.claimantID);
        this.approver = await db.getUserByID(this.approverID);
    }

    async render() {
        await this.ready;
        let { approver, claimant } = this;
        return `Claim approved by ${approver.name} for ${claimant.name}`;
    }
}

class PremiumPaidNotification extends Notification {
    constructor(tandaID, payerID) {
        assert(payerID != null)
        super(tandaID, { payerID });
    }

    async prepare() {
        this.payer = await db.getUserByID(this.payerID);
    }

    async render() {
        await this.ready;
        return `Premium paid by ${this.payer.name}`;
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

function shouldNotifyWith(user, notification) {
    let settings = user.notificationSettings;

    let email = settings.email.includes(notification.kind);
    let sms = settings.sms.includes(notification.kind);

    return { email, sms };
}
