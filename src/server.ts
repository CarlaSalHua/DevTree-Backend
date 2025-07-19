//const express = require('express') //CJS Common JS
import express from 'express' // ESM ecmascript modules
import 'dotenv/config'
import router from './router'
import {connectDB} from './config/db'
import cors from 'cors'
import { corsConfig } from './config/cors'

// instancia del servidor
const app = express()

app.use(cors(corsConfig))

connectDB()

//Leer datos del formulario
app.use(express.json()) //queremos habilitar la lectura de datos con el express.json

//app.get('/', router)
app.use('/', router) //cada que hay une petición a la url principal se ejecuta a router

export default app