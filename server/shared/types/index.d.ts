import { ErrorReason } from 'shared/constants';


export type ErrorProps = {
  reason: ErrorReason;
  expected: string;
  actual: string;
  solution: string;
}
