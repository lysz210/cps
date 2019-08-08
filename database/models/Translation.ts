import { Model } from 'objection'
import { TABLE_TIMESTAMPS } from './types'
import { Language } from './Language'

export const TABLE_NAME = 'translator_translations'
export class Translation extends Model {
  static get tableName() {
    return TABLE_NAME
  }

  static get idColumn() {
    return 'id'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: [],
      properties: {
        id: { type: 'integer' },
        locale: {
          type: 'string',
          minLength: 2,
          maxLength: 10
        },
        namespace: {
          type: 'string',
          maxLength: 150
        },
        group: {
          type: 'string',
          maxLength: 150
        },
        item: {
          type: 'string',
          maxLength: 150
        },
        text: {
          type: 'string'
        },
        unstable: {
          type: 'boolean'
        },
        locked: {
          type: 'boolean'
        },
        ...TABLE_TIMESTAMPS
      }
    }
  }

  static get relationsMappings() {
    return {
      owner: {
        relation: Model.BelongsToOneRelation,
        modelClass: Location,
        join: {
          from: `${Translation.tableName}.locale`,
          to: `${Language.tableName}.code`
        }
      }
    }
  }
}