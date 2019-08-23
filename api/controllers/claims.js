const mongoose = require("mongoose");
const Claim = mongoose.model("claims");

/**
 * @summary: Gets all claims associated with a user's group
 * @param req: The Express request object
 * @param res: The Express response object
 * @param next: The Express next function
 * @returns: void
 */
async function getAllClaims(req, res, next) {
    let { groupID } = req.user;
    try {
        let claims = await Claim.find({ groupID })
        res.status(200).send(claims);
    } catch(e) {
        res.status(500).send({ error: 'internal error' });
    }
}

/**
 * @summary: Creates a new claim
 * @param req: The Express request object
 * @param res: The Express response object
 * @param next: The Express next function
 * @returns: void
 */
async function createNewClaim(req, res, next) {
    let { summary, documents, amount } = req.body;

    if (summary.length < 10) {
        return res.status(400).send({ error: 'summary too short' });
    }

    if (documents.length < 1) {
        return res.status(400).send({ error: 'document(s) required' });
    }

    if (amount <= 0) {
        return res.status(400).send({ error: 'amount too low' });
    }

    let claim = new Claim({
        groupID: req.user.groupID,
        claimantID: req.user.id,
        claimantName: req.user.name,
        status: "pending",

        summary,
        documents,
        amount,
    });
    await claim.save();

    res.status(200).send(claim);
}

/**
 * @summary: Retrieves the claim doc via the request's params
 * @param req: The Express request object
 * @param res: The Express response object
 * @param next: The Express next function
 * @returns: void
 */
async function getClaimByID(req, res, next) {
    let { claimID } = req.params;
    if (!claimID) {
        return res.status(400).send({ error: "no :id" });
    }

    let claim;
    try {
        claim = await Claim.findById(claimID);
    } catch (e) {}

    if (!claim) {
        return res.status(404).send({ error: "no such claim" });
    }

    res.status(200).send(claim);
}

/**
 * @summary: Updates a claim
 * @param req: The Express request object
 * @param res: The Express response object
 * @param next: The Express next function
 * @returns: void
 */
async function updateClaimByID(req, res, next) {
    let { claimID } = req.params;

    if (!claimID) {
        return res.status(400).send({ error: "no :id" });
    }

    let claim;
    try {
        claim = await Claim.findById(claimID);
    } catch (e) {}

    if (!claim) {
        return res.status(404).send({ error: "no such claim" });
    }

    if (req.user._id.toString() != claim.claimantID) {
        return res.status(403).send({ error: "you do not have permission" });
    }

    let { summary, documents, amount } = req.body;

    if (summary) {
        if (summary.length < 10) {
            return res.status(400).send({ error: 'summary too short' });
        }

        claim.summary = summary;
    }

    if (documents) {
        if (documents.length < 1) {
            return res.status(400).send({ error: 'too few documents' });
        }

        claim.documents = documents;
    }

    if (amount) {
        if (amount <= 0) {
            return res.status(400).send({ error: 'amount too low' });
        }

        claim.amount = amount;
    }

    try {
        await claim.save();
    } catch(e) {
        res.status(500).send({ error: "internal error" });
    }

    res.status(200).send({ status: "ok" });
}

/**
 * @summary: Approves a claim
 * @param req: The Express request object
 * @param res: The Express response object
 * @param next: The Express next function
 * @returns: void
*/
async function approveClaimByID(req, res, next) {
    let { claimID } = req.params;

    if (!claimID) {
        return res.status(400).send({ error: "no :id" });
    }

    let claim = await Claim.findById(id);
    if (!claim) {
        return res.status(404).send({ error: "no such claim" });
    }

}

module.exports = {
    getAllClaims,
    createNewClaim,
    getClaimByID,
    updateClaimByID,
    approveClaimByID,
};
