import {Router} from 'express'
import { createAccount, getUser, getUserByHandle, increaseViews, login, searchByHandle, updateProfile, uploadImage } from './handlers'
import { body } from 'express-validator'
import { handleInputErrors } from './middleware/validation'
import { authenticate } from './middleware/auth'
// ermite configurar un objeto con todas las rutas que despues podemos agregar a la app principal server.ts

const router = Router()

/* Autenticación y Registro*/

router.post('/auth/register', 
    body('handle').notEmpty().withMessage('El handle no puede ir vacio'),
    body('name').notEmpty().withMessage('El handle no puede ir vacio'),
    body('email').isEmail().withMessage('El email no es valido'),
    body('password').isLength({min: 8}).withMessage('El password es muy corto, minimo 8 caracteres.'),
    handleInputErrors,
    createAccount)

router.post('/auth/login', 
    body('email').isEmail().withMessage('El email no es valido'),
    body('password').notEmpty().withMessage('El password es obligatorio'),
    handleInputErrors,
    login
)

router.get('/user', authenticate, getUser)

router.patch('/user',
    body('handle')
        .notEmpty()
        .withMessage('El handle no puede ir vacio'),
    handleInputErrors,
    authenticate,
    updateProfile
)

router.post('/user/image', authenticate, uploadImage)

router.get('/:handle', getUserByHandle)

router.post('/search',
    body('handle')
        .notEmpty()
        .withMessage('El handle no puede ir vacio'),
    handleInputErrors,
    searchByHandle
)

router.post('/:handle/view', increaseViews);

export default router