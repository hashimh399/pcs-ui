import "../utils/pcs.css";
import { TfiReload } from "react-icons/tfi";
import th from "../utils/th.png";
import { useWebSocket } from "../utils/websocket";
import { useEffect } from "react";

export default function Header({ name, button }) {
  const { isConnected } = useWebSocket();
  useEffect(() => {
    if (isConnected) {
      setInterval(() => {
        button();
      }, 1000 * 60);
    }
  }, [isConnected]);

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a className="navbar-brand" href="#">
            <img src={th} alt="Consilium PCS Logo" id="navbar-logo" />
          </a>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a className="navbar-brand" href="#">
            Consilium PCS
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarText"
            aria-controls="navbarText"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarText">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a className="nav-link active" aria-current="page" href="#">
                  Dashboard
                </a>
              </li>
              <li className="nav-item">
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a className="nav-link" href="#">
                  Results
                </a>
              </li>
              {/* <li className="nav-item">
          <a className="nav-link" href="#">Pricing</a>
        </li> */}
            </ul>
            <span className="navbar-text">Welcome {name}</span>
            <span className="mx-3">
              <button
                onClick={() => {
                  button();
                }}
              >
                <TfiReload />
              </button>
            </span>
          </div>
        </div>
      </nav>
    </>
  );
}
