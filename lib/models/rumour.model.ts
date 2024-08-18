import mongoose from "mongoose";

const rumourSchema = new mongoose.Schema({
    text : {type : String, required : true},
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    Community : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Community',
    },
    createAt : {
        type : Date,
        default : Date.now
    },
    parentId : {
        type : String,

    },
    children : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Rumour'
    }]
});

const Rumour = mongoose.models.Rumour || mongoose.model("Rumour", rumourSchema);

export default Rumour;

