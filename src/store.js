import { createStore, combineReducers, compose } from 'redux';
import { reactReduxFirebase, firebaseReducer } from 'react-redux-firebase';
import { reduxFirestore, firestoreReducer } from 'redux-firestore';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

// CUSTOM REDUCERS
import buscarUsuarioReduer from './reducers/buscarUsuarioReducer';


//configurar firestore
var firebaseConfig = {
    // TODO: put your firebase code here
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();


// Configuracion react redux

const rrfConfig = {
    useProfile: 'users',
    useFirestoreForProfile: true
}

// Crear el enhacer con compose de redux y firestore

const createStoreWithFirebase = compose(
    reactReduxFirebase(firebase, rrfConfig),
    reduxFirestore(firebase)
)(createStore);


// Reducers

const rootReducer = combineReducers({
    firebase: firebaseReducer,
    firestore: firestoreReducer,
    usuario: buscarUsuarioReduer
});

// Initial State

const InitialState = {};

//  Create the store

const store = createStoreWithFirebase(rootReducer, InitialState, compose(
    reactReduxFirebase(firebase),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
));

export default store;