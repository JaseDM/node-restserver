const express = require('express');

const bcrypt = require('bcrypt');

const _ = require('underscore');

const app = express();
const Usuario = require('../models/usuario');




app.get('/usuario', function (req, res) {

    // req.query recoje parametros opcionales
    // en el caso de no venir el dato let desde = 0
    let desde = req.query.desde || 0;
    let limite = req.query.limite || 5;

    // desde es un string. Para que funcione hay que 
    // convertirlo en un numero
    // Numbre() Funfión para convertir String en Number 
    desde = Number(desde);
    limite = Number(limite);


    // Función find 
    // Primer párametro filtra los resultados de la db
    // segundo párametro filtra los campos a mostrar
    Usuario.find({estado: true}, 'nombre email')
            // Limite de resultados a mostrar 
            .limit(limite)
            // Desde el resultado seleccionado en adelante
            .skip(desde)
            // Ejecuta la consulta
            .exec( (err, usuarios) => {
                // Condicional que devuelve el error 
                if(err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                // .count - numero de registros en db
                Usuario.count({estado: true}, (err, contador) => {
                    // Respuesta ok y objeto con los resultados
                    res.json({
                        ok: true,
                        usuarios,
                        contador
                    })
                })

                
            })

})



// Petición POST para nuevo usuario  
app.post('/usuario', function (req, res) {

    // Recuperamos el objeto del body y se lo asignamos a una nueva variable
    let body = req.body;

    // Insertamos los datos del objeto body en una 
    // nueva instancia del schema usuario
    let usuario = new Usuario({
        nombre: body.nombre,
        email:  body.email,
        password: bcrypt.hashSync( body.password, 10 ),
        role: body.role
    });

    // Salvamos la nueva instancia del Schema usuario en db
    usuario.save( (err, usuarioDB) => {
        // Comprueba si hay algun error en la inserción en bd
        if( err ){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        // Devuelve dentro del objeto el valor password a NULL
        //usuarioDB.password = null;

        // Si no hay errores, devuelve un ok y el objeto del body
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    });
})

// Petición PUT para actualizar un registro de db
app.put('/usuario/:id', function (req, res) {
    // Guardamos el parametro id de la url
    let id = req.params.id;
    // Guerdamos el objeto con los datos que nos llega de body
    // Y filtramos con _.pick los que si se pueden actualizar
    let body = _.pick(req.body, ['nombre','email','img','role','estado'])

    // Busca y actualiza un registro por la ID. 
    // Primer parametro la id
    // Segundo parametro el objeto con la información a cambiar
    // Tercer parametro de opciones {new: devuelve el nuevo arreglo de datos, runValidators: Obliga a usar la validación del modelo }
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, usuarioDB) => {

        if(err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    })
});

app.delete('/usuario/:id', function (req, res){

    let id = req.params.id;
    let body = {
        estado: false
    }


    Usuario.findByIdAndUpdate(id, body, { new: true }, (err, usuarioEliminado) => {

        if(err) {
            return res.status(400).json({
                ok: false,
                err,
                message: 'El usuario no se encuentra en la base de datos'
            });
        }



        res.json({
            ok: true,
            usuario: usuarioEliminado,
            message: 'Usuario eliminado correctamente'
        });

    })

    

})


app.delete('/usuarioborrado/:id', function (req, res) {

    let id = req.params.id;
    
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) =>{

        if(err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(usuarioBorrado === null) {
            return res.status(400).json({
                ok: false,
                err: 'Usuario no encontrado'
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        })



    })

});


module.exports = app;
  