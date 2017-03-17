export enum VariableType {
  string,
  number,
  array,
  object,
  enum,
  binary
}

export interface Variable {
  name?: string;
  type?: string;
  description?: string;
  readonly?: boolean;
  value?: any;
  unit?: string;
}

export interface EnumerationVariable extends Variable {
  enumeration?: string[];
}
 
