const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a course title']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    weeks: {
        type: String,
        required: [true, 'Please add number of weeks']
    },
    minimumSkill: {
        type: String,
        required: [true, 'Please add a minimum skills'],
        enum: ['beginner', 'intermediate', 'advanced']
    },
    scholarshipAvailable: {
        type: Boolean,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    }
});

CourseSchema.statics.getAverageCost = async function(bootcampId) {
    console.log("Calculating avg cost...".blue)

    const obj = await this.aggregate([
        {
            $match: { bootcamp: bootcampId }
        },
        {
            $group: {
                _id: '$bootcamp',
                averageCost: { $avg: "$tuition" }
            }
        }
    ]);
    console.log(obj);
}

CourseSchema.post('save', function() {

});

CourseSchema.pre('remove', function() {

});

module.exports = mongoose.model('Course', CourseSchema);