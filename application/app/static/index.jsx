import React from "react"
import { createRoot } from "react-dom/client"
const navbar = createRoot(document.getElementById("navbar"))

function NavBar(){
    return ( 
        <nav className="navbar">
            <div className="container-fluid align-items-center">
                <span className="navbar-brand" href="#"><img src="../static/BareBonesLogo_White.svg" width="150px"/></span>
                <span className="nav-item" href="#"> <img src="../static/icons/settings.svg"/></span>
            </div>
        </nav>
    )
}

navbar.render(
    <div>
        <NavBar />
    </div>
)