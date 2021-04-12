declare namespace Express {
  interface Request {
    session: import('../core/src/models').Payload;
  }
}