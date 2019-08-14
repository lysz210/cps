export interface SoftDeleteInterface {
  deleted_at?: Date;
}

export interface TimestampsInterface {
  created_at?: Date;
  updated_at?: Date;
}

export interface TableTimestampsInterface
  extends SoftDeleteInterface, TimestampsInterface
{ }
