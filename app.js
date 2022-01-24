const express = require('express')
// const graphqlHTTP = require('express-graphql')
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql')

const app = express()

// Sumber Data
let forumData = [
    { id: "1", title: "cara belajar", desc: "bagaimana cara belajar yang baik ?", userId:"1"},
    { id: "2", title: "apa sekarang", desc: "sekarang harus belajar apa" , userId:"2"},
    { id: "3", title: "mulai dari mana", desc: "saya bingung mulai dari mana" , userId:"2"},
]

let userData = [
    { id: "1", name: "Hafidh"},
    { id: "2", name: "The Dragon"},
    { id: "3", name: "Darkness"},
]

let schema = buildSchema(`
        type Forum {
            id: ID,
            title: String,
            desc: String,
            user: User
        }
        
        type User {
            id: ID,
            name: String,
            forums: [Forum]
        }

        type Query {
            forum(id: ID!): Forum,
            forums: [Forum],
            user(id: ID!): User,
            users: [User]
        }
        type Mutation {
            addUser(id: ID, name: String) : User,
            addForum(id: ID, title: String, desc: String, userId: String) : Forum
        }
    `)

let resolvers = {
    // resolvers / fetch
    forum: (args) => {
        let _forum = forumData.find(el => el.id == args.id)
        _forum['user'] = userData.find(el => el.id == _forum.id)
        
        //data user -> userId?
        return _forum
    },
    forums: () => {
        let _user = ''

        // load forum dan masukkan data user
        forumData.map(
            (eachForum) => {
                _user = userData.find(el => el.id == eachForum.userId)
                eachForum['user'] = _user
            }
        )
        return forumData
    },

    user: (args) => {
        let _user = userData.find(el => el.id == args.id)
        _user['forums'] = forumData.filter(el => el.userId == _user.id)
        
        return _user

    },
    users: () => {
        let _forums = ''

        // load user dan masukkan semua data forum
        userData.map(
            (eachUser) => {
                _forums = forumData.filter(el => el.userId == eachUser.id)
                eachUser['forums'] = _forums
            }
        )
        return userData 
    },

    //mutation
    addUser: ({id, name}) => {
        let _newUser = {id: id, name: name}
        userData.push(_newUser)
        // console.log(userData)
        return _newUser
    },
    addForum: ({id, title, desc, userId}) => {
        let _newForum = {id: id, title: title, desc: desc, userId: userId}
        forumData.push(_newForum)
        // console.log(forumData)
        return _newForum
    }
} 

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: resolvers,
    graphiql: true //GUI
}))

app.listen(4000,  ()=> console.log('berhasil berjalan'))
