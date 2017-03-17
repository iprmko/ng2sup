export enum Representation {
  text, password, email, number, search, tel, url
}
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
  disabled?: boolean;
  value?: any;
  unit?: string;
  representation?: string;

  max?: number;
  min?: number;
  step?: number;
}

export interface EnumerationVariable extends Variable {
  enumeration?: string[];
}
