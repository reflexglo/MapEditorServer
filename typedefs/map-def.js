const { gql } = require('apollo-server');

const typeDefs = gql `
	type Map {
		_id: String!
		id: Int!
		name: String!
		owner: String!
		regions: [String]
	}
	extend type Query {
		getAllMaps: [Map]
		getMapById(_id: String!): Map 
	}
	extend type Mutation {
		addRegion(region: RegionsInput!, _id: String!, index: Int!): String
		addMap(map: MapInput!): String
		deleteRegion(regionId: String!, _id: String!): String	
		deleteMap(_id: String!): Boolean
		updateMapField(_id: String!, field: String!, value: String!): String
		changeParent(regionId: String!, _id: String!, prevMapId: String!, prevRegionId: String!): String
		sortRegions(_id: String!, filter: String!, direction: Int!): Boolean
	}
	input MapInput {
		_id: String
		id: Int
		name: String
		owner: String
		regions: [String]
	}
	input RegionsInput {
		_id: String
		id: Int
		owner: String!
		name: String
		capital: String
		leader: String
		landmarks:  [String]
		subregions: [String]
	}
`;

module.exports = { typeDefs: typeDefs }