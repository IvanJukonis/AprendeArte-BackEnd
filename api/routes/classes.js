//Requires
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const Class = require('../models/class')
const checkAuth = require('../middleware/check-auth')

//GET Request
router.get('/', (req, res, next) => {
	Class.find()
		.exec()
		.then(docs => {
			//Create Response
			const response = {
				count: docs.length,
				//Class MAP       
				classes: docs.map(doc => {
					return {
						nombre: doc.nombre,
						tipoArtesania: doc.tipoArtesania,
						fecha: doc.fecha,
						duracion: doc.duracion,
						id: doc._id,
						forma: doc.forma,
						ubicacion: doc.ubicacion,
						cupos: doc.cupos,
						costo: doc.costo,
						nota: doc.nota,
						request: {
							type: 'GET',
							url: 'http://localhost:5000/classes/'
						}
					}
				})
			}
			//Status 200 = Ok
			res.status(200).json(response)
		})
		.catch(err => {
			console.log(err)
			//Status 500 = Database Error
			res.status(500).json({
				error: err
			})
		})
})

//GetByID Request
router.get('/:classId', (req, res, next) => {
	//Take ID from the URL
	const id = req.params.classId
	Class.findById(id)
		//get references from another scheme
		.exec()
		.then(doc => {
			// !!CONDITIONAL NOT WORKING!! FIX NEEDED
			if (doc) {
				console.log(doc)
				res.status(200).json({
					nombre: doc.nombre,
					tipoArtesania: doc.tipoArtesania,
					fecha: doc.fecha,
					duracion: doc.duracion,
					id: doc._id,
					forma: doc.forma,
					ubicacion: doc.ubicacion,
					cupos: doc.cupos,
					costo: doc.costo,
					nota: doc.nota,
					request: {
						type: 'GET',
						url: 'http://localhost:5000/classes/' + id
					}
				})
			} else {
				//Status 404 = Not Found
				res.status(404).json({ message: 'No valid entry found for provided ID' })
			}
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({ error: err })
		})
})

//POST Request
router.post('/', checkAuth, (req, res, next) => {
	//Create Class instance
	const Class = new Class({
		_id: new mongoose.Types.ObjectId(),
		nombre: req.body.nombre,
		tipoArtesania: req.body.tipoArtesania,
		fecha: req.body.fecha,
		duracion: req.body.duracion,
		forma: req.body.forma,
		ubicacion: req.body.ubicacion,
		cupos: req.body.cupos,
		costo: req.body.costo,
		nota: req.body.nota
	})
	//Save on database
	Class.save()
		.then(result => {
			console.log(result)
			//Status 201 = Created
			res.status(201).json({
				message: 'Class created succesfully',
				createdClass: {
					nombre: result.nombre,
					tipoArtesania: result.tipoArtesania,
					fecha: result.fecha,
					duracion: result.duracion,
					id: result._id,
					forma: result.forma,
					ubicacion: result.ubicacion,
					cupos: result.cupos,
					costo: result.costo,
					nota: result.nota,
					request: {
						type: 'POST',
						url: 'http://localhost:5000/classes/'
					}
				}
			})
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err
			})
		})
})

//PATCH Request
router.patch('/:classId', checkAuth, (req, res, next) => {
	const id = req.params.classId
	const updateOps = {}
	for (const ops of req.body) {
		updateOps[ops.propName] = ops.value
	}
	Class.update({ _id: id }, { $set: updateOps })
		.exec()
		.then(result => {
			res.status(200).json({
				message: 'Class updated',
				request: {
					type: 'GET',
					url: 'http://localhost:5000/classes/' + id
				}
			})
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err
			})
		})
})

//DELETE Request
router.delete('/:classId', checkAuth, (req, res, next) => {
	const id = req.params.classId
	//Remove class with id
	Class.remove({ _id: id })
		.exec()
		.then(result => {
			res.status(200).json({
				message: 'Class deleted',
				request: {

				}
			})
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err
			})
		})
})

module.exports = router