
import Navbar from "./../Compnent/Navbar/Navbar";

import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <Navbar />

      <div className="container">
        <Outlet />
      </div>

   
    </>
  )
}
