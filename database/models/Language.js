import { Model } from 'objection'
import { TABLE_TIMESTAMPS } from './types'

export class Language extends Model {
  static get tableName() {
    return 'translator_languages'
  }

  static get idColumn() {
    return 'id'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['code', 'name'],

      properties: {
        id: { type: 'integer' },
        code: {
          type: 'string',
          minLength: 2,
          maxLength: 10
        },
        name: {
          type: 'string',
          minLength: 5,
          maxLength: 60
        },
        script: {
          type: 'string',
          maxLength: 10
        },
        native: {
          type: 'string',
          maxLength: 60
        },
        regional: {
          type: 'string',
          maxLength: 10
        },
        ...TABLE_TIMESTAMPS
      }
    }
  }
}
