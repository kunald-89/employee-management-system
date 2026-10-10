import jwt from "jsonwebtoken";
export function requireAuth(req,res,next){
 const header=req.headers.authorization||"",token=header.startsWith("Bearer ")?header.slice(7):null;
 if(!token)return res.status(401).json({error:"Authentication required."});
 try{req.auth=jwt.verify(token,process.env.JWT_SECRET,{issuer:"ems-api",audience:"ems-web"});return next();}
 catch{return res.status(401).json({error:"Invalid or expired token."});}
}
export function allowRoles(...roles){
 return (req,res,next)=>req.auth&&roles.includes(req.auth.role)?next():res.status(403).json({error:"You do not have permission for this action."});
}