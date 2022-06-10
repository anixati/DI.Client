// import { SiteSettings } from "../data";


// export class SiteUi {
//   settings: SiteSettings;
//   private static _instance?: SiteUi;
//   private constructor(settings: SiteSettings) {
//     this.settings = settings;
//     SiteUi._instance = this;
//   }
//   public static Initialize(data: any) {
//     console.log('site ui init',data)
//     if (data) {
//       const settings: SiteSettings = Object.assign(new SiteSettings(), data);
//       this._instance = new this(settings);
//     }
//     return this._instance;
//   }
//   static get Ctx() {
//     return this._instance?.settings;
//   }
// }
