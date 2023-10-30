db = db.getSiblingDB('fyp');

db.administrators.insertMany([
    {
        "_id": ObjectId("652d0bef7d4e65e143591c3f"),
        user: ObjectId("652d0bef7d4e65e143591c3a"),
        ID: 'Admin_0',
        __v: 0
    },
    {
        _id: ObjectId("652d0c0e7d4e65e143591c51"),
        user: ObjectId("652d0c0e7d4e65e143591c4e"),
        ID: 'Admin_1',
        __v: 0
    }
]
)


db.complainants.insertMany(
    [
        {
            _id: ObjectId("652d0e317d4e65e143591c5a"),
            user: ObjectId("652d0e317d4e65e143591c56"),
            activation: false,
            ID: 'Comp_0',
            __v: 0
        },
        {
            _id: ObjectId("652d0e467d4e65e143591c66"),
            user: ObjectId("652d0e467d4e65e143591c62"),
            activation: false,
            ID: 'Comp_1',
            __v: 0
        },
        {
            _id: ObjectId("652d0e4b7d4e65e143591c70"),
            user: ObjectId("652d0e4b7d4e65e143591c6c"),
            activation: false,
            ID: 'Comp_2',
            __v: 0
        }
    ]

)


db.organizations.insertMany(
    [
        {
            _id: ObjectId("652d0bef7d4e65e143591c30"),
            name: 'Eco Watch 1',
            contactNo: '+601234567891',
            address: 'Pandamaran, Port , SGR, Klang, 42000, Selangor, Malaysia',
            creationDate: ISODate("2023-10-16T10:09:51.041Z"),
            ID: 'OR_0',
            system: {
                autoActiveNewUser: false,
                defaultStatus: ObjectId("652d0bef7d4e65e143591c34"),
                _id: ObjectId("652d0bef7d4e65e143591c38")
            },
            __v: 0
        },
        {
            _id: ObjectId("652d0c0e7d4e65e143591c46"),
            name: 'Organization 2',
            contactNo: '+601234567891',
            address: 'Pandamaran, Port , SGR, Klang, 42000, Selangor, Malaysia',
            creationDate: ISODate("2023-10-16T10:10:22.120Z"),
            ID: 'OR_1',
            system: {
                autoActiveNewUser: false,
                defaultStatus: ObjectId("652d0c0e7d4e65e143591c48"),
                _id: ObjectId("652d0c0e7d4e65e143591c4c")
            },
            __v: 0
        }
    ]

)

db.status.insertMany([
    {
        _id: ObjectId("652d0bef7d4e65e143591c34"),
        desc: "Pending",
        organization: ObjectId("652d0bef7d4e65e143591c30"),
    },
    {
        _id:ObjectId("652d0bef7d4e65e143591c36"),
        desc: "Resolved",
        organization: ObjectId("652d0bef7d4e65e143591c30"),
    },
    {
        _id: ObjectId("652d0c0e7d4e65e143591c48"),
        desc: "Pending",
        organization: ObjectId("652d0c0e7d4e65e143591c46"),
    },
    {
        _id: ObjectId("652d0c0e7d4e65e143591c4a"),
        desc: "Resolved",
        organization: ObjectId("652d0c0e7d4e65e143591c46"),
    }
])


db.users.insertMany(
    [
        {
            _id: ObjectId("652d0bef7d4e65e143591c3a"),
            email: 'admin1@email.com',
            name: 'admin',
            password: {
                hashed: '$2b$10$9idLa/NyQJybtGS/ZH3zNuCQKQS7qyu9jZjpHbO/vBla6Ov3GA9VC',
                salt: '$2b$10$9idLa/NyQJybtGS/ZH3zNu'
            },
            organization: ObjectId("652d0bef7d4e65e143591c30"),
            role: 'admin',
            ID: 'UR_0',
            __v: 0
        },
        {
            _id: ObjectId("652d0c0e7d4e65e143591c4e"),
            email: 'admin2@email.com',
            name: 'admin',
            password: {
                hashed: '$2b$10$JWEbOhLGWcdaK/pJkM6IBe/Uxmt/HhVuxe/rf8S3rStvYPDIKzwqK',
                salt: '$2b$10$JWEbOhLGWcdaK/pJkM6IBe'
            },
            organization: ObjectId("652d0c0e7d4e65e143591c46"),
            role: 'admin',
            ID: 'UR_1',
            __v: 0
        },
        {
            _id: ObjectId("652d0e317d4e65e143591c56"),
            email: 'user1@mail.com',
            name: 'User 1',
            password: {
                hashed: '$2b$10$1YNRCf4Ye4XMoyNyFV/q.e5eQr/mQtvAtpQJ8idNAluWW5zLu3Hba',
                salt: '$2b$10$1YNRCf4Ye4XMoyNyFV/q.e'
            },
            organization: ObjectId("652d0bef7d4e65e143591c30"),
            role: 'complainant',
            ID: 'UR_2',
            __v: 0
        },
        {
            _id: ObjectId("652d0e467d4e65e143591c62"),
            email: 'user2@mail.com',
            name: 'User 2',
            password: {
                hashed: '$2b$10$R.d7MQM5UkpYcvi3Y8xcj.HkO1iqsFTZXnT2LMWNDaOqY6I6JuQju',
                salt: '$2b$10$R.d7MQM5UkpYcvi3Y8xcj.'
            },
            organization: ObjectId("652d0bef7d4e65e143591c30"),
            role: 'complainant',
            ID: 'UR_3',
            __v: 0
        },
        {
            _id: ObjectId("652d0e4b7d4e65e143591c6c"),
            email: 'user3@mail.com',
            name: 'User 2',
            password: {
                hashed: '$2b$10$zSQGySqbc06cMGUy18s/yuaGi9QjNGnLlaEgtOpXE9iHuzWIYJVXm',
                salt: '$2b$10$zSQGySqbc06cMGUy18s/yu'
            },
            organization: ObjectId("652d0c0e7d4e65e143591c46"),
            role: 'complainant',
            ID: 'UR_4',
            __v: 0
        }
    ]

)

db.counters.insertMany([{
    collectionID: 'complainant',
    seq:2
},
{
    collectionID: 'administrator',
    seq:1
},
{
    collectionID: 'organization',
    seq:1
},
{
    collectionID: 'user',
    seq:4
},
])