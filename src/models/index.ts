import e from "cors";

const mongoose = require('mongoose');
export default mongoose;

export const Group = require('./groupModel'); 
export const { GoogleUser } = require('./userModel')
export const Training = require('./trainingModel').Training;
export const Exercise = require('./trainingModel').Exercise;