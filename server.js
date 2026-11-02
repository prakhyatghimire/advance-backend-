import express from 'express';
import pool from "./db.js";
import { error } from 'node:console';
const app=express();
app.use(express.json());
app.get("/",(req,res)=>{
    res.send("hello");
})

app.get("/students",async(req,res)=>{
    try{
        const{name}=req.query;
        const result=await pool.query(
            "SELECT *FROM students WHERE first_name ILIKE $1",[name]
        )
        res.json(result.rows);

    }
    catch(error){
        console.error(error.message);
        res.status(500).json({
            error:"database error"
        });

    }
});
app.post("/addStudent",async(req,res)=>{
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const{f_name,l_name,DOB,email}=req.body||{};
    if(!f_name){
        return res.status(400).json({error:"first name is required"})
    }
    if(!l_name){
        return res.status(400).json({error:"Last name is required"})
    }
    if(!DOB){
        return res.status(400).json({error:"DOB is required"})
    }
    if (!email || !EMAIL_REGEX.test(email.trim())) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  try{
    const result=await pool.query("INSERT INTO students(first_name,last_name,date_of_birth,email)VALUES($1,$2,$3,$4)RETURNING *",[f_name,l_name,DOB,email]);
    return res.status(201).json(result.rows[0]);
  }
  catch (error) {
  
  console.error(error.message);
  return res.status(500).json({ error: 'Internal server error' });
}


})
app.get("/students/:id",async(req,res)=>{
    try{
        const {id}=req.params;
        const result=await pool.query(
            "SELECT * FROM students WHERE student_id=$1",[id]
        );
        res.json(result.rows[0]);
    }
    catch(error){
        console.error(error.message);
        res.status(500).json({
            error:"database error"
        });
    }

});

app.listen(4000,()=>{
    console.log("the code is running");
})