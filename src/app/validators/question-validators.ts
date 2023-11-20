import { ValidatorFn, AbstractControl, FormArray } from '@angular/forms';

export function minOptionsValidator(min: number = 2): ValidatorFn {
  return (formArray: AbstractControl): { [key: string]: any } | null => {
    const questionType = formArray.parent?.get('questionType')?.value;
    if (questionType !== 'open' && formArray instanceof FormArray) {
      if (formArray.length < min) {
        return { minOptions: { required: min, actual: formArray.length } };
      }
    }
    return null;
  };
}

export function multipleChoiceValidator(control: AbstractControl): {[key: string]: any} | null {
  const array = control as FormArray;
  const selectedCount = array.controls.filter(c => c.value).length;
  return selectedCount >= 2 ? null : { 'minTwoRequired': true };
}