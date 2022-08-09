import { HttpException } from '@nestjs/common';
import { env } from 'process';

const authorize = (req, res, next) => {
  if (
    !req.headers.authorization ||
    req.headers.authorization !== env.API_TOKEN
  ) {
    throw new AuthorizationError();
  }
  next();
};

class AuthorizationError extends HttpException {
  constructor() {
    super('Invalid Token', 403);
  }
}

export default authorize;
