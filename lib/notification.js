let db = require("./db");

class Notification {
    constructor(props) {
        Object.assign(this, props);
        this.ready = this.prepare();
    }

    async prepare() {}

    async render() {
        return "Test notification please ignore";
    }
}

class ClaimCreatedNotification extends Notification {
    constructor(tandaID, claimantID) {
        super({ tandaID, claimantID });
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
        super({ tandaID, claimantID });
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
        super({ tandaID, claimantID, approverID });
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
        super({ tandaID, payerID });
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
