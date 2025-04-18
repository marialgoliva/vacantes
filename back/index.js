const express = require('express')
const app = express();
const cors = require('cors');
const mysql = require('mysql')
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'vacantes_react'
});



app.use(cors());
app.use(express.json());
app.listen(3001,()=>{
    console.log('listening on 3001')
});

app.get('/', (req,res)=>{
    res.send({status:200});
})

//empresa
//crear empresa
app.post('/company',(req,res)=>{
    const company = req.body.company
    const username = req.body.username
    const email = req.body.email 
    const password = req.body.password 
    const logo = req.body.logo
    
    db.query(`INSERT INTO company (company,username,email,password,logo) VALUES (?,?,?,md5(?),?)`,[company,username,email,password,logo],
        (err,result) => {
            if (err) {
                res.send({
                    status:400,
                    message: err
                })
            } else {
                res.send(
                    {
                        status: 201,
                        message: 'Empresa creada con exito',
                        data: result
                    }
                )
            }
        }
    )

});
//login
app.post('/login',(req,res)=>{
    const email = req.body.email 
    const password = req.body.password 
    
    db.query(`SELECT company_id,company,username,email,logo FROM company WHERE email=? AND password=md5(?)`,[email,password],
        (err,result) => {
            if (err) {
                res.send({
                    status:500,
                    message: err
                })
            } else {
                if(result.length>0){
                    res.status(200)
                    .send(result[0])
                } else {
                    res.status(401).send({
                        status:401,
                        message:'Usuario o contraseña incorrectos'
                    })
                }
                
            }
        }
    )

});
//consultar empresa
app.get('/company/:id',(req,res)=>{
    const companyId = req.params.id
    
    db.query(`SELECT company_id,company,username,email,logo FROM company WHERE company_id=${companyId}`,
        (err,result) => {
            if(result.length>0){
                res.status(200)
                .send(result[0])
            } else {
                res.status(400).send({
                    message:'No existe la empresa'
                })
            }
        }
    )

});

//vacantes
//crear vacante
app.post('/job',(req,res)=>{
    const title = req.body.title
    const from_date = req.body.from_date
    const until_date = req.body.until_date 
    const city = req.body.city 
    const job_type = req.body.job_type
    const experience = req.body.experience
    const company_id = req.body.company_id
    
    db.query(`INSERT INTO job (title,from_date,until_date,city,job_type,experience,company_id) VALUES (?,?,?,?,?,?,?)`,[title,from_date,until_date,city,job_type,experience,company_id],
        (err,result) => {
            if (err) {
                res.status(400).send({message: err})
            } else {
                res.send(
                    {
                        status: 201,
                        message: 'Vacante creada con exito',
                        data: result
                    }
                )
            }
        }
    )

});
//consultar vacante
app.get('/job/:id',(req,res)=>{
    const id = req.params.id
    
    db.query(`SELECT * FROM job WHERE job_id=${id}`,
        (err,result) => {
            if(result.length>0){
                res.status(200)
                .send(result[0])
            } else {
                res.status(400).send({
                    message:'No existe la vacantes'
                })
            }
        }
    )

});
//editar vacante
app.put('/job/:id',(req,res)=>{
    const id = req.params.id
    const title = req.body.title
    const from_date = req.body.from_date
    const until_date = req.body.until_date 
    const city = req.body.city 
    const job_type = req.body.job_type
    const experience = req.body.experience
    const company_id = req.body.experience
    
    db.query(`UPDATE job SET title=?,from_date=?,until_date=?,city=?,job_type=?,experience=?,company_id=? WHERE job_id=?`,[title,from_date,until_date,city,job_type,experience,company_id,id],
        (err,result) => {
            if (err) {
                res.status(400).send({message: err})
            } else {
                res.status(200).send(
                    {
                        message: 'Vacante actualizada con exito',
                        data: result
                    }
                )
            }
        }
    )

});
//eliminar vacante
app.delete('/job/:id',(req,res)=>{
    const id = req.params.id
    
    db.query(`UPDATE job SET deleted=1 WHERE job_id=?`,[id],
        (err,result) => {
            if (err) {
                res.status(400).send({message: err})
            } else {
                res.status(200).send(
                    {
                        message: 'Vacante eliminada con exito',
                        data: result
                    }
                )
            }
        }
    )

});
//listar vacantes por empresa paginado y ordenado
app.get('/job/all/:company_id/:page/:limit',(req,res)=>{
    const id = req.params.company_id
    const page = req.params.page
    const limit = req.params.limit

    const startPage = (page-1) * limit
    
    db.query(`SELECT * FROM job WHERE company_id=${id} ORDER BY job_id DESC limit ${startPage}, ${limit}`,
        (err,result) => {
            if(result.length>0){
                res.status(200) 
                .send(result)
            } else {
                res.status(400).send({
                    message:'No existen datos'
                })
            }
        }
    )

});

//listar todas las vacantes
app.get('/job/all/:page/:limit',(req,res)=>{
    const page = req.params.page
    const limit = req.params.limit

    const startPage = (page-1) * limit
    
    db.query(`SELECT * FROM job ORDER BY job_id DESC limit ${startPage}, ${limit}`,
        (err,result) => {
            if(result.length>0){
                res.status(200) 
                .send(result)
            } else {
                res.status(400).send({
                    message:'No existen datos'
                })
            }
        }
    )

});

//personas
//crear persona
app.post('/persons',(req,res)=>{
    const dni = req.body.dni
    const name = req.body.name
    const email = req.body.email 
    const img = req.body.img
    
    db.query(`INSERT INTO persons (dni,name,email,img) VALUES (?,?,?,?)`,[dni,name,email,img],
        (err,result) => {
            if (err) {
                res.status(400).send({message: err})
            } else {
                res.send(
                    {
                        status: 201,
                        message: 'Cuenta creada con exito',
                        data: result
                    }
                )
            }
        }
    )

});