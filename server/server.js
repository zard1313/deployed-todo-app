const PORT = process.env.PORT ?? 8000 // ?? : it it doesn't exist default 8000
const express = require("express");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");
const app = express();
const pool = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

app.use(cors())
app.use(express.json());

// get all todos
app.get('/todos/:userEmail', async (req, res) => {
    // console.log(req);
    // const userEmail = req.params.userEmail;
    const { userEmail } = req.params;
    try{
        // const todos = await pool.query('SELECT * FROM todos');
        const todos = await pool.query("SELECT * FROM todos WHERE USER_EMAIL = $1", [userEmail]);

        res.json(todos.rows);
    }catch(err){
        console.error(err);
    }
});

// Create a new todo
app.post("/todos", async (req, res) => {
    const {user_email, title, progress, date} =  req.body;
    console.log(user_email, title, progress, date);
    const id = parseInt(uuidv4());
    console.log(id);

    try{
        const newToDo = await pool.query("INSERT INTO todos(id, user_email, title, progress, date) VALUES($1, $2, $3, $4, $5)", [id, user_email, title, progress, date]);
        res.json(newToDo);
    }catch(err){
        console.error(err);
    }
});

// edit a todo
app.put("/todos/:id", async (req, res) => {
    const { id } = req.params;
    const {user_email, title, progress, date} =  req.body;
    try{
        const editToDo = await pool.query("UPDATE todos SET title=$1, progress=$2 WHERE ID=$3", [title, progress, id]);
        res.json(editToDo);
    }catch(err){
        console.error(err);
    }
});

// delete a todo
app.delete("/todos/:id", async (req, res) => {
    const { id } = req.params;
    try{
        const deleteTodo = await pool.query("DELETE FROM todos WHERE id = $1", [id]);
        res.json(deleteTodo);
    }catch(err){
        console.error(err)
    }

});

// signup
app.post('/signup', async (req, res) => {
    const {email, password} = req.body;
    const salt = bcrypt.genSaltSync(10);
    
    const hashpassword = bcrypt.hashSync(password, salt);
    
    try{
        const signUp = await pool.query("INSERT INTO users(email, hashed_password) VALUES($1, $2)", [email, hashpassword]);
        // res.json(sinnup);
        const token = jwt.sign({ email }, "secret", { expiresIn: "1hr" });
        res.json({ email, token });

    }catch(err){
        // console.error(err);
        if(err){
            res.json({ detail: err.detail });
        }
    }

    // the correct way to use bcyrpt in Node.js
    // bcrypt.genSalt(10, function(err, salt) {
    //     if (err) return; //handle error

    //     bcrypt.hash(clearPassword, salt, function(err, hash) {
    //         if (err) return; //handle error
    //         // Store hash in your password DB.
    //     });
    // });
});

// login
app.post('/login', async (req, res) => {
    const {email, password} = req.body;
    try{
        const users = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if(!users.rows.length) return res.json({detail: "User does not exist!"});

        const success = await bcrypt.compare(password, users.rows[0].hashed_password)
        const token = jwt.sign({ email }, "secret", { expiresIn: "1hr" });

        if(success){
            res.json({ "email": users.rows[0].email, token});
        }else{
            res.json({ detail: "Login failed!" });
        }
    }catch(err){
        console.error(err);
    }
});

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
