import { DoCheck } from '@angular/core';
import { Provider } from "@angular/core";
import { Component, forwardRef, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Variable, VariableType } from '../../entities/variable';

const variableTypes = VariableType;

const noop = () => {
};

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TagComponent),
  multi: true
};

@Component({
  selector: 'tag',
  templateUrl: 'tag.html',
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class TagComponent implements ControlValueAccessor {
  @Output()
  valueUpdate = new EventEmitter<Variable>();

  //The internal data model
  private item: Variable;
  private editValue: any;
  private edit: boolean = false;

  //Placeholders for the callbacks which are later providesd
  //by the Control Value Accessor
  private doOnTouchedCallback: () => void = noop;
  private doOnChangeCallback: (_: Variable) => void = noop;

  private onTouchedCallback = (variable: Variable): void => {
    if (this.edit === false) {
      this.doOnTouchedCallback();
    }
  };

  private onChangeCallback = (variable: Variable): void => {
    if (this.edit === false) {
      this.doOnChangeCallback(variable);
    }
  };

  constructor() {
    console.info('Create ScadaTag component');
  }

  get editMode(): boolean {
    return this.edit;
  }

  //get accessor
  get value(): Variable {
    if (this.edit)
      return this.editValue;
    else
      return this.item.value;
  };

  //set accessor including call the onchange callback
  set value(v: Variable) {
    if (this.edit) {
      if (v !== this.item.value) {
        this.editValue = v;
      }
    } else {
      if (v !== this.item.value) {
        this.item.value = v;
      }
    }
    this.onChangeCallback(v);
  }

  //Set touched on blur
  onBlur() {
    this.doOnTouchedCallback();
  }

  //From ControlValueAccessor interface
  writeValue(value: Variable) {
    if (value !== this.item) {
      this.item = value;
    }
  }

  //From ControlValueAccessor interface
  registerOnChange(fn: (_: Variable) => void): void {
    this.doOnChangeCallback = fn;
  }

  //From ControlValueAccessor interface
  registerOnTouched(fn: () => void): void {
    this.doOnTouchedCallback = fn;
  }

  //From ControlValueAccessor interface
  setDisabledState(isDisabled: boolean): void {

  }

  onUserEnter() {
    if (this.readonly === false) {
      this.editValue = this.item.value;
      this.edit = true;
    }
    this.doOnTouchedCallback();
  }
  onUserExit() {
    if (this.item.value !== this.editValue && this.readonly === false) {
      this.item.value = this.editValue;
      this.valueUpdate.emit(this.item);
    }
    this.edit = false;
    this.onBlur();
  }

  get isStringVariable() { return this.item && this.item.type === variableTypes[VariableType.string]; }
  get isNumberVariable() { return this.item && this.item.type === variableTypes[VariableType.number]; }
  get isBinaryVariable() { return this.item && this.item.type === variableTypes[VariableType.binary]; }
  get isEnumVariable() { return this.item && this.item.type === variableTypes[VariableType.enum]; }

  get icon(): string {
    return 'disc';
  }
  get representation(): string {
    return (this.item && this.item.representation) ? this.item.representation : 'text';
  }
  get max(): number {
    return (this.item && this.item.max) ? this.item.max : null;
  }
  get min(): number {
    return (this.item && this.item.min) ? this.item.min : null;
  }
  get step(): number {
    return (this.item && this.item.step) ? this.item.step : null;
  }
  get valueIsTrue(): boolean {
    return (this.item.value == true || this.item.value == "true");
  }
  get valueIsFalse(): boolean {
    return (this.item.value == false || this.item.value == "false");
  }
  get valueIsUndefined(): boolean {
    return this.valueIsTrue === false && this.valueIsFalse === false;
  }
  get readonly(): boolean { return this.item.readonly === true; }
  get disabled(): boolean { return this.item.disabled === true; }

}
