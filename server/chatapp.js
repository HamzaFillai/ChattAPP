const express = require("express");
const app =  express();
const mysql = require("mysql");
const cors = require("cors");
const io = require("socket.io")(8900, {
    cors: {
      origin: "http://localhost:3000",
    },
  });

let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    user : "root",
    host : "localhost",
    password : "",
    database : "chatapp"
});

io.on("connection", (socket) => {
    //when ceonnect
    console.log("a user connected.");
    io.emit("welcome","Hello !");
    }
)

//User Registration
app.post("/register",(request,response)=>{
    const nom=request.body.nom;
    const prenom= request.body.prenom;
    const email = request.body.email;
    const password = request.body.password;
    if(re.test(email)==false)
    {
        response.send({err:"Ce n'est pas la bonne forme de l'adresse mail !"});
    }
    else
    {
        db.query(
            "select * from users where email = ?",
            [email],
            (err,result)=>{
                if(err){
                    console.log(err);
                }
                if(result.length>0){
                    response.send({err:"Cette adresse mail existe déjà"});
                }
                else{
                    db.query(
                        "INSERT INTO `users`(`nom`, `prenom`, `email`, `password`,`connecte`) VALUES (?,?,?,?,0)",
                        [nom,prenom,email,password],
                        (err,result)=>{
                            if(err){
                                console.log(err);
                            }
                            else
                            {
                                response.send(result);
                            }
                        }
                    )
                }
            }
        )
    }
    
});

//Login 
app.post("/login",(request,response)=>{
    const email = request.body.email;
    const password = request.body.password;

    if(re.test(email)==false)
    {
        response.send({err:"Ce n'est pas la bonne forme de l'adresse mail !"});
    }
    else{
        db.query(
            "select * from users where email = ? and password = ?",
            [email,password],
            (err,result)=>{
                if(err){
                    console.log(err);
                }
                if(result.length>0){
                    response.send(result);
                }
                else{
                    response.send({error : "Adresse mail ou mot de passe incorract !"})
                }
            }
        )
    }
})

//Get lists of users
app.get("/listUsers/:id",(request,response)=>{
    db.query("SELECT * FROM users WHERE id!=? ORDER BY id",[request.params.id],(err,result)=>{
        if(err){
            console.log(err);
        }else{
            response.send(result);
        }
    })
})

//Get user by his id
app.get("/user/:id",(request,response)=>{
    db.query("SELECT * FROM users WHERE id =?",
    [request.params.id],
    (err,result)=>{
        if(err){
            console.log(err);
        }
        else{
            response.send(result);
        }
    })
})

//Edit connect by 1 whene user is connected
app.put("/updatelogin",(resquest,response)=>{
    db.query("UPDATE users SET connecte = 1 where email = ?",
    [resquest.body.email],
    (err,result)=>{
        if(err){
            console.log(err);
        }
        else{
            response.send(result);
        }
    })
})

//Edit connect by 0 whene user disconnected
app.put("/updatelogout/:id",(request,response)=>{
    db.query("UPDATE users SET connecte = 0 where id = ?",
    [request.params.id],
    (err,result)=>{
        if(err){
            console.log(err);
        }
        else{
            response.send(result);
        }
    })
})

//Delete user acount
app.delete("/delete/:id",(request,response)=>{
    const id = request.params.id;
    db.query("DELETE FROM users WHERE id = ?",[id],(err,result)=>{
        if(err)
        {
            console.log(err);
        }
        else
        {
            response.send(result);
        }
    })
})

//Send Message
app.post("/message",(resquest,response)=>{
    const id = resquest.body.id;
    const message=resquest.body.message;
    const iddestinataire=resquest.body.iddestinataire;
    db.query("INSERT INTO `message`(`contenu`, `id_send`, `id_reveive`) VALUES (?,?,?)",
    [message,id,iddestinataire],
    (err,result)=>{
        if(err)
        {
            console.log(err);
        }
        else
        {
            response.send(result);
        }
    })
})

//View the messages
app.post("/viewMessage/:id",(request,response)=>{
    const id = request.params.id;
    const iddestinataire = request.body.iddestinataire;
    db.query("SELECT * FROM message WHERE (id_send = ? and id_reveive = ?) or (id_send = ? and id_reveive = ?) ORDER BY id",[id,iddestinataire,iddestinataire,id],(err,result)=>{
        if(err)
        {
            console.log(err);
        }
        else
        {
            response.send(result);
        }
    })
})

app.listen(8080, () => {
    console.log("Yey, your server is running on port 8080");
  });
  