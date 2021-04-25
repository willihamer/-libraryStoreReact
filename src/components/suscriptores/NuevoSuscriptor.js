import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';
import PropTypes from 'prop-types';

class NuevoSuscriptor extends Component {
    state = {
        nombres: '',
        apellidos: '',
        carrera: '',
        codigo: ''
    }

    // extraer valores inputs

    leerDato = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    };

    // Agregar suscriptor a la base de datos
    agregarSuscriptor = (e) => {
        e.preventDefault();
        // extraer valores state
        const nuevoSuscriptor = { ...this.state };

        // extraer firestore del state
        const { firestore, history } = this.props;

        // Guardar en la DB
        firestore.add(
            { collection: 'suscriptores' },
            nuevoSuscriptor
        ).then(() => history.push('/suscriptores'))
    };

    render() {
        return (
            <div className="row">
                <div className="col-12 mb-4">
                    <Link to={"/suscriptores"} className="btn btn-secondary">
                        <i className="fas fa-arrow-circle-left"></i>{''}
                        volver al listado
                    </Link>
                </div>
                <div className="col-12">
                    <h2>
                        <i className="fas fa-user-plus"></i> {''} Nuevo Suscriptor
                    </h2>
                    <div className="row justify-content-center">
                        <div className="col-md-8 mt-5">
                            <form
                                onSubmit={this.agregarSuscriptor}
                            >
                                <div className="form-group">
                                    <label>Nombre: </label>
                                    <input type="text"
                                        className="form-control"
                                        name="nombres"
                                        placeholder="Nombre del suscriptor"
                                        required
                                        onChange={this.leerDato}
                                        value={this.state.nombres}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Apellido: </label>
                                    <input type="text"
                                        className="form-control"
                                        name="apellidos"
                                        placeholder="Apellido del suscriptor"
                                        required
                                        onChange={this.leerDato}
                                        value={this.state.apellidos}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Carrera: </label>
                                    <input type="text"
                                        className="form-control"
                                        name="carrera"
                                        placeholder="Carrera del suscriptor"
                                        required
                                        onChange={this.leerDato}
                                        value={this.state.carrera}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Código: </label>
                                    <input type="text"
                                        className="form-control"
                                        name="codigo"
                                        placeholder="Código del suscriptor"
                                        required
                                        onChange={this.leerDato}
                                        value={this.state.codigo}
                                    />
                                </div>
                                <input type="submit"
                                    value="Agregar Suscriptor"
                                    className="btn btn-success"
                                />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

NuevoSuscriptor.propTypes = {
    firestore: PropTypes.object.isRequired,
}


export default firestoreConnect()(NuevoSuscriptor);