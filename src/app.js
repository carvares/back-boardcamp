import express from 'express';
import cors from 'cors';
import dayjs from 'dayjs';
import pg from 'pg';

const app = express();
app.use(express.json())
app.use(cors())
const {Pool} = pg;

const connection = new Pool({
    user: 'bootcamp_role',
    password: 'senha_super_hiper_ultra_secreta_do_role_do_bootcamp',
    host: 'localhost',
    port: 5432,
    database: 'boardcamp'
});
app.get('/categories',async(req,res)=>{
    
    try{
        const promisse = await connection.query('SELECT * FROM categories')
        
        res.send(promisse.rows)
        

    } catch{
        res.sendStatus(400);
    }
});

app.post('/categories',async(req,res)=>{
    const {name} = req.body
    
    if(name.length >0){
        
        const verify = await connection.query('SELECT * FROM categories WHERE name LIKE $1',[name])
        if(verify.rows.length === 0){
            try{
                const promisse = await connection.query('INSERT INTO categories (name) VALUES ($1)', [name])
                
                res.sendStatus(201);
        
            } catch{
                res.sendStatus(400);
            }
        } else {
            res.send(409);
        }
} else {
    res.sendStatus(400);
}
});

app.get('/games',async(req,res)=>{
    
    try{
        const promisse = await connection.query('SELECT * FROM games')
        
        res.send(promisse.rows)
        

    } catch{
        res.sendStatus(400);
    }
});

app.post('/games',async(req,res)=>{
    const {name, image, stockTotal,categoryId,pricePerDay} = req.body
    
    if(name.length > 0 &&  stockTotal > 0 && pricePerDay > 0){
        
        const verify = await connection.query('SELECT * FROM games WHERE name LIKE $1',[name])
        if(verify.rows.length === 0){
            
            try{
                
                const promisse = await connection.query('INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5)', [name, image, stockTotal,categoryId,pricePerDay])
                
                res.sendStatus(201);
                
            } catch{
                res.sendStatus(400);
            }
        } else {
            res.send(409);
        }
} else {
    console.log("400 de baixo")
    res.sendStatus(400);
}
});

app.listen(4000,()=>{console.log('server rodando!')})