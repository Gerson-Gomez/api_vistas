import Select from 'react-select';
import React, { Component } from 'react';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
//import TablaDatos from './TablaDatos';

const url = "http://127.0.0.1:8000/api/comentarios/";

class Comentarios extends Component {
  state = {
    data: [],
    modalInsertar: false,
    modalEditar: false,
    modalEliminar: false,
    artistas: [], // Datos de artistas
    albums: [], // Datos de álbums
    form: {
      id: '',
      comentario: '',
      id_album: '',
      id_artista: '',
      tipoModal: '',
    },
    comentarioSeleccionado: null,
    artistasOptions: [], // Nuevos campos  //chat
    albumsOptions: [], // Nuevos campos  //chat
    albumsByArtistModal: [],
  }
//llamar los datos
  peticionGet = () => {
    axios.get(url).then(response => {
      this.setState({ data: response.data });
    }).catch(error => {
      console.log(error.message);
    })
  }

//llamar por id
  peticionPost = async () => {
    delete this.state.form.id;
    await axios.post(url, this.state.form).then(response => {
      this.modalInsertar();
      this.peticionGet();
    }).catch(error => {
      console.log(error.message);
    })
  }
//actualizar
  peticionPut = () => {
    axios.put(url + this.state.form.id, this.state.form).then(response => {
      this.modalInsertar();
      this.peticionGet();
    })
  }
//ya sabe
  peticionDelete = () => {
    axios.delete(url + this.state.form.id).then(response => {
      this.setState({ modalEliminar: false });
      this.peticionGet();
    })
  }

  modalInsertar = () => {
    this.setState({
      modalInsertar: !this.state.modalInsertar,
      form: {
        id: '',
        comentario: '',
        id_album: '',
        id_artista: '',
        tipoModal: '',
      },
    });
  };
  

  seleccionarComentario = (comentario) => {
    this.setState({
      tipoModal: 'actualizar',
      form: {
        id: comentario.id,
        comentario: comentario.comentario,
        id_album: comentario.id_album,
        id_artista: comentario.id_artista
      }
    })
  }

  modalEditar = () => {
    this.setState({ modalEditar: !this.state.modalEditar });
  }
//  carga losd atos
  seleccionarComentarioParaEditar = (comentario) => {
    this.setState({
      tipoModal: 'actualizar',
      comentarioSeleccionado: comentario,
    });
    this.modalEditar();
  }
    //guarda losc cambios hechos en los modales
  guardarEdicion = () => {
    axios.put(url + this.state.comentarioSeleccionado.id, this.state.comentarioSeleccionado)
      .then(response => {
        this.modalEditar();
        this.peticionGet();
      })
      .catch(error => {
        console.log(error.message);
      });
  }

handleChange = async (e) => {
  e.persist();
  await this.setState({
      comentarioSeleccionado: {
          ...this.state.comentarioSeleccionado,
          [e.target.name]: e.target.value
      },
      form: {
          ...this.state.form,
          [e.target.name]: e.target.value
      }
  });

  if (e.target.name === "id_artista") {
      // Filtrar los álbumes por el artista seleccionado
      const albumsByArtistModal = this.state.albums.filter(album => album.id_artista === this.state.form.id_artista);
      this.setState({ albumsByArtistModal });
  }
};

  cargarDatosArtistas = () => {
    axios.get("http://127.0.0.1:8000/api/artistas")
      .then(response => {
        const artistasOptions = response.data.map(artista => ({
          value: artista.id,
          label: artista.nombre,
        }));
        this.setState({ artistas: response.data, artistasOptions });
      })
      .catch(error => {
        console.log(error.message);
      });
  };
  
  cargarDatosAlbums = () => {
    axios.get("http://127.0.0.1:8000/api/albums")
        .then(response => {
            const albumsOptions = response.data.map(album => ({
                value: album.id,
                label: album.nombre_album,
            }));
            this.setState({ albums: response.data, albumsOptions });
        })
        .catch(error => {
            console.log(error.message);
        });
};
  componentDidMount() {
    this.peticionGet();
    this.cargarDatosArtistas();
    this.cargarDatosAlbums();
  }

