import { Observable, Subscription } from 'rxjs';
import { DoCheck } from '@angular/core';
import { Provider } from "@angular/core";
import { Component, forwardRef, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Variable } from '../../entities/variable';
import { Action } from '../../entities/action';
import { TagComponent } from '../../components/tag/tag'
import { Variables } from '../../providers/variables';
import { Actions } from '../../providers/actions';
import { NavController, NavParams } from 'ionic-angular';

const noop = () => {
};

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ActionComponent),
  multi: true
};

@Component({
  selector: 'action',
  templateUrl: 'action.html',
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class ActionComponent implements ControlValueAccessor {

  @Output()
  variableUpdate = new EventEmitter<Action>();

  private variables: Array<Variable>;

  private errorMessage: string;

  //The internal data model
  private item: Action;

  //Placeholders for the callbacks which are later providesd
  //by the Control Value Accessor
  private doOnTouchedCallback: () => void = noop;
  private doOnChangeCallback: (_: Action) => void = noop;

  constructor(
    private variablesProvider: Variables,
    private actionsProvider: Actions,
    public navCtrl: NavController,
  ) {
    console.info('Create ScadaAction component');
  }

  //Set touched on blur
  onBlur() {
    this.doOnTouchedCallback();
  }

  //From ControlValueAccessor interface
  writeValue(value: Action) {
    if (value && value !== this.item) {
      console.info("Initialize region:", value);
      this.item = value;

      if (this.item.variables)
        // Get variables schema
        this.variablesProvider.getVariables(this.item.variables)
          .subscribe((vars: Array<Variable>) => this.setupVariables(vars), this.showError);

    }
  }

  private setupVariables(vars: Array<Variable>) {
    // Show Variables
    this.variables = vars;
  }

  private showError(error: any) {
    this.errorMessage = error;
  }

  private onTouchedCallback = (region: Action): void => {
    this.doOnTouchedCallback();
  };

  private onChangeCallback = (region: Action): void => {
    this.doOnChangeCallback(region);
  };

  //From ControlValueAccessor interface
  registerOnChange(fn: (_: Action) => void): void {
    this.doOnChangeCallback = fn;
  }

  //From ControlValueAccessor interface
  registerOnTouched(fn: () => void): void {
    this.doOnTouchedCallback = fn;
  }

  //From ControlValueAccessor interface
  setDisabledState(isDisabled: boolean): void {

  }

  performAction(actionName: string) {
    this.variableUpdate.emit(this.item);
  }

}
