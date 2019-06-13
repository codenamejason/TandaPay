const faker = require("faker");
const fs = require("fs");

const generateClaims = (amount) => {
	const groupID = faker.random.uuid();
	const claims = [];
	for (var x = 0; x < amount; x++) {
		claims.push(createClaim(groupID));
	}
	const object = {
		claims: claims
	};
	const jsonObj = JSON.stringify(object);
	fs.writeFileSync("client/src/data/data.json", jsonObj);
};
const createClaim = (groupID) => {
	const type = Math.floor(Math.random() * Math.floor(2));
	const status = type === 0 ? "pending" : type === 1 ? "approved" : "denied";
	let claim = {
		objectID: faker.random.uuid(),
		groupID: groupID,
		groupName: faker.company.companyName(),
		subgroup: faker.name.title(),
		name: faker.name.findName(),
		amount: faker.finance.amount(),
		creatorID: faker.random.uuid(),
		summary: faker.lorem.paragraph(),
		documents: faker.lorem.paragraph(),
		status: status,
		imageURL: faker.image.imageUrl(),
		createdAt: faker.date.past()
	};
	return claim;
};

module.exports = {
	generateClaims
};
