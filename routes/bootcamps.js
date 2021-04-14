const express = require("express");


const { 
    getBootcamps, 
    getBootcamp, 
    createBootcamp, 
    updateBootcamp, 
    deleteBootcamp,
    getBootcampInRadius,
    bootcampPhotoUpload
} = require('../controllers/bootcamps')

const Bootcamps = require('../models/Bootcamps')
const advancedResult = require('../middleware/advancedResults')

// Include other resourse routers
const courseRouter = require('./courses')

const router = express.Router();

// Re-route into other resourse routers
router.use('/:bootcampId/courses', courseRouter)

router.route('/radius/:zipcode/:distance').get(getBootcampInRadius);
router.route('/:id/photo').put(bootcampPhotoUpload);

router.route('/').get(advancedResult(Bootcamps, 'courses'), getBootcamps).post(createBootcamp)
router.route("/:id").get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp);

module.exports = router