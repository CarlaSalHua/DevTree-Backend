import mongoose, {Schema} from 'mongoose'

export interface IUser {
    handle: string
    name: string
    email: string
    password: string
    description: string
    image: string
    links: string
    views: number
}

const userSchema = new Schema ({
    //Atributos
    handle:{
        type: String,
        required: true,
        trim: true,
        lowerCase: true,
        unique: true
    },
    name:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowerCase: true
    },
    password:{
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    links: {
        type: String,
        default: '[]'
    },
    views: {
        type: Number,
        default: 0,
    }
})

//creamos el modelo
const UserModel = mongoose.model<IUser>('User', userSchema)
export default UserModel