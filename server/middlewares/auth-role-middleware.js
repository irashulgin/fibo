// const ApiError = require("../exceptions/api-error");
// const tokenService = require("../services/token-service");

// module.exports = function(req,res,next) {
//     try {
        
//         const authorizationHeader = req.headers.authorization;
//         if (!authorizationHeader) {
//             return  next(ApiError.UnauthorizedError())
//         }
//         const accessToken = authorizationHeader.split(' ')[1];
//         if (!accessToken) {
//             return  next(ApiError.UnauthorizedError())
//         }
//         const userData = tokenService.validateAccessToken(accessToken);
//         if (!userData) {
//             return  next(ApiError.UnauthorizedError())
//         }

//         if (!userData || !userData.roles.includes(role)) {
//             return next(ApiError.UnauthorizedError())
//         }
        
//         req.user = userData;
//         next();
//     } catch (e) {
//         return  next(ApiError.UnauthorizedError())
//     }
// }
const authRoleMiddleware = (permissions) => {
    return (req,res,next)=>{
        const userRole = req.body.role;
        if(permissions.includes(userRole)){
            next();
        }
        else {  
            return  next(ApiError.UnauthorizedError())
        }
    }
}
module.exports = {authRoleMiddleware}