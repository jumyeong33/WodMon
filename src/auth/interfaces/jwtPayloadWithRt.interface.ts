import { JwtPayload } from './jwtPayload.interface';

export interface JwtPayloadWithRt extends JwtPayload {
  refreshToken: string;
}
