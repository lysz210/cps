import Knex from 'knex'
import * as knexconfig from '../knexfile'
import { Model } from 'objection'

export const knex = Knex(knexconfig)

Model.knex(knex)

export { Language } from './models/Language'
