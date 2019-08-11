import configs from './knexconfig'
import Knex from 'knex'

export const knex = Knex(configs)
