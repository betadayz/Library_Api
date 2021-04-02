const Bootcamp = require('../models/Bootcamps');


exports.getBootcamps = async (req, res, next) => {
    try {
        const bootcamps = await Bootcamp.find();
        res.status(200).json({ success: true, data: bootcamps })
    } catch (err) {
        res.status(400).json({ success: false });
    }
}

exports.getBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id);
        res.status(200).json({ success: true, data: bootcamp })
        if (!bootcamp) {
            return res.status(400).json({ success: false })
        }
    } catch (error) {
        res.status(400).json({ success: false, data: null });
    }
}

exports.createBootcamp = async (req, res, next) => {
   try {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
        success: true,
        data: bootcamp
    });
   } catch (err) {
       res.status(400).json({
           success: false
       });
   }
};

exports.updateBootcamp = (req, res, next) => {
    res.status(200).json({ success: true, msg: `Update bootcamp ${req.params.id}` });
}

exports.deleteBootcamp = (req, res, next) => {
    res.status(200).json({ success: true, msg: `Delete bootcamp ${req.params.id}` });
}