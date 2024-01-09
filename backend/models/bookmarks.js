const { default: mongoose } = require("mongoose");

const bookSchema = mongoose.Schema({
    userid:{
        type:String,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    url:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    tags:{
        type:[String],
        default: []
    }

})

const bookmarks = mongoose.model('bookmarks',bookSchema);
module.exports = bookmarks;