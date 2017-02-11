import express from'express';
import graphqlHTTP from 'express-graphql';
import { buildSchema } from 'graphql';

import Wrapper from './wrapper.js';

const serverWrapper = new Wrapper('/home/alex/.local/share/Steam/steamapps/common/Avorion');
serverWrapper.startServer();

let schema = buildSchema(`
  type Query {
    serverData: ServerData
  }

  type ServerData {
    cpu: String!,
    name: String!,
    seed: String!,
    port: String!,
    maxOnlinePlayers: String!,
    saveInterval: String!,
    broadcastInterval: String!,
    maxLoadedSectorTime: String!,
    weakUpdate: String!,
    workerThreads: String!,
    difficulty: String!,
    infiniteResources: String!,
    collision: String!,
    accessList: String!,
    public: String!,
    authentication: String!,
    listed: String!,
    steamNetworking: String!,
    administrators: String!
  }
`);

let root = {
  serverData: () => serverWrapper.serverData,
};

let app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');
