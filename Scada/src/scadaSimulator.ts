import { EventEmitter } from 'events';
import { EnumerationVariable, Variable, VariableType } from './variable';

export class SCADASimOptions {
  tickTime?: number = 1000;
}

class SCADASim extends EventEmitter {
  private timer: NodeJS.Timer = null;

  constructor(
    private vars: Variable[],
    private options?: SCADASimOptions) {
    super();
    if (!this.options) this.options = new SCADASimOptions();
  }

  public startSimulate(): void {
    this.timer = setInterval(() => {
      var randomChanges = this.variables
        .filter(v => v.readonly)
        .map(v => this.randomChange(v));
      this.emit('variableChange', randomChanges);
    }, this.options.tickTime);
  }
  public stopSimulate(): void {
    if (!this.running)
      clearInterval(this.timer);
    this.timer = null;
  }
  public get running(): boolean {
    return this.timer !== null;
  }


  public get variables(): Variable[] {
    return this.vars;
  }
  public set variables(variables: Variable[]) {
    this.vars = variables;
  }

  public updateVariable(name: string, value: any) {
    let variable = this.variables.find(v => v.name === name);
    if (variable) {
      variable.value = value;
      this.emit('variableChange', [variable]);
    }
  }

  private randomChange(variable: Variable | EnumerationVariable): VariableChange {
    let variableTypes = VariableType;
    let val = variable.value;

    switch (variable.type) {
      case variableTypes[VariableType.number]:
        val = Math.random();
        break;
      case variableTypes[VariableType.string]:
        val = this.randomItem(this.dummyStrings);
        break;
      case variableTypes[VariableType.array]:
        val = this.variables.map(this.randomChange);
        break;
      case variableTypes[VariableType.binary]:
        val = this.randomItem(['true', 'false']);
        break;
      case variableTypes[VariableType.enum]:
        val = this.randomItem((variable as EnumerationVariable).enumeration);
        break;
      case variableTypes[VariableType.object]:
        throw new Error("Not implemented")
      default:
        throw new Error("Unknown variable type, valid types are " + JSON.stringify(variableTypes))
    }

    return { name: variable.name, value: val };
  }

  private dummyStrings: string[] = [
    'pippo', 'pluto', 'paperino'
  ];

  private randomItem<T>(items: Array<T>): T {
    var randomIndex = Math.round(Math.random() * (items.length - 1));
    return items[randomIndex];
  }
}

interface VariableChange {
  name: string;
  value: any;
}

export default SCADASim;
