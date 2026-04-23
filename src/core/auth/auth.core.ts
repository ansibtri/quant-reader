import { randomUUID } from 'crypto';

export class Authentication {
  constructor(
    private email?: string | null,
    private password?: string | null,
    private token?: string | null,
  ) {
    this.email = email;
    this.password = password;
  }

  public login() {
    console.log(this.email, this.password);
  }

  public getLoggedInData() {
    console.log({
      email: this.email,
      password: this.password,
      token: this?.token,
    });
  }

  public refreshToken() {
    this.token = randomUUID();
    console.log(this.token);
  }

  public accessToken() {
    this.token = randomUUID();
    console.log(this.token);
  }

  public logout() {
    this.token = null;
    delete this.token;
    delete this.email;
    delete this.password;
    console.log('Logging out!!!!');
  }

  public verifyAccount() {
    console.log('Account is verified!!!');
  }

  public sendOTP() {
    console.log(randomUUID() + 'OTP hudai cha, ekxin hai!!!');
  }

  public blockAccess() {
    console.log('block the user');
  }
}

// Singleton Design Pattern
let authentication: any = null;
export function singletonAuth(
  email: string,
  password: string,
  token: string,
): any {
  if (!authentication) {
    authentication = new Authentication(email, password, token);
    return authentication;
  }
  return authentication;
}
