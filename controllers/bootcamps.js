const ErrorResponse = require('../utilis/errorResponse')
const asyncHandler = require("../middleware/async");
const geocoder = require("../utilis/geocoder")
const Bootcamp = require('../models/Bootcamps');



exports.getBootcamps = asyncHandler(async (req, res, next) => {
    // Copy req.query
    let query;
    const reqQuery = { ...req.query };
    
    const removeFields = ['select', 'sort'];
    removeFields.forEach(param => delete reqQuery[param]);
    
    // Create query string
    let queryStr = JSON.stringify(reqQuery);
    
    // Create operators ($gte, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource
    query = Bootcamp.find(JSON.parse(queryStr));
    
    // Select fields
    if (req.query.select){
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    };

    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    // Excuting query
    const bootcamps = await query;
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

exports.getBootcampInRadius = asyncHandler(async (req, res, next) => {
     const { zipcode, distance} = req.params;

     const loc = await geocoder.geocode(zipcode);
     const lat = loc[0].latitude;
     const lng = loc[0].longitude;

     const radius = distance / 3963;
     const bootcamps = await Bootcamp.find({
         location: { $geoWithin: { $centerSphere: [ [ lng, lat ], radius ]}}
     });
     
     res.status(200).json({
         success: true,
         count: bootcamps.length,
         data: bootcamps
     });
});
