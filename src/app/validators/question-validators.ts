import { ValidatorFn, AbstractControl, FormArray, ValidationErrors } from '@angular/forms';

export function multipleChoiceValidator(control: AbstractControl): ValidationErrors | null {
  if (control instanceof FormArray) {
    const isSelected = control.controls.some(c => c.value);
    return isSelected ? null : { 'multipleChoiceRequired': true };
  }
  return null;
}