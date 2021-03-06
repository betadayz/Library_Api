const path = require('path');
const ErrorResponse = require('../utilis/errorResponse')
const asyncHandler = require("../middleware/async");
const geocoder = require("../utilis/geocoder")
const Bootcamp = require('../models/Bootcamps');



exports.getBootcamps = asyncHandler(async (req, res, next) => {
   res.status(200).json(res.advancedResults);
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
    // Add user to req.body
    req.body.user = req.user.id;

    // Check for publisher bootcamp
    const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

    // If the user is not an admin, they can only add one bootcamp
    if (publishedBootcamp && req.user.role !== 'admin') {
        return next(new ErrorResponse(
              `The user with ID ${req.user.id} has already published a bootcamp`, 
              400
              )
            );
    }


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
        const bootcamp = await Bootcamp.findById(req.params.id)
        if(!bootcamp) {
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
        }
        
        bootcamp.remove();
        
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

exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id)
    if(!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }
    
    if(!req.files) {
        return next(new ErrorResponse(`Please upload a file`, 400));

    }

    const file = req.files.files;

    if (!file.mimetype.startsWith('image')) {
       return next(new ErrorResponse(`Please upload an image file`, 400));
    }

    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 400));
    }

    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
    file.mv(`${process.env.MAX_FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if (err) {
            console.error(err);
            return next(new ErrorResponse(`Problem with file upload`, 500));
        }
        await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

        res.status(200).json({
            success: true,
            data: file.name
        })
    })
});
