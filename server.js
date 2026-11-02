import express from 'express';
import pool from "./db.js";
const app=express();
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