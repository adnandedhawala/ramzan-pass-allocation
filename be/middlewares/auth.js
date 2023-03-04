import { verify } from "jsonwebtoken";

export const checkAuth = async (request, response, next) => {
  const { authorization } = request.headers;
  if (!authorization) return response.status(401).send("user not authorized");
  try {
    const tokenData = verify(
      authorization,
      process.env.NEXT_PUBLIC_ACCESS_TOKEN_SALT
    );
    request.userData = tokenData;
    return next();
  } catch (error) {
    return error.name === "TokenExpiredError"
      ? response.status(403).send("user session has expired")
      : response.status(401).send("invalid access token");
  }
};
