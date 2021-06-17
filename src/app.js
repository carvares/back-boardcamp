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
    console.log(req.query.name)
    if(req.query.name){
        try{
            const promisse = await connection.query('SELECT * FROM games WHERE name ILIKE $1',[req.query.name +"%"])
            res.send(promisse.rows)
        } catch{
            res.sendStatus(400);
        }
    } else{
    try{
        const promisse = await connection.query('SELECT * FROM games')
        
        res.send(promisse.rows)
        

    } catch{
        res.sendStatus(400);
    }
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
    res.sendStatus(400);
}
});

app.get('/customers',async(req,res)=>{
    if(req.query.cpf){
        console.log("entrou no if")
        try{
            const promisse = await connection.query('SELECT * FROM customers WHERE cpf LIKE $1',[req.query.cpf + "%"])
            res.send(promisse.rows)
        } catch{
            res.sendStatus(400);
        }
    } else{
    try{
        const promisse = await connection.query('SELECT * FROM customers')
        res.send(promisse.rows)
        

    } catch{
        res.sendStatus(400);
    }
}
});
app.get('/customers/:id',async(req,res)=>{
    const id = req.params.id
    console.log(id)
    
        try{
            const promisse = await connection.query('SELECT * FROM customers WHERE id = $1',[id])
            if(promisse.rows.length > 0){
                res.send(promisse.rows)
            } else {
                res.sendStatus(404)
            }
            
        } catch{
            res.sendStatus(404);
        }
   
    

});

app.post('/customers',async(req,res)=>{
    const {name, cpf, phone, birthday} = req.body
    
    if(cpf.length === 11 &&  (phone.length === 10 || phone.length === 11) && name.length > 0){
        
        const verify = await connection.query('SELECT * FROM customers WHERE cpf = $1',[cpf])
        if(verify.rows.length === 0){
            
            try{
                
                const promisse = await connection.query('INSERT INTO customers (name, cpf, phone, birthday) VALUES ($1, $2, $3, $4)', [name,cpf, phone, birthday])
                
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

app.put('/customers/:id',async(req,res)=>{
    const {name, cpf, phone, birthday} = req.body
    const id = req.params.id
    
    if(cpf.length === 11 &&  (phone.length === 10 || phone.length === 11) && name.length > 0){
        
        const verify = await connection.query('SELECT * FROM customers WHERE cpf = $1',[cpf])
        if(verify.rows.length === 0 || verify.rows[0].cpf === cpf){
            
            try{
                
                const promisse = await connection.query('UPDATE customers SET name = $1, cpf = $2, phone = $3, birthday = $4 WHERE id = $5', [name,cpf, phone, birthday,id])
                
                res.sendStatus(200);
                
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
app.listen(4000,()=>{console.log('server rodando!')})