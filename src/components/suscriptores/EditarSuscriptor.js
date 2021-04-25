import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { Link } from 'react-router-dom';
import Spinner from '../Spinner';
import PropTypes from 'prop-types';

class EditarSuscriptor extends Component {

    // Crear los ref
    nombreInput = React.createRef();
    apellidoInput = React.createRef();
    codigoInput = React.createRef();
    carreraInput  = React.createRef();

    // Editar Suscriptor en base de datos
    editarSuscriptor = (e) => {
        e.preventDefault();

        // crear objeto que se va a actualizar

        const suscriptorActualizado = {
            nombres: this.nombreInput.current.value,
            apellidos: this.apellidoInput.current.value,
            codigo: this.codigoInput.current.value,
            carrera: this.carreraInput.current.value,

        }

        // extraer firestore y history de props

        const { suscriptor, firestore, history} = this.props;

        // almacenar en la base de datos con firestore

        firestore.update ({
            collection: 'suscriptores',
            doc: suscriptor.id
        }, suscriptorActualizado).then(history.push('/suscriptores'));

    }

    
    render() {

        const { suscriptor } = this.props;

        if (!suscriptor) return <Spinner />

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
                        {''} Editar Suscriptor
                </h2>
                    <div className="row justify-content-center">
                        <div className="col-md-8 mt-5">
                            <form
                                onSubmit={this.editarSuscriptor}
                            >
                                <div className="form-group">
                                    <label>Nombre: </label>
                                    <input type="text"
                                        className="form-control"
                                        name="nombres"
                                        placeholder="Nombre del suscriptor"
                                        required
                                        ref={this.nombreInput}
                                        defaultValue={suscriptor.nombres}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Apellido: </label>
                                    <input type="text"
                                        className="form-control"
                                        name="apellidos"
                                        placeholder="Apellido del suscriptor"
                                        required
                                        ref={this.apellidoInput}
                                        defaultValue={suscriptor.apellidos}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Carrera: </label>
                                    <input type="text"
                                        className="form-control"
                                        name="carrera"
                                        placeholder="Carrera del suscriptor"
                                        required
                                        ref={this.carreraInput}
                                        defaultValue={suscriptor.carrera}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Código: </label>
                                    <input type="text"
                                        className="form-control"
                                        name="codigo"
                                        placeholder="Código del suscriptor"
                                        required
                                        ref={this.codigoInput}
                                        defaultValue={suscriptor.codigo}
                                    />
                                </div>
                                <input type="submit"
                                    value="Editar Suscriptor"
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

EditarSuscriptor.propTypes = {
    firestore: PropTypes.object.isRequired,
}

export default compose(
    //  StoreAs se pone para que no reescriba el state que esta seteado como suscriptores
    /* El id del usuarios llega como parametro desde la ventana de suscriptores por eso 
    // es posible acceder a el desde los props acá para la consulta */
    firestoreConnect(props => [
        {
            collection: 'suscriptores',
            storeAs: 'suscriptor',
            doc: props.match.params.id
        }
    ]),
    connect(({ firestore: { ordered } }, props) => ({
        suscriptor: ordered.suscriptor && ordered.suscriptor[0]
    }))
)(EditarSuscriptor);