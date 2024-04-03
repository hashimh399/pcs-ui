import React, { useState, useEffect } from "react";
import '../utils/pcs.css';
import th from '../utils/th.png'

export default function Header({name}) {
  return (
    <>
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
  <div className="container-fluid">
  <a className="navbar-brand" href="#">
      <img src={th} alt="Consilium PCS Logo" id="navbar-logo" />
    </a>
    <a className="navbar-brand" href="#">Consilium PCS</a>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarText">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <a className="nav-link active" aria-current="page" href="#">Dashboard</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">Results</a>
        </li>
        {/* <li className="nav-item">
          <a className="nav-link" href="#">Pricing</a>
        </li> */}
      </ul>
      <span className="navbar-text">
       Welcome {name}
      </span>
    </div>
  </div>
</nav>
    </>
  )
}
