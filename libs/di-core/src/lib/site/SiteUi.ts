
export interface NavLink {
  route?: string;
  icon?: string;
  label: string;
  desc?: string;
  links?: Array<NavLink>;
}

export class SiteSettings {
  logo?: string;
  navigation?: Array<NavLink>;
  footer?: NavLink;
}


export class SiteUi {
  settings: SiteSettings;
  private static _instance?: SiteUi;
  private constructor(settings: SiteSettings) {
    this.settings = settings;
    SiteUi._instance = this;
  }
  public static Initialize(data: any) {
    if (data) {
      const settings: SiteSettings = Object.assign(new SiteSettings(), data);
      this._instance = new this(settings);
    }
    return this._instance;
  }
  static get Ctx() {
    return this._instance?.settings;
  }
}
