import express from "express";
import expressAsyncHandler from "express-async-handler";
import Jobmodel from "../model/JobModel.js";
import uploadFile from "../../../../Multer_config.js";
import { isAuth } from "../../util.js";
import AppliedModel from "../model/AppliedModel.js";

const Jobrouter = express.Router();

Jobrouter.post(
  "/new",
  isAuth,
  uploadFile,
  expressAsyncHandler(async (req, res) => {
    
    const jobObject = Object.assign(req.body, { job_images: req.files[0].location,posted_by:req.user });

    const jobmodel = new Jobmodel(jobObject);

    jobmodel
      .save()
      .then((data) => {
        res.status(200).json({
          id: data._id,
        });
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  })
);

Jobrouter.get(
  "/alljobs",
  isAuth,
  expressAsyncHandler(async (req, res, next) => {


    const getAppliedJobs = await AppliedModel.find({"user_by":req.user._id})
    if(getAppliedJobs.length>0){
      const getarr = getAppliedJobs.map((data)=>data.jobs)
      const getalljobs = await Jobmodel.find({"_id":{$in:getarr}});
      res.status(200).send(getalljobs);
    }else{
      const getalljobs = await Jobmodel.find();
      res.status(200).send(getalljobs);
    }


  })
);

Jobrouter.get(
  "/promoterjobs",
  isAuth,
  expressAsyncHandler(async (req, res, next) => {

    const getalljobs = await Jobmodel.find({posted_by:req.user._id});

    res.status(200).send(getalljobs);
  })
);


export default Jobrouter;
