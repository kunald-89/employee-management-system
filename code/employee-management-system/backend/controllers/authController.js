import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {pool} from "../config/db.js";
export async function login(req,res){
 const email=String(req.body?.email??"").trim().toLowerCase(),password=String(req.body?.password??"");
 if(!email||!password||email.length>254||password.length>200)return res.status(400).json({error:"Enter a valid email and password."});
 const result=await pool.query("SELECT id,email,password_hash,role,employee_id FROM app_users WHERE email=$1",[email]);
 const user=result.rows[0],valid=user?await bcrypt.compare(password,user.password_hash):false;
 if(!valid)return res.status(401).json({error:"Invalid email or password."});
 const token=jwt.sign({sub:String(user.id),role:user.role},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN||"30m",issuer:"ems-api",audience:"ems-web"});
 res.json({token,user:{id:user.id,email:user.email,role:user.role,employeeId:user.employee_id}});
}
export async function currentUser(req,res){
 const r=await pool.query("SELECT id,email,role,employee_id FROM app_users WHERE id=$1",[req.auth.sub]);
 if(!r.rowCount)return res.status(404).json({error:"User not found."});
 const u=r.rows[0];res.json({id:u.id,email:u.email,role:u.role,employeeId:u.employee_id});
}