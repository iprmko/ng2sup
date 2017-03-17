import { Observable, Subscription } from 'rxjs';
import { DoCheck } from '@angular/core';
import { Provider } from "@angular/core";
import { Component, forwardRef, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NavController, NavParams, Loading } from 'ionic-angular';

import { Region, Page } from '../../entities/page';
import { Variable } from '../../entities/variable';
import { Action } from '../../entities/action';

import { Variables } from '../../providers/variables';
import { Actions } from '../../providers/actions';
import { Pages } from '../../providers/pages';
import { VariablesMonitor, VariableChange } from '../../providers/variables-monitor';

import { TagComponent } from '../../components/tag/tag';
import { ActionComponent } from '../../components/action/action';

const noop = () => {
};

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => RegionComponent),
  multi: true
};

@Component({
  selector: 'region',
  templateUrl: 'region.html',
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR, TagComponent, ActionComponent]
})
export class RegionComponent implements ControlValueAccessor {

  @Output()
  public variableUpdate = new EventEmitter<Variable>();

  @Output()
  public pageChange = new EventEmitter<Page>();

  private variablesMonitorSubscription: Subscription = null;

  private variables: Array<Variable> = null;

  private actions: Array<Action> = null;

  private pages: Array<Page> = null;

  private errorMessage: string;

  //The internal data model
  private item: Region;

  //Placeholders for the callbacks which are later providesd
  //by the Control Value Accessor
  private doOnTouchedCallback: () => void = noop;
  private doOnChangeCallback: (_: Region) => void = noop;

  constructor(
    private variablesProvider: Variables,
    private actionsProvider: Actions,
    private pagesProvider: Pages,
    private variablesMonitorProvider: VariablesMonitor,
    public navCtrl: NavController,
  ) {
    console.info('Create ScadaRegion component');
  }

  //Set touched on blur
  onBlur() {
    this.doOnTouchedCallback();
  }

  //From ControlValueAccessor interface
  writeValue(value: Region) {
    if (value && value !== this.item) {
      console.info("Initialize region:", value);
      this.item = value;

      if (this.item.variables) {
        // Get variables schema
        this.variablesProvider.getVariables(this.item.variables)
          .subscribe((vars: Array<Variable>) => this.setupVariables(vars), err => this.showError(err));
      } else {
        this.variables = [];
      }

      if (this.item.pages) {
        // Get pages schema
        this.pagesProvider.getPages(this.item.pages)
          .subscribe((pages: Array<Page>) => this.setupPages(pages),  err => this.showError(err));
      } else {
        this.pages = [];
      }

      if (this.item.actions) {
        // Get actions schema
        this.actionsProvider.getActions(this.item.actions)
          .subscribe((actions: Array<Action>) => this.setupActionFields(actions), err => this.showError(err));
      } else {
        this.actions = [];
      }


    }
  }

  private setupActionFields(actions: Array<Action>) {
    // Show Actions
    this.actions = actions;
  }

  private setupPages(pages: Array<Page>) {
    // Show Pages
    this.pages = pages;
  }

  private setupVariables(vars: Array<Variable>) {
    // Show Variables
    this.variables = vars;
    // Start track variables status
    this.variablesMonitorSubscription = this.variablesMonitorProvider
      .variableChange.subscribe(v => this.handleVariableChange(v),  err => this.showError(err));
  }

  private handleVariableChange(change: VariableChange) {
    // console.log('One or more variables are changed: ', change);
    if (this.variables) {
      this.variables.forEach(v => {
        var item = this.variables.find(item => item.name === change.name);
        if (item) item.value = change.value;
      })
    }
  }

  private showError(error: any) {
    this.errorMessage = error;
  }

  private onTouchedCallback = (region: Region): void => {
    this.doOnTouchedCallback();
  };

  private onChangeCallback = (region: Region): void => {
    this.doOnChangeCallback(region);
  };

  //From ControlValueAccessor interface
  registerOnChange(fn: (_: Region) => void): void {
    this.doOnChangeCallback = fn;
  }

  //From ControlValueAccessor interface
  registerOnTouched(fn: () => void): void {
    this.doOnTouchedCallback = fn;
  }

  //From ControlValueAccessor interface
  setDisabledState(isDisabled: boolean): void {

  }

  variableChange(variable: Variable) {
    this.variableUpdate.emit(variable);
    this.variablesMonitorProvider.updateVariable(variable);
  }

  navigate(page: Page) {
    this.pageChange.emit(page);
  }

  doAction(action: Action) {
    console.log("DO Action", action);
  }

  ngOnDestroy() {
    // Clear component subscriptions
    if (this.variablesMonitorSubscription != null)
      this.variablesMonitorSubscription.unsubscribe();
  }
}
