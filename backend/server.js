const express= require("express")
const mongoose= require("mongoose")
const cors= require("cors")
require("dotenv").config()
const app= express()

app.use(express.json())
app.use(cors())

mongoose
.connect(process.env.MONGO_URL)
.then(()=>console.log("MongoDB connection succesfull"))
.catch((err)=>console.log("MongoDB connection unsuccesfull"))

const patientSchema= new mongoose.Schema({
    name:String,
    age:Number,
    ailment:String,
    doctor:{type:mongoose.Schema.Types.ObjectId,ref:"doctors",default:null}

})
const doctorSchema= new mongoose.Schema({
    name:String,
    specialization:String
})

const Doctors= mongoose.model("doctors",doctorSchema)
const Patients= mongoose.model("patients",patientSchema)


app.get("/api/patients",async(req,res)=>{
    const patient= Patients.find().populate("doctor")
    res.json(patient)
})

app.post("/api/patients",async(req,res)=>{
   const patients=  new Patients.save(req.body)
   res.json(patients)
})

app.put("/api/patients/:id/doctors",async(req,res)=>{
    const{id}=req.params
    const{doctorId}=req.body
    const updatedPatient= await Patients.findByIdAndUpdate({_id:id},{doctors:doctorId},{new:true}).populate("doctor")
    res.json(updatedPatient)
})

app.delete("/api/patients/:id/doctors",async(req,res)=>{
    const{id}=req.params
    await Patients.findByIdAndDelete(id)
    res.json({message:"Patient deletion succesfull"})
})


app.listen(8000,()=>console.log(`Server is running at http://localhost:8000/`))