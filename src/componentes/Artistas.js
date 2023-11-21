import React, { Component } from 'react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const url = "http://127.0.0.1:8000/api/artistas/";

class Artistas extends Component {
    state = {
        data: [],
        modalInsertar: false,
        modalEditar: false,
        modalEliminar: false,
        form: {
            id: '',
            nombre: '',
            tipoModal: '',
        },
        artistaSeleccionado: null,
    }

    componentDidMount() {
        this.peticionGet();
    }

    peticionGet = () => {
        axios.get(url).then(response => {
            this.setState({ data: response.data });
        }).catch(error => {
            console.log(error.message);
        });
    }

    peticionPost = async () => {
        delete this.state.form.id;
        await axios.post(url, this.state.form).then(response => {
            this.modalInsertar();
            this.peticionGet();
        }).catch(error => {
            console.log(error.message);
        });
    }

    peticionPut = () => {
        axios.put(url + this.state.form.id, this.state.form).then(response => {
            this.modalInsertar();
            this.peticionGet();
        });
    }

    peticionDelete = () => {
        axios.delete(url + this.state.form.id).then(response => {
            this.setState({ modalEliminar: false });
            this.peticionGet();
        });
    }

    modalInsertar = () => {
        this.setState({ modalInsertar: !this.state.modalInsertar });
    }

    seleccionarArtista = (artista) => {
        this.setState({
            tipoModal: 'actualizar',
            form: {
                id: artista.id,
                nombre: artista.nombre,
            }
        });
    }

    modalEditar = () => {
        this.setState({ modalEditar: !this.state.modalEditar });
    }

    seleccionarArtistaParaEditar = (artista) => {
        this.setState({
            tipoModal: 'actualizar',
            artistaSeleccionado: artista,
        });
        this.modalEditar();
    }

    guardarEdicion = () => {
        axios.put(url + this.state.artistaSeleccionado.id, this.state.artistaSeleccionado)
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
            artistaSeleccionado: {
                ...this.state.artistaSeleccionado,
                [e.target.name]: e.target.value
            },
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        });
        console.log(this.state.artistaSeleccionado);
    }

    render() {
        const { form, artistaSeleccionado } = this.state;
        const styles = {
            backgroundColor: '#F8C471',
            padding: '20px',
        };

        return (
            
            <div style={styles}>
                <div class="container" >
                <div class="row">
                        <div className='col-6'>
                         <h4>Registrar Artistas.</h4>
                        </div>
                        <div className='col-6'>
                            <button className="btn btn-success" onClick={() => { this.setState({ form: null, tipoModal: 'insertar' }); this.modalInsertar(); }}>
                                 Agregar Artista
                            </button>
                        </div>
                </div>
                <hr></hr>
                <table className="table mt-3">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>

                        {this.state.data.map(artista => {
                            return (
                                <tr key={artista.id}>
                                    <td>{artista.id}</td>
                                    <td>{artista.nombre}</td>
                                    <td>
                                        <button className="btn btn-primary" onClick={() => this.seleccionarArtistaParaEditar(artista)}><FontAwesomeIcon icon={faEdit} /></button>
                                        {"   "}
                                        <button className="btn btn-danger" onClick={() => { this.seleccionarArtista(artista); this.setState({ modalEliminar: true }) }}><FontAwesomeIcon icon={faTrashAlt} /></button>
                                    </td>
                                </tr>
                            )
                        })}


                    </tbody>
                </table>
                <Modal isOpen={this.state.modalEditar}>
                    <ModalHeader style={{ display: 'block' }}>
                        Editar El nombre de artista
                        <span style={{ float: 'right' }} onClick={this.modalEditar}>x</span>
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label htmlFor="id">ID</label>
                            <input className="form-control" type="text" name="id" id="id" readOnly value={artistaSeleccionado ? artistaSeleccionado.id : ''} />
                            <br />
                            <label htmlFor="nombre">Nombre</label>
                            <input className="form-control" type="text" name="nombre" onChange={this.handleChange} value={artistaSeleccionado ? artistaSeleccionado.nombre : ''} />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-primary" onClick={this.guardarEdicion}>Guardar Cambios</button>
                        <button className="btn btn-danger" onClick={this.modalEditar}>Cancelar</button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.modalInsertar}>
                    <ModalHeader style={{ display: 'block' }}>
                        Registrar nuevo artista
                        <span style={{ float: 'right' }} onClick={() => this.modalInsertar()}>x</span>
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label htmlFor="id">ID</label>
                            <input className="form-control" type="text" name="id" id="id" readOnly onChange={this.handleChange} value={form ? form.id : this.state.data.length + 1} />
                            <br />
                            <label htmlFor="nombre">Nombre</label>
                            <input className="form-control" type="text" name="nombre" onChange={this.handleChange} value={form ? form.nombre : ''} />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        {this.state.tipoModal === 'insertar' ? (
                            <button className="btn btn-success" onClick={() => this.peticionPost()}>
                                Insertar
                            </button>
                        ) : (
                            <button className="btn btn-primary" onClick={() => this.peticionPut()}>
                                Actualizar
                            </button>
                        )}
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

export default Artistas;