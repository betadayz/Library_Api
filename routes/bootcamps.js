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

const { protect, authorize } = require('../middleware/auth') 

// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter)

router.route('/radius/:zipcode/:distance').get(getBootcampInRadius);
router.route('/:id/photo').put(protect, authorize('publisher', 'admin'), authorize('publisher', 'admin'), bootcampPhotoUpload);

router.route('/').get(advancedResult(Bootcamps, 'courses'), getBootcamps).post(protect, createBootcamp)
router.route("/:id").get(getBootcamp).put(updateBootcamp).delete(protect, authorize('publisher', 'admin'), deleteBootcamp);

module.exports = router
