import { makeAutoObservable } from "mobx";
import { ISwaggerData } from "../interface";

class Store {
  swaggerData: ISwaggerData | null = null;
  keyword: string = "";
  className: string = "";

  constructor() {
    makeAutoObservable(this);
  }

  setSwaggerData(swaggerData: ISwaggerData) {
    this.swaggerData = swaggerData;
  }
  setKeyword(keyword: string) {
    this.keyword = keyword;
  }
  setClassName(className: string) {
    this.className = className;
  }
}

export default new Store();
