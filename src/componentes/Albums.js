import React, { Component } from 'react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import Select from 'react-select';
import DatePicker from "react-datepicker";
import { format } from 'date-fns';
import "react-datepicker/dist/react-datepicker.css";

const url = "http://127.0.0.1:8000/api/albums/";

class Albums extends Component {
    state = {
        data: [],
        modalInsertar: false,
        modalEditar: false,
        modalEliminar: false,
        artistas: [],
        form: {
            id: '',
            nombre_album: '',
            lanzamiento: new Date(), // Inicializar con la fecha actual
            id_artista: '',
            tipoModal: '',
        },
        albumSeleccionado: null,
        artistasOptions: [],
    }

    componentDidMount() {
        this.peticionGet();
        this.cargarDatosArtistas();
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

        // Formatear la fecha antes de enviarla al servidor
        const formattedDate = format(this.state.form.lanzamiento, 'yyyy-MM-dd');

        await axios.post(url, { ...this.state.form, lanzamiento: formattedDate }).then(response => {
            this.modalInsertar();
            this.peticionGet();
        }).catch(error => {
            console.log(error.message);
        });
    }

    peticionPut = () => {
        // Formatear la fecha antes de enviarla al servidor
        const formattedDate = format(this.state.form.lanzamiento, 'yyyy-MM-dd');

        axios.put(url + this.state.form.id, { ...this.state.form, lanzamiento: formattedDate }).then(response => {
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

    seleccionarAlbum = (album) => {
        this.setState({
            tipoModal: 'actualizar',
            form: {
                id: album.id,
                nombre_album: album.nombre_album,
                lanzamiento: new Date(album.lanzamiento), // Convertir la fecha a objeto Date
                id_artista: album.id_artista,
            }
        });
    }

    modalEditar = () => {
        this.setState({ modalEditar: !this.state.modalEditar });
    }

    seleccionarAlbumParaEditar = (album) => {
        this.setState({
            tipoModal: 'actualizar',
            albumSeleccionado: album,
        });
        this.modalEditar();
    }

    guardarEdicion = () => {
        axios.put(url + this.state.albumSeleccionado.id, this.state.albumSeleccionado)
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
            albumSeleccionado: {
                ...this.state.albumSeleccionado,
                [e.target.name]: e.target.value
            },
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        });
        console.log(this.state.albumSeleccionado);
    }

    handleDateChange = (date) => {
        this.setState({
            form: {
                ...this.state.form,
                lanzamiento: date
            }
        });
    }

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
    }

    render() {
        const { form, albumSeleccionado } = this.state;
        const styles = {
            backgroundColor: '#F8C471',
            padding: '20px',
        };

        return (
            <div style={styles}>
                <div class="container">
                    <div class="row">
                        <div className='col-6'>
                            <h4>Registrar Álbumes.</h4>
                        </div>
                        <div className='col-6'>
                            <button className="btn btn-success" onClick={() => { this.setState({ form: null, tipoModal: 'insertar' }); this.modalInsertar(); }}>
                                Agregar Álbum
                            </button>
                        </div>
                    </div>

                    <hr></hr>
                    <table class="table table-striped ">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre del Álbum</th>
                                <th>Lanzamiento</th>
                                <th>Artista</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.data.map(album => {
                                return (
                                    <tr key={album.id}>
                                        <td>{album.id}</td>
                                        <td>{album.nombre_album}</td>
                                        <td>{album.lanzamiento}</td>
                                        <td>{album.artista.nombre}</td>

                                        <td>
                                            <button className="btn btn-primary" onClick={() => this.seleccionarAlbumParaEditar(album)}><FontAwesomeIcon icon={faEdit} /></button>
                                            {"   "}
                                            <button className="btn btn-danger" onClick={() => { this.seleccionarAlbum(album); this.setState({ modalEliminar: true }) }}><FontAwesomeIcon icon={faTrashAlt} /></button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>

                    <Modal isOpen={this.state.modalEditar}>
                        <ModalHeader style={{ display: 'block' }}>
                            Editar album
                            <span style={{ float: 'right' }} onClick={this.modalEditar}>x</span>
                        </ModalHeader>
                        <ModalBody>
                            <div className="form-group">
                                <label htmlFor="id">ID</label>
                                <input className="form-control" type="text" name="id" id="id" readOnly value={albumSeleccionado ? albumSeleccionado.id : ''} />
                                <br />
                                <label htmlFor="nombre_album">Nombre del Álbum</label>
                                <input className="form-control" type="text" name="nombre_album" onChange={this.handleChange} value={albumSeleccionado ? albumSeleccionado.nombre_album : ''} />
                                <br/>
                                

                                <label htmlFor="id_artista">Artista</label>
                               
                                <Select
                                    options={this.state.artistasOptions}
                                    onChange={(selectedOption) => this.setState({ albumSeleccionado: { ...this.state.albumSeleccionado, id_artista: selectedOption.value } })}
                                    value={this.state.artistasOptions.find(option => option.value === (this.state.albumSeleccionado ? this.state.albumSeleccionado.id_artista : ''))}
                                /> <br />

                                <label htmlFor="lanzamiento">Lanzamiento ㅤㅤ</label>
                                <DatePicker
                                    selected={form ? form.lanzamiento : new Date()} // La fecha seleccionada
                                    onChange={this.handleDateChange} // Función para manejar cambios en la fecha
                                />
                            
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <button className="btn btn-primary" onClick={this.guardarEdicion}>Guardar Cambios</button>
                            <button className="btn btn-danger" onClick={this.modalEditar}>Cancelar</button>
                        </ModalFooter>
                    </Modal>

                    <Modal isOpen={this.state.modalInsertar}>
                        <ModalHeader style={{ display: 'block' }}>
                            Registrar nuevo album
                            <span style={{ float: 'right' }} onClick={() => this.modalInsertar()}>x</span>
                        </ModalHeader>
                        <ModalBody>
                            <div className="form-group">
                                <label htmlFor="id">ID</label>
                                <input className="form-control" type="text" name="id" id="id" readOnly onChange={this.handleChange} value={form ? form.id : this.state.data.length + 1} />
                                <br />
                                <label htmlFor="nombre_album">Nombre del Álbum</label>
                                <input className="form-control" type="text" name="nombre_album" onChange={this.handleChange} value={form ? form.nombre_album : ''} />
                                <br />
                                <label htmlFor="id_artista">Artista</label>
                                <Select
                                    options={this.state.artistasOptions}
                                    onChange={(selectedOption) => this.setState({ form: { ...this.state.form, id_artista: selectedOption.value } })}
                                    value={this.state.artistasOptions.find(option => option.value === (this.state.form ? this.state.form.id_artista : ''))}
                                />
                                  <br />
                                <label htmlFor="lanzamiento">Lanzamiento ㅤㅤ</label>
                                <DatePicker
                                    selected={form ? form.lanzamiento : new Date()} // La fecha seleccionada
                                    onChange={this.handleDateChange} // Función para manejar cambios en la fecha
                                />
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
                            ¿Estás seguro que deseas eliminar el álbum?
                        </ModalBody>
                        <ModalFooter>
                            <button className="btn btn-danger" onClick={() => this.peticionDelete()}>Sí</button>
                            <button className="btn btn-secondary" onClick={() => this.setState({ modalEliminar: false })}>No</button>
                        </ModalFooter>
                    </Modal>

                </div>
            </div>
        );
    }
}

export default Albums;
