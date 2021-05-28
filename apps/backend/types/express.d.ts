type SessionData = import('../src/modules/auth/session').SessionData;

declare namespace Express {
  export interface Request {
    session?: SessionData;
  }
}
