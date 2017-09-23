import { objectOptions, property, arrayProperty, getJSONSchema } from './index';
import { getPropertyKeys } from './utils';
import 'reflect-metadata';

enum kek {
  LOL = 'lol',
}

class KekSchema {
  @property({ required: true })
  name: string;
}

@objectOptions({ additionalProperties: false })
class PostBodySchema {
  @property({ required: true, enum: kek })
  token: kek;

  @property({ required: true })
  password: string;

  @arrayProperty({ required: true, items: String, itemOptions: { enum: kek } })
  ids: string[];

  @arrayProperty({ required: true, items: KekSchema })
  keks: KekSchema[];
}

@objectOptions({ $async: true, additionalProperties: false })
class PostSchema {
  @property({ required: true })
  body: PostBodySchema;
}

console.log(JSON.stringify(getJSONSchema(PostSchema), null, 2));
