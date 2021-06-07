const express = require("express");
const app =  express();
const mysql = require("mysql");
const cors = require("cors");
let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    user : "root",
    host : "localhost",
    password : "",
    database : "chatapp"
})

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

app.get("/listUsers/:id",(request,response)=>{
    db.query("SELECT * FROM users WHERE id!=?",[request.params.id],(err,result)=>{
        if(err){
            console.log(err);
        }else{
            response.send(result);
        }
    })
})

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

app.listen(8080, () => {
    console.log("Yey, your server is running on port 8080");
  });
  