  render() {
    const { form, comentarioSeleccionado } = this.state;
    const styles = {
      backgroundColor: '#F8C471',
      padding: '20px',
    };

    return (
      <div style={styles} >    
      <div class="container" >
        <div class="row">
          <div className='col-6'>
            <h4>Asignar Comentario</h4>
          </div>

          <div className='col-6'>
            <button className="btn btn-success" onClick={() => { this.setState({ form: null, tipoModal: 'insertar' }); this.modalInsertar() }}>Agregar Comentario
            </button>
          </div>
        </div>  

        <hr></hr>
        <table className="table mt-3">
          <thead>
            <tr>
              <th>comentarios</th>
              <th>Album</th>
              <th>Artista</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map(comentario => {
              return (
                <tr key={comentario.id}>
                  <td>{comentario.comentario}</td>
                  <td>{comentario.album.nombre_album}</td>
                  <td>{comentario.artista.nombre}</td>
                  <td>
                    <button className="btn btn-primary" onClick={() => this.seleccionarComentarioParaEditar(comentario)}><FontAwesomeIcon icon={faEdit} /></button>
                    {"   "}
                    <button className="btn btn-danger" onClick={() => { this.seleccionarComentario(comentario); this.setState({ modalEliminar: true }) }}><FontAwesomeIcon icon={faTrashAlt} /></button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        <Modal isOpen={this.state.modalEditar}>
          <ModalHeader style={{ display: 'block' }}>
            Editar Comentario.
            <span style={{ float: 'right' }} onClick={this.modalEditar}>x</span>
          </ModalHeader>
          <ModalBody>
            <div className="form-group">              
              <label htmlFor="comentario">Comentario</label>
              <input className="form-control" type="text" name="comentario" onChange={this.handleChange} value={comentarioSeleccionado ? comentarioSeleccionado.comentario : ''} />
            </div>
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-primary" onClick={this.guardarEdicion}>Guardar Cambios</button>
            <button className="btn btn-danger" onClick={this.modalEditar}>Cancelar</button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modalInsertar}>
          <ModalHeader style={{ display: 'block' }}>
            Registrar Comentario.
            <span style={{ float: 'right' }} onClick={() => this.modalInsertar()}>x</span>
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              
              <label htmlFor="id_artista">Artista</label>

              <Select
                options={this.state.artistasOptions}
                onChange={(selectedOption) => this.setState({ form: { ...this.state.form, id_artista: selectedOption.value } })}
                value={this.state.artistasOptions.find(option => option.value === this.state.form.id_artista)}
              />
              <br />
              <label htmlFor="id_album">Álbum</label>
              <Select
                options={this.state.albumsOptions}
                onChange={(selectedOption) => this.setState({ form: { ...this.state.form, id_album: selectedOption.value } })}
                value={this.state.albumsOptions.find(option => option.value === this.state.form.id_album)}
              />
             <br />

              <label htmlFor="comentario">Comentario</label>
              <input className="form-control" type="text" name="comentario" id="comentario" onChange={this.handleChange} value={form ? form.comentario : ''} />
            </div>
          </ModalBody>

          <ModalFooter>
            {this.state.tipoModal === 'insertar' ?
              <button className="btn btn-success" onClick={() => this.peticionPost()}>
                Insertar
              </button> : <button className="btn btn-primary" onClick={() => this.peticionPut()}>
                Actualizar
              </button>
            }
            <button className="btn btn-danger" onClick={() => this.modalInsertar()}>Cancelar</button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modalEliminar}>
          <ModalBody>
            ¿Estás seguro que deseas eliminar el comentario?
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-danger" onClick={() => this.peticionDelete()}>Sí</button>
            <button className="btn btn-secundary" onClick={() => this.setState({ modalEliminar: false })}>No</button>
          </ModalFooter>
        </Modal>
        </div>
      </div>
    );
  }
}

export default Comentarios;