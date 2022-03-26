import { SixShopServiceType } from '../constant/six-shop-service-type';

export interface Payload {
  iss: string;
  sub: string;
  iat: number;
  exp: number;
  aud: string;
  scope?: SixShopServiceType;
  scopes?: [SixShopServiceType];
}
