import jwt, { JwtPayload } from "jsonwebtoken"

export const generateJWT = (payload: JwtPayload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '180d'
        //duracion del jwt, 1d=1 dia
    })

    return token

    //payload: informacion que se quiere colocar en el jwt
}