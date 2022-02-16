const ObjectId = require('mongoose').Types.ObjectId;
const Map = require('../models/map-model');
const Region = require('../models/region-model');
module.exports = {
    Query: {
		getAllMaps: async (_, __, { req }) => {
			const _id = new ObjectId(req.userId);
			if(!_id) { return([])};
			const maps = await Map.find({owner: _id});
			if(maps) return (maps);

		},
		getMapById: async (_, args) => {
			const { _id } = args;
			const objectId = new ObjectId(_id);
			const map = await Map.findOne({_id: objectId});
			if(map) return map;
			else return ({});
		},
    },
    Mutation: {
        addMap: async (_, args) => {
			const { map } = args;
			const objectId = new ObjectId();
			const { id, name, owner, regions } = map;
			const newMap = new Map({
				_id: objectId,
				id: id,
				name: name,
				owner: owner,
				regions: regions
			});
			const updated = newMap.save();
			if(updated) return objectId;
			else return ('Could not add map');
		},
		deleteMap: async (_, args) => {
			const { _id } = args;
			const objectId = new ObjectId(_id);
			const deleted = await Map.deleteOne({_id: objectId});
			if(deleted) return true;
			else return false;
		},
		updateMapField: async (_, args) => {
			const { field, value, _id } = args;
			const objectId = new ObjectId(_id);
			const updated = await Map.updateOne({_id: objectId}, {[field]: value});
			if(updated) return value;
			else return "";
		},
		addRegion: async(_, args) => {
			const { _id, region , index } = args;
			const mapId = new ObjectId(_id);
			const objectId = new ObjectId();
			const found = await Map.findOne({_id: mapId});
			if(!found) return ('Map not found');
			if(region._id === '') region._id = objectId;
			let mapRegions = found.regions;
			if(index < 0) mapRegions.push(region._id);
   			else mapRegions.splice(index, 0, region._id);

			const newRegion = new Region({
				_id: region._id,
				id: region.id,
				owner: region.owner,
				name: region.name,
				capital: region.capital,
				leader: region.leader,
				landmarks: region.landmarks,
				subregions: region.subregions
			});
			newRegion.save();
			
			const updated = await Map.updateOne({_id: mapId}, { regions: mapRegions });

			if(updated) return (region._id);
			else return ('Could not add region');
		},
		deleteRegion: async (_, args) => {
			const  { _id, regionId } = args;
			const mapId = new ObjectId(_id);
			const deletedId = new ObjectId(regionId);
			const found = await Map.findOne({_id: mapId});
			let mapRegions = found.regions;
			mapRegions = mapRegions.filter(region => region != regionId);
			const updated = await Map.updateOne({_id: mapId}, { regions: mapRegions });
			const deleted = await Region.deleteOne({_id: deletedId});
			if(updated) return ("deleted");
			else return ("not deleted");
		},
		sortRegions: async (_,args) => {
			const {_id, filter, direction} = args;
			const mapId = new ObjectId(_id);
			let newOrder = filter.split(" ");
			const updated = await Map.updateOne({_id: mapId}, {regions: newOrder});
			if(updated) return true;
			else return false;
		},
		changeParent: async (_,args) => {
			const  { _id, regionId, prevMapId, prevRegionId } = args;
			const mapId = new ObjectId(_id);
			if(prevMapId == ''){
				const prevId = new ObjectId(prevRegionId);
				const found = await Region.findOne({_id: prevId});
				let subRegions = found.subregions;
				subRegions = subRegions.filter(region => region != regionId);
				const updated = await Region.updateOne({_id: prevId}, {subregions: subRegions});
			}
			else{
				const prevId = new ObjectId(prevMapId);
				const found = await Map.findOne({_id: prevId});
				let mapRegions = found.regions;
				mapRegions = mapRegions.filter(region => region != regionId);
				const updated = await Map.updateOne({_id: prevId}, { regions: mapRegions });
			}
			const parent = await Map.findOne({_id: mapId});
			let parentRegions = parent.regions;
			parentRegions.push(regionId);
			const moved = await Map.updateOne({_id: mapId}, { regions: parentRegions });
			if(moved) return "moved";
			else return "not moved";
		}

    }
}