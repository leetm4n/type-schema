# Type-Schema

[![Build Status](https://travis-ci.org/leetm4n/type-schema.svg?branch=master)](https://travis-ci.org/leetm4n/type-schema)
[![Coverage Status](https://coveralls.io/repos/github/leetm4n/type-schema/badge.svg?branch=master)](https://coveralls.io/github/leetm4n/type-schema?branch=master)
[![npm](https://img.shields.io/npm/dt/type-schema.svg)]()

Define JSON Schemas using TypeScript classes

## Usage

### Example #1 (Simple login schema):
```typescript
import { property, arrayProperty, objectOptions, getJSONSchema } from 'type-schema';

class PostBodySchema {
  @property({ required: true })
  username: string;

  @property({ required: true })
  password: string;
}

// AJV async schema
@objectOptions({ $async: true })
class PostSchema {
  @property({ required: true })
  body: PostBodySchema;
}

const postSchema = getJSONSchema(PostSchema);
```

Where postSchema will be the following JSON schema:
```JSON
{
  "$async": true,
  "type": "object",
  "properties": {
    "body": {
      "additionalProperties": false,
      "type": "object",
      "properties": {
        "username": {
          "type": "string"
        },
        "password": {
          "type": "string"
        }
      },
      "required": [
        "username",
        "password"
      ]
    }
  },
  "required": [
    "body"
  ]
}
```

### Example #2 (Administration of a user by id):
```typescript
import { property, arrayProperty, objectOptions, getJSONSchema } from './index';

enum Permissions {
  ADMIN = 'admin',
  USER = 'user',
  SUPER_ADMIN = 'superAdmin',
}

class PutBodySchema {
  @property()
  username: string;

  @arrayProperty({ items: String, itemOptions: { enum: Permissions } })
  permissions: string[];
}

class ParamsByIdSchema {
  @property({ required: true })
  userid: string;
}

// AJV async schema
@objectOptions({ $async: true })
class PutByIdSchema {
  @property({ required: true })
  body: PutBodySchema;

  @property({ required: true })
  params: ParamsByIdSchema;
}

const putByIdSchema = getJSONSchema(PutByIdSchema);
```

Where postSchema will be the following JSON schema:
```JSON
{
  "$async": true,
  "type": "object",
  "properties": {
    "body": {
      "type": "object",
      "properties": {
        "username": {
          "type": "string"
        },
        "permissions": {
          "type": "array",
          "items": {
            "enum": [
              "admin",
              "user",
              "superAdmin"
            ],
            "type": "string"
          }
        }
      }
    },
    "params": {
      "type": "object",
      "properties": {
        "userid": {
          "type": "string"
        }
      },
      "required": [
        "userid"
      ]
    }
  },
  "required": [
    "body",
    "params"
  ]
}
```
