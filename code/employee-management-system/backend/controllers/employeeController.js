import {z} from "zod";
import {pool} from "../config/db.js";
const schema=z.object({firstName:z.string().trim().min(1).max(80),lastName:z.string().trim().min(1).max(80),email:z.string().trim().email().max(254),department:z.string().trim().min(1).max(100),jobTitle:z.string().trim().min(1).max(120),status:z.enum(["active","on_leave","inactive"]).optional()});
const cols='id,first_name AS "firstName",last_name AS "lastName",email,department,job_title AS "jobTitle",status';
export async function listEmployees(_req,res){const r=await pool.query("SELECT "+cols+" FROM employees ORDER BY id DESC LIMIT 200");res.json(r.rows);}
export async function myEmployee(req,res){
 const r=await pool.query('SELECT e.id,e.first_name AS "firstName",e.last_name AS "lastName",e.email,e.department,e.job_title AS "jobTitle",e.status FROM app_users u JOIN employees e ON e.id=u.employee_id WHERE u.id=$1',[req.auth.sub]);
 if(!r.rowCount)return res.status(404).json({error:"No employee profile is linked to this account."});res.json(r.rows[0]);
}
export async function createEmployee(req,res){
 const parsed=schema.safeParse(req.body);if(!parsed.success)return res.status(400).json({error:"Invalid employee data.",details:parsed.error.issues});
 const e=parsed.data;
 try{const r=await pool.query("INSERT INTO employees(first_name,last_name,email,department,job_title,status) VALUES($1,$2,$3,$4,$5,$6) RETURNING "+cols,[e.firstName,e.lastName,e.email.toLowerCase(),e.department,e.jobTitle,e.status||"active"]);res.status(201).json(r.rows[0]);}
 catch(err){if(err.code==="23505")return res.status(409).json({error:"An employee with this email already exists."});throw err;}
}