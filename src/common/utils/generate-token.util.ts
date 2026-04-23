import { JwtService } from '@nestjs/jwt';

export interface TokenPayload {
  sub: string; // user id
  email: string; //
  role: string;
}

export interface TokenResponse {
  accessToken: string;
  expiresIn: string;
}

export async function generateAccessToken(
  payload: TokenPayload,
  jwtService: JwtService,
): Promise<TokenResponse> {
  const accessToken = await jwtService.signAsync(payload);
  return {
    accessToken,
    expiresIn: '7d',
  };
}
