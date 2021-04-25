import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { Link } from 'react-router-dom';
import Spinner from '../Spinner';
import PropTypes from 'prop-types';
import FichaSuscriptor from '../suscriptores/FichaSuscriptor';

// redux actions
import { buscarUsuario } from '../../actions/buscarUsuarioAction';

class PRestamoLibro extends Component {
    state = {
        busqueda: 0,
        noResultados: false
    }

    // Buscar Alumno por código
    buscarAlumno = (e) => {
        e.preventDefault();

        // obtener el valor a buscar
        const { busqueda } = this.state;
        console.log(this.state);
        console.log(busqueda);

        // extraer firestore

        const { firestore, buscarUsuario } = this.props;

        // hacer la consulta
        const coleccion = firestore.collection('suscriptores');

        const consulta = coleccion.where("codigo", "==", parseInt(busqueda)).get();


        // Leer los resultados.
        consulta.then(resultado => {

            if (resultado.empty) {
                console.log('resultado empty');
                // almacenar en redux resultado vacio
                buscarUsuario({});
                this.setState({
                    noResultados: true
                });

            } else {
                console.log('resultado data');

                const datos = resultado.docs[0];
                buscarUsuario(datos.data());
                this.setState({
                    noResultados: false
                });
                console.log(datos);
            }
        })
    }

    // almacena los datos del alumno para solicitar el libro
    solicitarPrestamo = () => {

        const { usuario } = this.props;

        // fecha de alta
        usuario.fecha_solicitud = new Date().toLocaleDateString();

        let prestados = [];
        prestados = [...this.props.libro.prestados, usuario];


        // copiar el objeto y agregar los prestados
        const libro = { ...this.props.libro };

        // Eliminar los prestados anteriores eliminar las propiedades de un objeto se hace asi:
        // Esto se hace porque los prestados totales enstan en la variable prestados
        // entonces se borran para ponerlos todos completos
        delete libro.prestados;

        // Assignar los prestados

        libro.prestados = prestados;


        // obtener firestore y history de props
        const { firestore, history } = this.props;

        // almacenar en la DB

        firestore.update({
            collection: 'libros',
            doc: libro.id
        }, libro).then(history.push('/'));
    };

    // almacenar el código en el state
    leerDato = e => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    render() {

        //  extraer el libro

        const { libro } = this.props;

        if (!libro) return <Spinner />


        // extraer datos del alumno

        const { usuario } = this.props;

        let fichaAlumno, btnSolicitar;

        if (usuario.nombres) {
            fichaAlumno = <FichaSuscriptor alumno={usuario} />
            btnSolicitar = <button
                type="button"
                className="btn btn-primary btn-block"
                onClick={this.solicitarPrestamo}
            >Solicitar Prestamo</button>

        } else {
            fichaAlumno = null;
            btnSolicitar = null;
        }

        // Mostrar mensaje de error
        const { noResultados } = this.state;

        let mensajeResultado = '';
        if (noResultados) {
            mensajeResultado = <div className="alert alert-danger text-center font-weight-blod">No hay resultados para ese código</div>
        } else {
            mensajeResultado = null;
        }


        return (
            <div className="row">
                <div className="col-12 mb-4">
                    <Link to={"/"} className="btn btn-secondary">
                        <i className="fas fa-arrow-circle-left"></i>{''}
                        volver al listado
                    </Link>
                </div>
                <div className="col-12">
                    <h2>
                        <i className="fas fa-book"></i>
                        {''} Solicitar Libro: {libro.titulo}
                    </h2>

                    <div className="row justify-content-center mt-5">
                        <div className="col-md-8">
                            <form onSubmit={this.buscarAlumno} className="mb-4">
                                <legend className="color-primary text-center">
                                    Busca el Suscriptor por código
                                </legend>
                                <div className="form-group">
                                    <input type="text"
                                        name="busqueda"
                                        className="form-control"
                                        onChange={this.leerDato}
                                    />
                                </div>
                                <input type="submit" className="btn btn-success btn-block" value="Buscar Alumno" />
                            </form>

                            {/* Muestra la ficha del alumno y btn prestamo */}

                            {fichaAlumno}
                            {btnSolicitar}
                            {/* Mensaje de no resultados */}
                            {mensajeResultado}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


PRestamoLibro.propTypes = {
    firestore: PropTypes.object.isRequired,
}

export default compose(
    //  StoreAs se pone para que no reescriba el state que esta seteado como suscriptores
    /* El id del usuarios llega como parametro desde la ventana de suscriptores por eso 
    // es posible acceder a el desde los props acá para la consulta */
    firestoreConnect(props => [
        {
            collection: 'libros',
            storeAs: 'libro',
            doc: props.match.params.id
        }
    ]),
    connect(({ firestore: { ordered }, usuario }, props) => ({
        libro: ordered.libro && ordered.libro[0],
        usuario: usuario
    }), { buscarUsuario })
)(PRestamoLibro);