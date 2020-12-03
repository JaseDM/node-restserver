const jwt = require('jsonwebtoken');

//====================
// Verificar Token
//====================

let verificarToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if ( err ){
            return res.status(401).json({
                ok: false,
                err: {

                    message: 'Token no valido'
                }
            })
        }


        req.usuario = decoded.usuario;

        
        next();
    })
    

    
};

let verificarAdmin_Role = (req, res, next) => {
    let usuario = req.usuario;
    if ( usuario.role !=='ADMIN_ROLE' ){
        return res.status(401).json({
            ok: false,
            err: {

                message: 'No tienes permisos'
            }
        })
    }
    
    next();
}


module.exports = {
    verificarToken,
    verificarAdmin_Role
}