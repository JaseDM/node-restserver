require('./config/config');
const express = require('express');
const app = express();


const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
 

 
app.get('/usuario', function (req, res) {
  res.json('Get usuarios')
})

app.post('/usuario', function (req, res) {

    if(req.body.nombre === undefined){
        res.status(400).json({
            ok: false,
            message: 'El nombre es necesario'
        });  
    }else{
       let body = req.body;
        res.json({persona: body}); 
    }

    

    


  })

app.put('/usuario/:id', function (req, res) {

    let id = req.params.id;

    res.json({
        id
    })
})
app.delete('/usuario', function (req, res) {
    res.json('delete usuarios')
})
 
app.listen(process.env.PORT, () => {
    console.log('escuchando el puerto 3000');
})