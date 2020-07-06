const mongoose = require('mongoose'), Schema = mongoose.Schema;

//Database CLASS model
const studentSchema = mongoose.Schema({
    //ID generated automatically
    _id: mongoose.Schema.Types.ObjectId,
    nombre: {type: String, required: true},
    tipoArtesania: {type: String, required: true},
    fecha: {type: Date, required: true},
    duracion: {type: Number, required: true},
    forma: {type: string, required: true},
    ubicacion: {type: String, required: true},
    cupos: {type: Number, required: true},
    costo: {type: Number, required: true},
    nota: {type: String, required: true},
})

module.exports = mongoose.model('Class', classSchema)