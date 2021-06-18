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
        
        const verify = await connection.query('SELECT * FROM categories WHERE name ILIKE $1',[name])
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
    if(req.query.name){
        try{
            const promisse = await connection.query('SELECT games.*, categories.name AS "categorieName" FROM games JOIN categories ON games."categoryId" = categories.id WHERE games.name ILIKE $1',[req.query.name +"%"])
            res.send(promisse.rows)
        } catch{
            res.sendStatus(400);
        }
    } else{
    try{
        const promisse = await connection.query('SELECT games.*, categories.name AS "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id')
        
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
    const id = parseInt(req.params.id)
    
    if(cpf.length === 11 &&  (phone.length === 10 || phone.length === 11) && name.length > 0){
        
        const verify = await connection.query('SELECT * FROM customers WHERE cpf = $1',[cpf])
        if(verify.rows.length === 0 || (verify.rows[0].id === id && verify.rows[0].cpf === cpf )){
            
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

app.get('/rentals',async(req,res)=>{
    if(req.query.gameId){
        try{
            const promisse = await connection.query(`
                SELECT rentals.*, 
                jsonb_build_object('name', customers.name, 'id', customers.id) AS customer,
                jsonb_build_object('id', games.id, 'name', games.name, 'categoryId', games."categoryId", 'categoryName', categories.name) AS game            
                FROM rentals 
                JOIN customers ON rentals."customerId" = customers.id
                JOIN games ON rentals."gameId" = games.id
                JOIN categories ON categories.id = games."categoryId"
                WHERE games.id = $1`,[req.query.gameId]
                )
            res.send(promisse.rows)
        } catch{
            res.sendStatus(400);
        }
    }
    if(req.query.customerId){
        try{
            const promisse = await connection.query(`
                SELECT rentals.*, 
                jsonb_build_object('name', customers.name, 'id', customers.id) AS customer,
                jsonb_build_object('id', games.id, 'name', games.name, 'categoryId', games."categoryId", 'categoryName', categories.name) AS game            
                FROM rentals 
                JOIN customers ON rentals."customerId" = customers.id
                JOIN games ON rentals."gameId" = games.id
                JOIN categories ON categories.id = games."categoryId"
                WHERE customers.id = $1`,[req.query.customerId]
                )
            res.send(promisse.rows)
        } catch{
            res.sendStatus(400);
        }
    } else{
    try{
        const promisse = await connection.query(`
                SELECT rentals.*, 
                jsonb_build_object('name', customers.name, 'id', customers.id) AS customer,
                jsonb_build_object('id', games.id, 'name', games.name, 'categoryId', games."categoryId", 'categoryName', categories.name) AS game            
                FROM rentals 
                JOIN customers ON rentals."customerId" = customers.id
                JOIN games ON rentals."gameId" = games.id
                JOIN categories ON categories.id = games."categoryId"`
                )
        res.send(promisse.rows)
        

    } catch{
        res.sendStatus(400);
    }
}
});

app.post('/rentals', async(req,res)=>{
    const {customerId, gameId, daysRented} = req.body
    
    const verifyCustomerId = await connection.query('SELECT * FROM customers WHERE id = $1',[customerId]) 
    if(verifyCustomerId.rows.length !== 0 && daysRented > 0){
        const verifyGameId = await connection.query('SELECT * FROM games WHERE id = $1',[gameId])
        if(verifyGameId.rows.length !== 0){
            try{
                console.log(customerId, gameId,daysRented, "'" + dayjs().format('YYYY-MM-DD') + "'", verifyGameId.rows[0].pricePerDay * daysRented)
                await connection.query(`INSERT INTO rentals 
                ("customerId", "gameId",  "rentDate", "daysRented", "returnDate", "originalPrice",  "delayFee") 
                VALUES ($1, $2, $3, $4, $5, $6, $7)`, 
                [customerId, gameId,"'" + dayjs().format('YYYY-MM-DD') + "'", daysRented, null, verifyGameId.rows[0].pricePerDay * daysRented, null])

                res.sendStatus(201)
            } catch{
                res.sendStatus(400)
            }
        } else {
            
            res.sendStatus(401)
        }
    } else {
        
        res.sendStatus(402)
    }
    
});

app.post('/rentals/:id/return', async(req,res)=>{
   
    try{
        const promisse =  await connection.query('SELECT * FROM rentals WHERE id = $1',[req.params.id])
        if( promisse.rows.length === 0){
            return res.sendStatus(404)
        }
        if(promisse.rows[0].returnDate !== null){
            return res.sendStatus(400)
        }
        const diffdays = dayjs('2021-06-21').diff(promisse.rows[0].rentDate, 'day')
        const delayFee = diffdays > promisse.rows[0].daysRented? (diffdays * ( promisse.rows[0].originalPrice / promisse.rows[0].daysRented)) - promisse.rows[0].originalPrice : 0;
        const rentgame = await connection.query('UPDATE rentals SET "returnDate" = $1 , "delayFee" = $2 WHERE id = $3',["'"+ dayjs().format('YYYY-MM-DD') + "'",delayFee,req.params.id])
        res.sendStatus(200)
        
    } catch{
        res.sendStatus(400);
    }
    
});

app.delete("/rentals/:id", async (req, res) => {
    const {id} = req.params;

    try {
        const checkDeletion = await connection.query('SELECT * FROM rentals WHERE id = $1', [id]);
        if (checkDeletion.rows.length === 0) {
            res.status(404).send("Não há nenhum jogo com este ID para ser deletado!")
            return;
        }
        else if (checkDeletion.rows[0].returnDate) {
            res.status(400).send("Este aluguel já foi finalizado!");
            return;
        }
        await connection.query('DELETE FROM rentals WHERE id = $1', [id]);
        res.sendStatus(200);
    } catch {
        res.status(400).send("Ocorreu um erro. Por favor, tente novamente!");
    };
});


app.listen(4000,()=>{console.log('server rodando!')})