import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';

const app = express();
app.use(cors());

const users = {
  1: {
    id: '1',
    username: 'Grant Van Horn',
  },
  2: {
    id: '2',
    username: 'Robert Green',
  },
};

const me = users[1];

const schema = gql`
  type Query {
    me: User
    user(id: ID!): User
    users: [User!]
  }

  type User {
    id: ID!
    username: String!
  }
`;

const resolvers = {
  Query: {
    me: (parent, args, { me }) => {
      return me;
    },
    user: (parent, { id }) => {
      return users[id];
    },
    users: () => {
      return Object.values(users);
    }
  },

  User: {
    username: user => `${user.firstname} ${user.lastname}`,
  },
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    me: users[1]
  }
});

server.applyMiddleware({ app, path: '/graphql' });

app.listen({ port: 8000}, () => {
  console.log('Apollo Server on http://localhost:8000/graphql');
});

console.log('Hello Node.js project.');

console.log(process.env.MY_SECRET);