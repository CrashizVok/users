const { log } = require("node:console")
const express = require("express")
const argon2 = require("argon2");
const app = express()
app.use(express.json())

const knex = require("knex")({
    client: "mysql2",
    connection:{
        host: "localhost",
        user: "root",
        password: "",
        database: "users"
    }
})

const PORT = 3000

/*
TODO --

GET /users, GET /users/{id}, POST /users, PUT /users/{id}, DELETE /users/{id}

DATABASE: 

*/

// GET /users
app.get("/users", async (req, res) =>{
    try{
        const users = await knex("users").select("id", "name", "email")
        res.status(200).json(users)
    }
    catch (error){
        log("GET /users --> ", error.message)
        res.status(500).json({error: "Something isn't right. Please try again later!"})
    }
})

// GET /users/{id}
app.get("/users/:id", async (req, res) =>{
    const {id} = req.params
    try{
        const user = await knex("users").select("id", "name", "email").where("id", id)

        if (user.length == 0) {
            return res.status(404).json({error: "User isn't exist"})
        }

        res.status(200).json(user)
    }
    catch (error){
        log("GET /users:id --> ", error.message)
        res.status(500).json({error: "Something isn't right. Please try again later!"})
    }
})
 
// POST /users
app.post("/users", async (req, res) =>{
    const {name, email, password} = req.body

    try{
        const hashedPassword = await argon2.hash(password)

        const insertId = await knex("users").insert({
            name: name,
            email: email,
            password:hashedPassword
        })

        res.status(201).json({
            message: "User succesfully created",
            user:{
                id: insertId,
                name: name,
                email:email
            }
        })
    }
    catch (error){
        log("POST /users --> ", error.message)
        res.status(500).json({error: "Something isn't right. Please try again later!"})
    }
})

// PUT /users/{id}
app.put("/users:id", (req, res) =>{

})

//  DELETE /users/{id}
app.delete("/users:id", (req, res) =>{

})






app.listen(PORT, () =>{
    log("Server is running on port: ", PORT)
})