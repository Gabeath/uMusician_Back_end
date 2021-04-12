import jwt from 'jsonwebtoken';

export type Payload = {
  userID: string,
  profileType: Number
}

export const generateJWT = (payload : Payload) => {
  return jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "30d"
  });
}

export const verifyToken = (token : string) => {
  return jwt.verify(token, process.env.SECRET_KEY);
}

