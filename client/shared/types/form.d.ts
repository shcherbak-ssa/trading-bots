export type InputState = {
  value: InputValue;
  helpText: string;
  isError: boolean;
}

export type InputValue = string | number | Date | null;

export type InputConfig = {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date';
}
