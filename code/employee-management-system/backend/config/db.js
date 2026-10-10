import pg from "pg";
import bcrypt from "bcryptjs";
const {Pool}=pg;
export const pool=new Pool({connectionString:process.env.DATABASE_URL,max:10,idleTimeoutMillis:30000,connectionTimeoutMillis:5000});
export async function bootstrapAdmin(){
 const email=process.env.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase();
 const password=process.env.BOOTSTRAP_ADMIN_PASSWORD;
 if(!email||!password||password.length<14) throw new Error("Set bootstrap admin email and a password of at least 14 characters.");
 const found=await pool.query("SELECT id FROM app_users WHERE email=$1",[email]);
 if(!found.rowCount){const hash=await bcrypt.hash(password,12);await pool.query("INSERT INTO app_users(email,password_hash,role) VALUES($1,$2,'admin')",[email,hash]);}
}