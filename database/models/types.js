export const TIMESTAMP = {
  type: 'timestamp'
}

export const DELETED_AT = {
  ...TIMESTAMP,
}

export const CREATED_AT = {
  ...TIMESTAMP
}

export const UPDATED_AT = {
  ...TIMESTAMP
}

export const SOFT_DELETE = {
  detelete_at: {
    ...DELETED_AT
  }
}

export const TIMESTAMPS = {
  created_at: {
    ...CREATED_AT
  },
  updated_at: {
    ...UPDATED_AT
  }
}

export const TABLE_TIMESTAMPS = {
  ...TIMESTAMPS,
  ...SOFT_DELETE
}