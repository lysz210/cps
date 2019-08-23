import Knex from 'knex'
import { Model } from 'objection'
import configs from './knexconfig'

/**
 * global db connection manager
 */
export const knex = Knex(configs)

/**
 * init objection.Model.knex
 */
Model.knex(knex)

export { Language } from './models/Language'

export { Translation } from './models/Translation'
