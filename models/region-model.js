const { model, Schema, ObjectId } = require('mongoose');

const regionSchema = new Schema();
regionSchema.add(
	{
		_id: {
			type: ObjectId,
			required: true
		},
		id: {
			type: Number,
			required: true
		},
		owner: {
			type: String,
			required: true
		},
		name: {
			type: String,
			required: true
		},
		capital: {
			type: String,
		},
		leader: {
			type: String,
		},
		landmarks: [String],
		subregions: [String]
	}
);

const Region = model('Region', regionSchema);
module.exports = Region;