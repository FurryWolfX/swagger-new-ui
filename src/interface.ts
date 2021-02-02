export interface ISwaggerData {
  basePath: string;
  host: string;
  info: {
    description: string;
    title: string;
    version: string;
  };
  paths: Record<string, Record<string, RequestInfo>>;
  definitions: Record<string, DefinitionItem>;
}

export interface DefinitionItem {
  description: string;
  title: string;
  type: string;
  properties: Record<string, PropertyItem>;
}

export interface PropertyItem {
  allowEmptyValue: boolean;
  description: string;
  type: string;
  items: Schema;
}

export interface RequestInfo {
  consumes: string[];
  produces: string[];
  summary: string;
  description: string;
  tags: string[];
  parameters: ParameterItem[];
  responses: Record<string, ResponseItem>;
}

export interface ResponseItem {
  description: string;
  type: string;
  schema: Schema;
}

export interface ParameterItem {
  description: string;
  in: string;
  name: string;
  type: string;
  required: boolean;
  schema: Schema;
}

export interface Schema {
  type: string;
  $ref?: string;
  items: Schema;
}

export interface IMeta {
  method: string;
  summary: string;
  description: string;
  tags: string[];
  parameters: ParameterItem[];
  responses: Record<string, ResponseItem>;
}
