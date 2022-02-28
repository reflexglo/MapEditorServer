const ObjectId = require('mongoose').Types.ObjectId;
const Region = require('../models/region-model');
const Map = require('../models/map-model');
module.exports = {
    Query: {
		getAllRegions: async (_, __, { req }) => {
			const _id = new ObjectId(req.userId);
			if(!_id) { return([])};
			const regions = await Region.find({owner: _id});
			if(regions) return (regions);

		},
		getRegionById: async (_, args) => {
			const { _id } = args;
			const objectId = new ObjectId(_id);
			const region = await Region.findOne({_id: objectId});
			if(region) return region;
			else return ({});
		},
    },
    Mutation: {
        addSubregion: async(_, args) => {
			const { _id, region , index } = args;
			const regionId = new ObjectId(_id);
			const objectId = new ObjectId();
			const found = await Region.findOne({_id: regionId});
			if(!found) return ('Region not found');
			if(region._id === '') region._id = objectId;
			let subRegions = found.subregions;
			if(index < 0) subRegions.push(region._id);
   			else subRegions.splice(index, 0, region._id);
			   
			const newSubregion = new Region({
				_id: region._id,
				id: region.id,
				owner: region.owner,
				name: region.name,
				capital: region.capital,
				leader: region.leader,
				landmarks: region.landmarks,
				subregions: region.subregions
			});
			newSubregion.save();
			
			const updated = await Region.updateOne({_id: regionId}, { subregions: subRegions });

			if(updated) return (region._id);
			else return ('Could not add subregion');
		},
		deleteSubregion: async (_, args) => {
			const  { _id, regionId } = args;
			const parentId = new ObjectId(_id);
			const deletedId = new ObjectId(regionId);
			const found = await Region.findOne({_id: parentId});
			let subRegions = found.subregions;
			subRegions = subRegions.filter(region => region != regionId);
			const updated = await Region.updateOne({_id: parentId}, { subregions: subRegions });
			const deleted = await Region.deleteOne({_id: deletedId});
			if(updated) return ("deleted");
			else return ("not deleted");
		},
		updateRegionField: async (_, args) => {
			const { regionId, field} = args;
			let { value } = args;
			const updatedId = new ObjectId(regionId);
			const found = await Region.findOne({_id: updatedId});
			if(field == "add_landmark"){
				let landmarksList = found.landmarks;
				let index = landmarksList.length;
				landmarksList.push(value);
				const updated = await Region.updateOne({_id: updatedId}, { landmarks: landmarksList });
				if(updated) return (index.toString());
				else return ("not updated");
			}
			else if(field == "delete_landmark"){
				let landmarksList = found.landmarks;
				let index = parseInt(value);
				let deleted = landmarksList[index];
				landmarksList.splice(index,1);
				const updated = await Region.updateOne({_id: updatedId}, { landmarks: landmarksList });
				if(updated) return (deleted);
				else return ("not updated");
			}
			else if(field == "update_landmark"){
				let landmarksList = found.landmarks;
				let params = value.split("#");
				let newValue = params[0];
				let index = params[1];
				landmarksList[index] = newValue;
				const updated = await Region.updateOne({_id: updatedId}, { landmarks: landmarksList });
				if(updated) return ("updated");
				else return ("not updated");
			}
			else if(field == "edit_name"){
				const updated = await Region.updateOne({_id: updatedId}, { name: value });
				if(updated) return ("updated");
				else return ("not updated");
			}
			else if(field == "edit_capital"){
				const updated = await Region.updateOne({_id: updatedId}, { capital: value });
				if(updated) return ("updated");
				else return ("not updated");
			}
			else if(field == "edit_leader"){
				const updated = await Region.updateOne({_id: updatedId}, { leader: value });
				if(updated) return ("updated");
				else return ("not updated");
			}
			else{
				const updated = false;
				if(updated) return ("updated");
				else return ("not updated");
			}
		},
		sortSubregions: async (_,args) => {
			const {_id, filter, direction} = args;
			const regionId = new ObjectId(_id);
			let newOrder = filter.split(" ");
			const updated = await Region.updateOne({_id: regionId}, {subregions: newOrder});
			if(updated) return true;
			else return false;
		},
		changeSubparent: async (_,args) => {
			const  { _id, regionId, prevMapId, prevRegionId } = args;
			const parentId = new ObjectId(_id);
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
			const parent = await Region.findOne({_id: parentId});
			let parentRegions = parent.subregions;
			parentRegions.push(regionId);
			const moved = await Region.updateOne({_id: parentId}, { subregions: parentRegions });
			if(moved) return "moved";
			else return "not moved";
		}
    }
}