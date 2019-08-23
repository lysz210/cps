import { IStatoPratica } from '../my-lib/questura'

export interface IStatoPraticaDisplayable {
  show: boolean
}

export interface IResponseStatoPratica {
  data: {
    statoPratica: IStatoPraticaDisplayable
  }
}
