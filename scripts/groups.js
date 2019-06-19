let fs = require('fs')
let faker = require('faker')

let group = {
    secretary: {
        name: faker.name.findName(),
        email: faker.internet.email(),
        phone: faker.phone.phoneNumber(),
    },
    members: enumerate(50).map(() => ({
        name: faker.name.findName(),
        id: faker.random.uuid(),
        profile: '???',
        standing: faker.helpers.randomize(['good', 'okay', 'bad']),
    })),
    groupName: faker.address.country(),
    premium: faker.finance.amount(),
    groupDocs: [],
    groupStanding: 'good',
    subgroups: [],
}

fs.writeFileSync('client/src/data/group.json', JSON.stringify(group))

function enumerate(num) {
    let arr = []
    for (let i = 1; i <= num; i++) arr.push(i)
    return arr
}
