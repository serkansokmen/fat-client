import { ValidatorFn, AbstractControl } from '@angular/forms';

export function maxValue(max: Number): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    const input = control.value, isValid = input > max;
    if (isValid) {
      return {
        'maxValue': { max }
      }
    }
    else {
      return null;
    }
  };
}
