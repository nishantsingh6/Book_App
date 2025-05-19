import React from "react";
import { NavLink } from "react-router-dom";

const PublicRoute = ({children}) => {
    return (
        <div>
          <nav>
            <div className="flex justify-between items-center bg-gradient-to-bl from-[#f5f7fa] to-[#c3cfe2] p-4">
                <h1 className="font-bold text-2xl text-amber-700 ">Book Hub</h1>
            <ul className="flex gap-4">
                <NavLink to="/book/signup">Sign up</NavLink>
                <NavLink to="/book/login">Login</NavLink>
            </ul>
            </div>
          </nav>

           <main>{children}</main>
        </div>
    )
}

export default PublicRoute;