const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    MESSAGE: '{VALUE} no es un rol válido'
}

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});



// Metodo toJSON del schema se usa cuando un 
// Schema se manda a imprimir
usuarioSchema.methods.toJSON = function(){
    // Recupera lo que tenga en este momento el metodo 
    let user = this;
    // Guardamos las propiedades y metodos
    let userObject = user.toObject();
    // Borramos la propiedad password
    delete userObject.password;
    // Retornamos el objeto sin la propiedad
    return userObject;
}

usuarioSchema.plugin( uniqueValidator, {message: '{PATH} debe de ser único'})


module.exports = mongoose.model('Usuario', usuarioSchema);