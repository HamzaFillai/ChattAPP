import React, { useState } from 'react'
import "./Login.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button , Modal} from 'react-bootstrap';
import Axios from "axios";
import { useHistory } from "react-router-dom";

function Login() {

    const [show, setShow] = useState(false);

    const [nom,setNom] = useState("");
    const [prenom,setPrenom] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [message,setMessage] = useState("");
    const [val , setVal] = useState("");
    const [error,setError] = useState("");
    const history = useHistory();
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const register = () =>{
        Axios.post("http://localhost:8080/register",{
            nom : nom,
            prenom : prenom,
            email : email,
            password : password
        }).then((response)=>{
            if(response.data.err)
            {
                setError(response.data.err);
                setMessage("");
            }
            else
            {
                setError("");
                setMessage("Bienvune dans notre application");
                setTimeout('window.location.href = "/login";',2000);
            }
        })
    }
    

    const login = () =>
    {
        Axios.post("http://localhost:8080/login",{
            email : email,
            password : password
        }).then((response)=>{
            console.log(response.data);
            if(response.data.err)
            {
                setVal(response.data.err);
            }
            else if(response.data.error)
            {
                setVal(response.data.error);
            }
            else
            {
                Axios.put("http://localhost:8080/updatelogin",{email : email});
                window.location.href="/user/"+response.data[0].id;
            }
        })
    }
    return (
        <div className="containe">
            <div className="cont">
                <i class="fas fa-comment-alt fa-6x"></i>
                <div className="form">
                    <h1>Se connecter</h1>
                    <p className="vali"> {val}</p>
                    <p>
                        <input className="inp1" type="email" placeholder="Adresse mail" onChange={(e)=>setEmail(e.target.value)}/>
                    </p>
                    <p>
                        <input className="inp1" type="password" placeholder="Mot de passe" onChange={(e)=>setPassword(e.target.value)}/>
                    </p>
                    <p>
                        <button className="btn" onClick={login}>Se connecter</button>
                    </p>
                    <p className="web">
                        <a>Mot de passe oublié</a>. Si vous n'avez pas de compten <a variant="primary" onClick={handleShow}>cliquer ici !</a>
                    </p>
                </div>
            </div>
            

            <Modal className="modal" show={show} onHide={handleClose}>
                <div className="register">
                    <Modal.Header closeButton>
                        <h1>Créer un compte</h1>
                    </Modal.Header>
                    <Modal.Body>
                        <p className="val">{message}</p>
                        <p className="err">{error}</p>
                        <table>
                            <tbody>
                                <tr>
                                    <td align="right"><label>Nom : </label></td>
                                    <td><input type="text" onChange={(e)=>setNom(e.target.value)} required/></td>
                                </tr>
                                <tr>
                                    <td align="right"><label>Prénom : </label></td>
                                    <td><input type="text" onChange={(e)=>setPrenom(e.target.value)} required/></td>
                                </tr>
                                <tr>
                                    <td align="right"><label>Email : </label></td>
                                    <td><input type="email" onChange={(e)=>setEmail(e.target.value)} required/></td>
                                </tr>
                                <tr>
                                    <td align="right"><label>Mot de passe : </label></td>
                                    <td><input type="password" onChange={(e)=>setPassword(e.target.value)} required/></td>
                                </tr>
                            </tbody>
                        </table>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Fermer
                        </Button>
                        <Button variant="primary" onClick={register}>
                            S'inscrire
                        </Button>
                    </Modal.Footer>
                </div>
            </Modal>
        </div>
    )
} 

export default Login