import { Model } from 'objection'
import { TABLE_TIMESTAMPS } from './types'

export const TABLE_NAME = 'translator_languages'

export interface LanguageInterface {
  id?: number;
  code?: string;
  name?: string;
  script?: string;
  native?: string;
  regional?: string;
}

export class Language extends Model implements LanguageInterface {
  id?: number;

  code?: string;

  name?: string;

  script?: string;

  native?: string;

  regional?: string;

  static get tableName () {
    return TABLE_NAME
  }

  static get idColumn () {
    return 'id'
  }

  static get jsonSchema () {
    return {
      type: 'object',
      required: ['code', 'name'],

      properties: {
        id: { type: 'integer' },
        code: {
          type: 'string',
          minLength: 2,
          maxLength: 11
        },
        name: {
          type: 'string',
          minLength: 2,
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
