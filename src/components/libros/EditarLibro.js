import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { Link } from 'react-router-dom';
import Spinner from '../Spinner';
import PropTypes from 'prop-types';

class EditarLibro extends Component {

    tituloInput = React.createRef();
    editoriaInput = React.createRef();
    ISBNInput = React.createRef();
    existenciaInput = React.createRef();


    editarLibro = (e) => {
        e.preventDefault();

        // construir el objeto
        const libroActualizado = {
            titulo: this.tituloInput.current.value,
            editorial: this.editoriaInput.current.value,
            ISBN: this.ISBNInput.current.value,
            existencia: this.existenciaInput.current.value,
        }

        // leer firestore y history

        const {firestore, history, libro} = this.props;

        // actualizar en firestore

        firestore.update({
            collection: 'libros',
            doc: libro.id
        }, libroActualizado).then(history.push('/'))


    }


    render() {

        const { libro } = this.props;

        if (!libro) return <Spinner />

        return (
            <div className="row">
                <div className="col-12 mb-4">
                    <Link to={"/"} className="btn btn-secondary">
                        <i className="fas fa-arrow-circle-left"></i>{''}
                        volver al listado
                    </Link>
                </div>
                <div className="col-12">
                    <i className="fas fa-book"></i>
                    <h2>
                        {''} Editar Libro
                </h2>
                    <div className="row justify-content-center">
                        <div className="col-md-8 mt-5">
                            <form
                                onSubmit={this.editarLibro}
                            >
                                <div className="form-group">
                                    <label>Titulo: </label>
                                    <input type="text"
                                        className="form-control"
                                        name="titulo"
                                        placeholder="Titulo del libro"
                                        required
                                        ref={this.tituloInput}
                                        defaultValue={libro.titulo}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>ISBN: </label>
                                    <input type="text"
                                        className="form-control"
                                        name="ISBN"
                                        placeholder="ISBN"
                                        required
                                        ref={this.ISBNInput}
                                        defaultValue={libro.ISBN}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Editorial: </label>
                                    <input type="text"
                                        className="form-control"
                                        name="editorial"
                                        placeholder="Editorial"
                                        required
                                        ref={this.editoriaInput}
                                        defaultValue={libro.editorial}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Existencia: </label>
                                    <input type="number"
                                        min="0"
                                        className="form-control"
                                        name="existencia"
                                        placeholder="Cantidad de existencias"
                                        required
                                        ref={this.existenciaInput}
                                        defaultValue={libro.existencia}
                                    />
                                </div>
                                <input type="submit"
                                    value="Editar Libro"
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

EditarLibro.propTypes = {
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
    connect(({ firestore: { ordered } }, props) => ({
        libro: ordered.libro && ordered.libro[0]
    }))
)(EditarLibro);


