let db = require("./db");
let { sendEmail, sendSMS } = require("./twilio");

class Notification {
    constructor(tandaID, props = {}) {
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

        for (user of users) {
            let { email, sms } = shouldNotifyWith(user, notification);

            if (sms) {
                await sendSMS(user.phone, notification.toString());
            }

            if (email) {
                await sendEmail(user.email, notification.toString());
            }
        }
    }
}

class ClaimCreatedNotification extends Notification {
    constructor(tandaID, claimantID) {
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
        super(tandaID, { claimantID, approverID });
    }

    async prepare() {
        this.claimant = await db.getUserByID(this.claimantID);
        this.approver = await db.getUSerByID(this.approverID);
    }

    async render() {
        await this.ready;
        let { approver, claimant } = this;
        return `Claim approved by ${approver.name} for ${claimant.name}`;
    }
}

class PremiumPaidNotification extends Notification {
    constructor(tandaID, payerID) {
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

Notification.prototype.kind = null;
ClaimCreatedNotification.prototype.kind = "claim_created";
ClaimUpdatedNotification.prototype.kind = "claim_updated";
ClaimApprovedNotification.prototype.kind = "claim_approved";
PremiumPaidNotification.prototype.kind = "premium_paid";

function shouldNotifyWith(user, notification) {
    let settings = user.notificationSettings;

    let email = settings.email.includes(notification.kind);
    let sms = settings.sms.includes(notification.kind);

    return { email, sms };
}
