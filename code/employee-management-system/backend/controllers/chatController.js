import OpenAI from "openai";
import {pool} from "../config/db.js";
const client=process.env.OPENAI_API_KEY?new OpenAI({apiKey:process.env.OPENAI_API_KEY}):null;
export async function chat(req,res){
 const message=typeof req.body?.message==="string"?req.body.message.trim():"";
 if(!message||message.length>1500)return res.status(400).json({error:"Message must contain 1–1500 characters."});
 if(!client)return res.status(503).json({error:"AI chat is disabled. Configure OPENAI_API_KEY on the server."});
 try{
  let context;
  if(req.auth.role==="employee"){
   const r=await pool.query("SELECT e.first_name,e.last_name,e.department,e.job_title,e.status FROM app_users u JOIN employees e ON e.id=u.employee_id WHERE u.id=$1",[req.auth.sub]);
   context=r.rows[0]||{message:"No linked employee profile."};
  }else{
   const r=await pool.query("SELECT first_name,last_name,department,job_title,status FROM employees ORDER BY last_name LIMIT 100");
   context=r.rows;
  }
  const response=await client.responses.create({model:process.env.OPENAI_MODEL||"gpt-5.5",instructions:"You are an employee management assistant. Answer only from the supplied authorized context. Do not infer missing facts, reveal secrets, or claim to modify records.",input:"Authorized employee context: "+JSON.stringify(context)+"\nUser question: "+message,max_output_tokens:350});
  res.json({reply:response.output_text||"No response available."});
 }catch(err){console.error("AI request failed:",err?.status||err?.name||"unknown");res.status(502).json({error:"The assistant is temporarily unavailable."});}
}