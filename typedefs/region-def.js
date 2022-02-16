const { gql } = require('apollo-server');

const typeDefs = gql `
	type Regions {
		_id: String!
		id: Int!
		owner: String!
		name: String!
		capital: String
		leader: String
		landmarks:  [String]
        subregions: [String]
	}
	extend type Query {
		getAllRegions: [Regions]
		getRegionById(_id: String!): Regions 
	}
	extend type Mutation {
		addSubregion(region: RegionsInput!, _id: String!, index: Int!): String
		deleteSubregion(regionId: String!, _id: String!): String		
		updateRegionField(regionId: String!, field: String!, value: String!): String
		changeSubparent(regionId: String!, _id: String!, prevMapId: String!, prevRegionId: String!): String
		sortSubregions(_id: String!, filter: String!, direction: Int!): Boolean
	}
`;

module.exports = { typeDefs: typeDefs }