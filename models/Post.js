const mongoose = require('mongoose');
const { Schema } = mongoose;
const convertUTCtoIST  = require('../utils/date');

const PostSchema = new Schema(
    {
        user: {
            access: { type: Number, required: true },
            userId: { type: Schema.Types.ObjectId, required: true },
        },
        text: { type: String},
        image: [{ type: String }],
        likes : [{tye:Schema.Types.ObjectId}],
        saved : [{tye:Schema.Types.ObjectId}],
        tags: [{ type: String }],
        createdAt: { type: Date, default: () => convertUTCtoIST(new Date()) },
        updatedAt: { type: Date, default: () => convertUTCtoIST(new Date()) }
    },
    {
        collection: 'posts',
        strict: false
    }
);

mongoose.model('Post', PostSchema);
