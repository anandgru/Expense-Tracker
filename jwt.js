const jwt=require('jsonwebtoken');

const jwtAuthMiddleware=(req, res, next) =>{
    const token=req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({message:'Token not provided'});
    }
    try{
        const decoded=jwt.verify(token,'abcd');
        req.user=decoded;
        next();
    }catch(error){
        console.log('Error in JWT parsing:',token);
        console.error('Error in JWT verification:',error);
        return res.status(403).json({message:'Invalid token'});
    }
}

const generateToken =(req, res, next)=>{
    const {userId, email}=req.user;
    const token=jwt.sign({userId, email},'abcd',{expiresIn:'1h'});
    res.json({token});
}

module.exports={jwtAuthMiddleware, generateToken};