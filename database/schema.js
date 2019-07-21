import Knex from 'knex'
import { Model } from 'objection'
import * as knexconfig from '../knexfile'

export const knex = Knex(knexconfig)

Model.knex(knex)

export { Language } from './models/Language'
