import express from'express';
import graphqlHTTP from 'express-graphql';
import { GraphQLSchema, GraphQLObjectType, GraphQLList } from 'graphql';

import serverDataStructure from './dataShapes/server.js';
import playerDataStructure from './dataShapes/players.js';

import Wrapper from './wrapper.js';

const serverWrapper = new Wrapper('/home/alex/.local/share/Steam/steamapps/common/AvorionServer');
serverWrapper.startServer();

let schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      serverData: {
        type: new GraphQLObjectType({
          name: 'ServerData',
          fields: serverDataStructure,
        }),
      },
      players: {
        type: new GraphQLList(
          new GraphQLObjectType({
            name: 'PlayerData',
            fields: playerDataStructure,
        })),
      },
    },
  }),
});

let root = {
  serverData: () => serverWrapper.serverData,
  players: () => serverWrapper.playerData,
};

let app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');
