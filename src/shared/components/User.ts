export class User {
  private name: string;
  private secret: string;

  constructor(name: string, secret: string) {
    this.name = name;
    this.secret = secret;
  }

  getName(): string {
    return this.name;
  }

  getSecret(): string {
    return this.secret;
  }
}
