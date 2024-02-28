import jwt from "jsonwebtoken";
//Authorization check - Checks for access token of the user to perform operations. 
//This will be executed after req receival and before sending response
const checkTokenHeader = (req, res, next) => {
  try{
    const authHeader = req.headers['authorization'];
    const token = (authHeader == undefined) || authHeader || authHeader.split(' ')[1]
    if (token===true || token == null){
      throw {statusCode:401, message:"Not Authorized!!"}
    }
    else{
      jwt.verify(token, process.env.JWT_SECRET_KEY, (error, user)=>{
        if(error){
          throw { statusCode:401, message: "Invalid token" }
      }
      //console.log("Line number 18: "+user._doc._id);
      req.user = user
      next();
     });
    }
  }catch(error){
    res.status(error.statusCode).json({message:error.message})
  }
    
};

export default checkTokenHeader;
