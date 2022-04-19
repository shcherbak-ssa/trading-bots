// @ts-ignore
import dateFormat from 'dateformat';

import type { InputState, InputValue, InputConfig } from 'shared/types';
import { initialInputState } from 'shared/constants';


// Date
export function formDate(date: Date, format: string = 'yyyy-mm-dd'): string {
  return dateFormat(date, format);
}


// Inputs
export function getInitialInputState(inputType: InputConfig['type']): InputState {
  let inputValue: InputValue = '';

  switch (inputType) {
    case 'number':
      inputValue = 0;
      break;
    case 'date':
      inputValue = null;
  }

  return {
    ...initialInputState,
    value: inputValue,
  };
}

export function getInputValues(inputs: { [p: string]: InputState; }): { [p: string]: InputValue } {
  return Object.fromEntries(
    Object.entries(inputs).map(([key, { value }]) => {
      if (value instanceof Date) {
        return [key, value.toISOString()];
      }

      return [key, value];
    })
  );
}

export function resetInputsState(inputs: { [p: string]: InputState; }, excepts: string[]): void {
  for (const [key, states] of Object.entries(inputs)) {
    for (const stateKey of Object.keys(states)) {
      if (excepts.includes(stateKey)) continue;

      // @ts-ignore
      inputs[key][stateKey] = initialInputState[stateKey];
    }
  }
}
