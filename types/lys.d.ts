import { IStatoPratica } from '../my-lib/questura'

export interface IStatoPraticaDisplayable extends IStatoPratica {
  show: boolean
}

export interface IResponseStatoPratica {
  data: {
    statoPratica: IStatoPraticaDisplayable
  }
}
