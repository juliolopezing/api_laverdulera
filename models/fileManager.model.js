var mongoose = require('mongoose');

var rootSchema = mongoose.Schema({
    father: {type: mongoose.Schema.Types.ObjectId, ref:'File'},
    isDirectory: Boolean,
    name: String,
    typeFile: String,
    isRoot: Boolean,
    children: [{type: mongoose.Schema.Types.ObjectId, ref:'File'}],
    idUser: Number,
    public: Boolean,
    private: Boolean,
    idFile: String,
    eliminate: Boolean,
    dateEliminate: Date,
    icon: String,
    tags:[{
        key: String,
        value: String
    }],
    awsUpload: mongoose.Schema.Types.Mixed,
    ocrtext: String
})

module.exports = mongoose.model('File', rootSchema, 'file');