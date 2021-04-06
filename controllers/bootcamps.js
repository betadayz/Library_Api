const ErrorResponse = require('../utilis/errorResponse')
const asyncHandler = require("../middleware/async");
const Bootcamp = require('../models/Bootcamps');


exports.getBootcamps = asyncHandler(async (req, res, next) => {
        const bootcamps = await Bootcamp.find();
        res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps })
        next(err);
});

exports.getBootcamp = asyncHandler(async (req, res, next) => {

        const bootcamp = await Bootcamp.findById(req.params.id);
        res.status(200).json({ success: true, data: bootcamp })
        if (!bootcamp) {
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
        }
        next(err);
});

exports.createBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
        success: true,
        data: bootcamp
    });
});

exports.updateBootcamp = asyncHandler(async (req, res, next) => {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        if(!bootcamp) {
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
        }
        res.status(200).json({ success: true, data: bootcamp })
});

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
        if(!bootcamp) {
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
        }
        res.status(200).json({ success: true, data: {} });
})