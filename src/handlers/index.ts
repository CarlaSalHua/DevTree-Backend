import {Request, Response} from 'express'
import User from "../models/User"
import { checkPassword, hashPassword } from '../utils/auth'
import slug from 'slug'
import { validationResult } from 'express-validator'
import { generateJWT } from '../utils/jwt'
import { v4 as uuid } from 'uuid'
import cloudinary from '../config/cloudinary'
import formidable from 'formidable'

export const createAccount = async(req: Request, res: Response)=>{
    //Manejar errores
    let errors = validationResult(req)
    if(!errors.isEmpty) {
        return res.status(400).json({errors: errors.array()})
    }

    const {email, password} = req.body
    const userExists = await User.findOne({email}) // findOne es como un where en BD relacionales

    if(userExists){
        return res.status(409).json({ error: 'El usuario ya está registrado.' }); //generar un objeto que tiene el error
        //agregamos un return para detener la ejecición cuando se tiene un if en js
    }

    const handle = slug(req.body.handle, '')
    const handleExists = await User.findOne({handle})
    if(handleExists){
        return res.status(409).json({ error: 'Nombre de usuario no disponible' }); //generar un objeto que tiene el error
        //agregamos un return para detener la ejecición cuando se tiene un if en js
    }

    //Otra forma de agregar datos es instanciando el modelo User
    const user = new User(req.body)
    user.password = await hashPassword(password)
    console.log(slug(handle, ''))

    try {
        await user.save() //Lo que el usuario está enviando en la petición del Postman, ingresa a la BD
        return res.status(201).json({ message: 'Registro creado correctamente' });
    } catch (error: any) {
        if (error.code === 11000) {
      const duplicatedField = Object.keys(error.keyValue)[0];
      return res.status(400).json({ error: `El usuario ya está en uso, cambie su ${duplicatedField}` });
    }

    return res.status(500).json({ error: 'Error del servidor al guardar usuario' });
    }

}

export const login = async(req: Request, res: Response)=>{
    //Manejar errores
    let errors = validationResult(req)
    if(!errors.isEmpty) {
        return res.status(400).json({errors: errors.array()})
    }

    const {email, password} = req.body
    const user = await User.findOne({email}) // findOne es como un where en BD relacionales

    if(!user){
        const error = new Error('El usuario no existe.')
        return res.status(409).json({error: error.message}) //generar un objeto que tiene el error
        //agregamos un return para detener la ejecición cuando se tiene un if en js
    }

    const isPasswordCorrect = await checkPassword(password, user.password) // findOne es como un where en BD relacionales

    if(!isPasswordCorrect){
        const error = new Error('Password incorrecto')
        return res.status(401).json({error: error.message}) //generar un objeto que tiene el error
        //agregamos un return para detener la ejecición cuando se tiene un if en js
    }

    const token = generateJWT({id: user._id})
    res.send(token)
}

export const getUser = async (req: Request, res: Response) => {
    res.json(req.user)
}

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const { description, links } = req.body

        const handle = slug(req.body.handle, '')
        const handleExists = await User.findOne({ handle })
        if (handleExists && handleExists.email !== req.user.email) {
            const error = new Error('Nombre de usuario no disponible')
            return res.status(409).json({ error: error.message })
        }

        // Actualizar el usuario
        req.user.description = description
        req.user.handle = handle
        req.user.links = links
        await req.user.save()
        res.send('Perfil Actualizado Correctamente')

    } catch (e) {
        const error = new Error('Hubo un error')
        return res.status(500).json({ error: error.message })
    }
}

export const uploadImage = async (req: Request, res: Response) => {
    const form = formidable({ multiples: false })
    try {
        form.parse(req, (error, fields, files) => {
            cloudinary.uploader.upload(files.file[0].filepath, { public_id: uuid() }, async function (error, result) {
                if (error) {
                    const error = new Error('Hubo un error al subir la imagen')
                    return res.status(500).json({ error: error.message })
                }
                if (result) {
                    req.user.image = result.secure_url
                    await req.user.save()
                    res.json({ image: result.secure_url })
                }
            })
        })
    } catch (e) {
        const error = new Error('Hubo un error')
        return res.status(500).json({ error: error.message })
    }
}

export const getUserByHandle = async (req: Request, res: Response) => {
    try {
        const { handle } = req.params
        const user = await User.findOne({ handle }).select('-_id -__v -email -password')
        if (!user) {
            const error = new Error('El Usuario no existe')
            return res.status(404).json({ error: error.message })
        }
        res.json(user)
    } catch (e) {
        const error = new Error('Hubo un error')
        return res.status(500).json({ error: error.message })
    }
}

export const searchByHandle = async (req: Request, res: Response) => {
    try {
        const { handle } = req.body
        const userExists = await User.findOne({handle})
        if(userExists) {
            const error = new Error(`${handle} ya está registrado`)
            return res.status(409).json({error: error.message})
        }
        res.send(`${handle} está disponible`)
    } catch (e) {
        const error = new Error('Hubo un error')
        return res.status(500).json({ error: error.message })
    }
}

export const increaseViews = async (req: Request, res: Response) => {
  try {
    const { handle } = req.params;
    const user = await User.findOneAndUpdate(
      { handle },
      { $inc: { views: 1 } },
      { new: true }
    ).select('handle views');

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ message: 'Vista registrada', views: user.views });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar la vista' });
  }
};
