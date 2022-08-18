import { MethodNotAllowedException } from '@nestjs/common';

/* eslint-disable prefer-const */
export class UUID {
  private uuid: string;
  constructor(str: string) {
    this.uuid = str;
  }

  public static New(): UUID {
    return new UUID(this.generateAt());
  }
  public static Valid(str: string): boolean {
    return (
      str.match(
        /^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$/,
      ) !== null
    );
  }
  public static FromStr(uuid: string): UUID {
    if (!UUID.Valid(uuid)) {
      throw new MethodNotAllowedException(`Invalid UUID : ${uuid}`);
    }
    return new UUID(uuid);
  }
  public String() {
    return this.uuid;
  }

  private static generateAt() {
    let dt = new Date().getTime();
    const createdUUID = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        const r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
      },
    );
    return createdUUID;
  }
}
