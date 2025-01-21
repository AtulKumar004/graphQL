const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const bodyParser = require("body-parser");
const cors = require("cors");
const { default: axios } = require("axios");

const typeDefs = ` 
# This "Todo" type defines the queryable fields for every book in our data source

type User {
  id: ID!
  name: String!
  username: String!
  email: String!
  phone: String!

}
type Todo {
  id: ID!
  title: String!
  done: Boolean
  userId: ID!
  user: User
}

# The "Query" type is special: it lists all of the available queries that
# clients can execute, along with the return type for each. In this
# case, the "todos" query returns an array of zero or more Todo (defined above).

 type Query {
  todos: [Todo]
  getUsers: [User]
  getUserById(id: ID!): User
}
`;

const resolvers = {
    Todo: {
        user : (todo) =>  axios
        .get(`https://jsonplaceholder.typicode.com/users/${todo.userId}`)
        .then((res) => res.data)
        .catch((err) => console.log(err)),
    },
  Query: {
    todos: () =>
      axios
        .get("https://jsonplaceholder.typicode.com/todos")
        .then((res) => res.data)
        .catch((err) => console.log(err)),
    getUsers: () =>
      axios
        .get("https://jsonplaceholder.typicode.com/users")
        .then((res) => res.data)
        .catch((err) => console.log(err)),
    getUserById: (parent, { id }) =>
      axios
        .get(`https://jsonplaceholder.typicode.com/users/${id}`)
        .then((res) => res.data)
        .catch((err) => console.log(err)),
  },
};

async function startServer() {
  const app = express();
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start(); // Start Apollo server
  app.use(bodyParser.json());
  app.use(cors());
  app.use("/graphql", expressMiddleware(server));
  app.listen(8000, () => {
    console.log("Server is running on port 8000");
  });
}

startServer();
