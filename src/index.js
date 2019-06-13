import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import uuid from 'uuid/v4';

const app = express();
app.use(cors());

const users = {
  1: {
    id: '1',
    username: 'Grant Van Horn',
    firstname: 'Grant',
    lastname: 'Van Horn',
    messageIds: [1],
  },
  2: {
    id: '2',
    username: 'Robert Green',
    firstname: 'Robert',
    lastname: 'Green',
    messageIds: [2],
  },
};

const messages = {
  1: {
    id: '1',
    text: 'Hello World',
    userId: '1',
  },
  2: {
    id: '2',
    text: 'By World',
    userId: '2',
  },
};

const me = users[1];

const schema = gql`
  type Query {
    me: User
    user(id: ID!): User
    users: [User!]

    messages: [Message!]!
    message(id: ID!): Message!
  }

  type Mutation {
    createMessage(text: String!): Message!
    deleteMessage(id: ID!): Boolean!
    updateMessage(id: ID!, text: String!): Message!
  }

  type User {
    id: ID!
    username: String!
    messages: [Message!]
  }

  type Message {
    id: ID!
    text: String!
    user: User!
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
    },
    messages: () => {
      return Object.values(messages);
    },
    message: (parent, { id }) => {
      return messages[id];
    },
  },

  Mutation: {
    createMessage: (parent, { text }, { me }) => {
      const id = uuid();
      const message = {
        id,
        text,
        userId: me.id,
      };

      messages[id] = message;
      users[me.id].messageIds.push(id);

      return message;
    },
    deleteMessage: (parent, { id }) => {
      const { [id]: message, ...otherMessages } = messages;

      if (!message) {
        return false;
      }

      messages = otherMessages;

      return true;
    },
    updateMessage: (parent, data, { me }) => {
      const { id, text } = data;

      messages[id].text = text;

      const updatedMessage = messages[id];

      return updatedMessage;
    }
  },

  User: {
    username: user => `${user.firstname} ${user.lastname}`,
    messages: user => {
      return Object.values(messages).filter(
        message => message.userId === user.id,
      );
    }
  },

  Message: {
    user: message => {
      return users[message.userId];
    },
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
