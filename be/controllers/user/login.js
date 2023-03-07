import { loginSchema } from "be/validators";
import { sign, verify } from "jsonwebtoken";
import { User } from "models";

export const loginController = async (request, response) => {
  const { data } = request.body;
  if (!data) response.status(400).end("login data is missing!");
  loginSchema
    .validate(data)
    .then(async loginData => {
      const { email, password } = loginData;
      let userData = await User.findOne({ email });
      if (!userData) return response.status(400).send("user not found");

      const isPasswordCorrect = password === userData.password;
      if (isPasswordCorrect) {
        const tokenData = {
          name: userData.name,
          email: userData.email,
          userRole: userData.userRole,
          contact: userData.contact,
          itsId: userData.itsId,
          _id: userData._id
        };
        const authToken = sign(
          tokenData,
          process.env.NEXT_PUBLIC_ACCESS_TOKEN_SALT,
          {
            expiresIn: "8h"
          }
        );
        return response.status(200).send({ data: authToken });
      } else {
        return response.status(400).send("invalid credentials");
      }
    })
    .catch(error => {
      return response.status(400).send(error.message);
    });
};

export const verifyUserController = async (request, response) => {
  const { data } = request.body;
  if (!data || data === "")
    return response.status(401).end("token is missing!");
  try {
    const userData = verify(data, process.env.NEXT_PUBLIC_ACCESS_TOKEN_SALT);
    return response.status(200).send(userData);
  } catch (error) {
    return error.name === "TokenExpiredError"
      ? response.status(403).send("user session has expired")
      : response.status(401).send("invalid access token");
  }
};
