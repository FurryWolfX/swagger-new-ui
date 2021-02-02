import axios from "axios";
import { message } from "antd";
import copy from "copy-to-clipboard";
import { IMeta, RequestInfo, Schema } from "../interface";
import store from "./App.store";

const limit = 50;

/**
 * 获取swagger的数据
 * @param remoteUrl
 */
export async function getData(remoteUrl: string) {
  const res = await axios.get(`/getData?url=${encodeURIComponent(remoteUrl)}`);
  if (res.data?.code === 200) {
    store.setSwaggerData(res.data.data);
  } else {
    alert("解析异常");
  }
}

/**
 * 将Java类型装换成TS类型
 * @param prop
 */
export function parseType(prop: Schema): string {
  if (prop.type === "array") {
    if (prop.items && prop.items.$ref) {
      return `${prop.items.$ref.replace("#/definitions/", "")}[]`;
    } else if (prop.items.type === "array") {
      // 递归解析范型
      return `${parseType(prop.items)}[]`;
    } else {
      return `${prop.items.type}[]`;
    }
  } else if (prop.type === "integer") {
    // 数字
    return "number";
  } else if (prop.$ref) {
    // 实体引用
    return prop.$ref.replace("#/definitions/", "");
  } else {
    return prop.type;
  }
}

function isKeywordInTags(keyword: string, tags: string[]) {
  for (let tag of tags) {
    if (tag.indexOf(keyword) !== -1) {
      return true;
    }
  }
  return false;
}

/**
 * 生成一个用于视图渲染的pathList
 * @param keyword
 * @param paths
 */
export function getPathList(
  keyword: string,
  paths: Record<string, Record<string, RequestInfo>>
) {
  if (keyword) {
    return Object.keys(paths)
      .filter(k => {
        const meta = parsePath(paths[k]);
        const tags = meta[0]?.tags || [];
        const includeUrl = k.indexOf(keyword) !== -1;
        const includeTag = isKeywordInTags(keyword, tags);
        return includeUrl || includeTag;
      })
      .slice(0, limit);
  } else {
    return Object.keys(paths).slice(0, limit);
  }
}

export function parsePath(path: Record<string, RequestInfo>) {
  const result: IMeta[] = [];
  const keys = Object.keys(path);

  keys.forEach(k => {
    result.push({
      method: k.toUpperCase(),
      summary: path[k].summary,
      description: path[k].description,
      tags: path[k].tags,
      parameters: path[k].parameters,
      responses: path[k].responses
    });
  });

  return result;
}

/**
 * 复制参数列表
 * @param path
 */
export function copyParamList(path: string) {
  const ele = document.getElementById(path + "__param");
  if (ele) {
    copy(ele.innerText);
    message.info("复制成功");
  }
}

/**
 * 复制实体类的定义
 */
export function copyInterface(id: string) {
  const ele = document.getElementById(id);
  if (ele) {
    copy(`export interface ${id} {\n${ele.innerText}\n}`);
    message.info("复制成功");
  }
}

/**
 * 获取实体类的定义
 */
export function getDefinitionsKeys() {
  if (store.swaggerData) {
    if (store.className) {
      return Object.keys(store.swaggerData.definitions)
        .filter(k => k.indexOf(store.className) !== -1)
        .slice(0, limit);
    } else {
      return Object.keys(store.swaggerData.definitions).slice(0, limit);
    }
  } else {
    return [];
  }
}
