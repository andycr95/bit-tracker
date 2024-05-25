import {
  toTypedRxJsonSchema,
  ExtractDocumentTypeFromTypedRxJsonSchema,
} from 'rxdb';
import { RxJsonSchema } from 'rxdb';

export const EXCHANGE_SCHEMA_LITERAL = {
  title: 'exchange schema',
  version: 0,
  type: 'object',
  primaryKey: 'key',
  properties: {
    value: {
      type: 'string',
    },
    key: {
      type: 'string',
    },
  },
  required: ['value', 'key'],
};

const schemaTyped = toTypedRxJsonSchema(EXCHANGE_SCHEMA_LITERAL);
export type RxExchangeDocumentType = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof schemaTyped
>;

export const EXCHANGE_SCHEMA: RxJsonSchema<RxExchangeDocumentType> =
  EXCHANGE_SCHEMA_LITERAL;
