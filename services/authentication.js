const jwt = require('jsonwebtoken')


const secret = 'KING_OF_THE_ASIA';

function createToken(user){
    const payload = {
        id: user._id,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
    };
    const token = jwt.sign(payload, secret);
    return token;
}   

function validateToken(token){
   const payload = jwt.verify(token, secret);
   return payload;
}


module.exports = {
    createToken,
    validateToken,
}