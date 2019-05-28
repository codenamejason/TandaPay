const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");
const UserSchema = new Schema({
	name: {
		type: String,
		require: true,
		trim: true,
		minlength: 1
	},
	phone: {
		type: String,
		require: false,
		trim: true,
		minlength: 1,
		validate: [
			{
				validator: (value) => validator.isMobilePhone(value),
				message: `{VALUE} is not a valid phone number`
			}
		]
	},
	email: {
		type: String,
		require: true,
		trim: true,
		minlength: 1,
		unique: true,
		validate: [
			{
				validator: (value) => validator.isEmail(value),
				message: `{VALUE} is not a valid email`
			}
		]
	},
	password: {
		type: String,
		require: false,
		minlength: 8
	},
	tokens: [
		{
			access: {
				type: String,
				require: true
			},
			token: {
				type: String,
				require: true
			}
		}
	]
	// notifications: [
	//   {
	//     settings: {
	//       type: String,
	//       require: true
	//     },
	//     carrier: {

	//     }
	//   }
	// ]
});

mongoose.model("users", UserSchema);
