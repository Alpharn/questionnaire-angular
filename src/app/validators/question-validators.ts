import { AbstractControl, FormArray, ValidationErrors } from '@angular/forms';

/**
 * This validator checks if at least one option in a multiple choice field (FormArray) is selected.
 * 
 * @param control AbstractControl - The form control to which this validator is applied.
 * 
 * @returns ValidationErrors | null - Returns an object with a 'multipleChoiceRequired' error if no options are selected, otherwise null
 */
export function multipleChoiceValidator(control: AbstractControl): ValidationErrors | null {
  if (control instanceof FormArray) {
    const isSelected = control.controls.some(c => c.value);
    return isSelected ? null : { 'multipleChoiceRequired': true };
  }
  return null;
}