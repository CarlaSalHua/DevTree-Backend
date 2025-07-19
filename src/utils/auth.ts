import bcrypt from 'bcrypt'

export const hashPassword = async(password: string) =>{
    //console.log(password)
    const salt = await bcrypt.genSalt(10) // 10 rondas
    return await bcrypt.hash(password, salt)
}

//Funcion para comprobar el password
export const checkPassword = async (enteredPassword: string, hash: string) => {
    return await bcrypt.compare(enteredPassword, hash)
}