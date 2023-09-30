import jwt from 'jsonwebtoken';
export function createReponseData(response){
    return {
        status: getHTTPStatusFrom(response.code),
        code: response.code,
        data: response.data,
        metadata: response.metadata
    }
}
export function getHTTPStatusFrom(code){
    let statusText = "error";
    if(code < 300){
        statusText = 'success';
    }else if (code < 400){
        statusText = 'warning';
    }else if (code < 500){
        statusText = 'failure';
    }else if (code < 600){
        statusText = 'error';
    }
    return statusText;
}

export async function generateJWT(paylod){
    return jwt.sign(paylod, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE_IN
    })
}
export default {}