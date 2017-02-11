import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLString } from 'graphql';

export default {
  cpu: {
    label: 'CPU',
    type: GraphQLString,
  },
  name: {
    label: 'name',
    type: GraphQLString,
  },
  description: {
    label: 'description',
    type: GraphQLString,
  },
  seed: {
    label: 'seed',
    type: GraphQLString,
  },
  port: {
    label: 'port',
    type: GraphQLInt,
  },
  maxOnlinePlayers: {
    label: 'max online players',
    type: GraphQLInt,
  },
  saveInterval: {
    label: 'save interval',
    type: GraphQLInt,
  },
  broadcastInterval: {
    label: 'broadcast interval',
    type: GraphQLInt,
  },
  maxLoadedSectorTime: {
    label: 'max loaded sector time',
    type: GraphQLInt,
  },
  weakUpdate: {
    label: 'weak update',
    type: GraphQLBoolean,
  },
  workerThreads: {
    label: 'worker threads',
    type: GraphQLInt,
  },
  difficulty: {
    label: 'difficulty',
    type: GraphQLString,
  },
  infiniteResources: {
    label: 'infiniteResources',
    type: GraphQLBoolean,
  },
  collision: {
    label: 'collision',
    type: GraphQLFloat,
  },
  accessList: {
    label: 'access list',
    type: GraphQLString,
  },
  public: {
    label: 'public',
    type: GraphQLBoolean,
  },
  authentication: {
    label: 'authentication',
    type: GraphQLBoolean,
  },
  listed: {
    label: 'listed',
    type: GraphQLBoolean,
  },
  steamNetworking: {
    label: 'steam networking',
    type: GraphQLBoolean,
  },
  administrators: {
    label: 'administrators',
    type: GraphQLList,
    subType: GraphQLString,
  },
  sameStartSector: {
    label: 'same start sector',
    type: GraphQLBoolean,
  },
};
