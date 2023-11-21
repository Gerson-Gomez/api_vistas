import { Link } from 'react-router-dom';
function Navbar() {
  return (
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">


        <Link className="navbar-brand" to="/">Inicio</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/artistas">Artistas</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/albums">Albums</Link>
            </li>
          </ul>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;