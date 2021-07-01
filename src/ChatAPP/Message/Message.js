import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown } from 'react-bootstrap';
import "./Message.css"
import ham from "./im.png"
import Axios from "axios";
import io from "socket.io-client";

function Message(props) {

    const [users,setUsers] = useState([]);
    const [user,setUser] = useState([]);
    const [message,setMessage] = useState("");
    const [messages , setMessages] = useState([]);

    //Lists of Users
    useEffect(()=>{
        Axios.get("http://localhost:8080/listUsers/"+props.match.params.id).then((response)=>{
                console.log(response.data);
                setUsers(response.data);
            });
      
    },[])

    //Update user connect 
    const logout = ()=>{
        Axios.put("http://localhost:8080/updatelogout/"+props.match.params.id);
        console.log(props.match.params.id);
    }

    const talk = (id)=>{
        Axios.get("http://localhost:8080/user/"+id).then((response)=>{
            setUser(response.data[0]);
            console.log(response.data[0]);
            Axios.post("http://localhost:8080/viewMessage/"+props.match.params.id,{
                iddestinataire : user.id
            }).then((response)=>{
                console.log("HI");
                console.log(response.data);
                setMessages(response.data);
            })
        });
    };

    console.log(user.id);
    //Delete account
    const deleteUser = ()=>{
        Axios.delete("http://localhost:8080/delete/"+props.match.params.id).then((response)=>{
            window.location.href="/login";
        });
    } 
    
    //Send Message
    const sendMissage = ()=>{
        Axios.post("http://localhost:8080/message",{
            message : message,
            id : props.match.params.id,
            iddestinataire : user.id
        }).then((response)=>{

        });
        document.getElementById('sendMessage').value=null;
    }

    return (
        <div >
            <div className="navcontainer">
                <nav>
                    <h2> <span>hh</span>Welcome to my Chat App</h2>
                    <Dropdown className="Dropdown">
                        <Dropdown.Toggle variant="success" id="dropdown-basic" id="ex">
                            <i class="fas fa-user-circle fa-2x"></i>
                        </Dropdown.Toggle>
                        <span>hh</span>
                        <Dropdown.Menu className="dropdown">
                            <Dropdown.Item href="/profil" className="link"><a href="/profil">Profil</a></Dropdown.Item>
                            <Dropdown.Item href="/login " className="link"><a href="/login" onClick={logout}>Se déconnecter</a></Dropdown.Item>
                            <Dropdown.Item  className="link" onClick={()=>deleteUser()}><a>Supprimer mon compte</a></Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    
                </nav>
            </div>
            <div className="message">
                <div className="lists">
                    <h2><img src={ham}/>  Discussions</h2>
                    
                    {users.map(user=>(
                            <div className="list" key={user.id} onClick={()=>talk(user.id)}>
                                <div className="rounded">
                                    <img src={ham}/>
                                </div>
                                <div className="users">
                                    {user.prenom} {user.nom}
                                    <br/>
                                    {user.connecte?"online":"offline"}
                                </div>
                            </div>
                    ))}
                </div>
                <div className="chat">
                    <h3><img src={ham}/>{user.nom} {user.prenom}</h3>
                    <div className="corps">
                        {messages.map(message=>(
                            <div key={message.id}>
                                <p>{message.contenu}</p>
                            </div>
                        ))}
                    </div>
                    <div className="sending">
                        <p>
                            <textarea id="sendMessage" onChange={(e)=>setMessage(e.target.value)} placeholder="Type your message..."/>
                        </p>
                        <p>
                            <button onClick={()=>sendMissage()}><i class="fa fa-paper-plane fa-2x" aria-hidden="true"></i></button>
                        </p>
                    </div>
                </div>
            </div>
                        
        </div>
    )
}

export default Message