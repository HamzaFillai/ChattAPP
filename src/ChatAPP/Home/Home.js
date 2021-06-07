import React from 'react'
import "./Home.css"

function Home() {
    return (
        <div className="home">
            <div className="navi">
                <h1>Ça se passe maintenantt</h1>
                <h1>Passez du bon temps, qu’importe l’appareil</h1>
                <h1>Exprimez-vous et Communiquez à votre façon </h1>
                <h1>Rejoignez notre application dès aujourd'hui</h1>
                <h1><button><a href="/login">Connectez-vous !</a></button></h1>
            </div>
        </div>
    )
}

export default Home