
export interface Region {

  header?: string;

  variables: Array<string>;

  regions: Array<Region>;

  pages: Array<string>;

  actions: Array<string>;

}

export class Page implements Region {

  public header?: string;

  public variables: Array<string>;

  public regions: Array<Region>;

  public pages: Array<string>;

  public actions: Array<string>;

  constructor(public title: string, public root?: boolean) {
    this.variables = new Array<string>();
    this.regions = new Array<Region>();
    this.pages = new Array<string>();
  }

}
