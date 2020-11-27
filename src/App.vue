<template>
  <div style="padding: 0 20px">
    <div>为难以检索的Swagger重新写了个新界面（v2.0）By wolfx.cn</div>
    <a-row>
      <a-col :span="12">
        <span style="vertical-align: middle">
          <a-input style="width: 400px" v-model="remoteUrl" placeholder="请输入服务端地址" />
        </span>
        <span style="vertical-align: middle">
          <a-button @click="getData">解析</a-button>
        </span>
      </a-col>
    </a-row>
    <a-row style="padding-bottom: 20px; margin-top: 4px">
      <a-col :span="12">
        <a-input v-model="url" placeholder="请输入接口URL" />
      </a-col>
      <a-col :span="12" style="padding-left: 20px">
        <a-input v-model="className" placeholder="请输入类名" />
      </a-col>
    </a-row>

    <a-row v-if="swaggerData">
      <a-col :span="12">
        <div class="scroll">
          <div v-for="(item, pIndex) in pathList" :key="pIndex">
            <div class="card-wrap" v-for="(meta, index) in parsePath(swaggerData.paths[item])">
              <a-card :key="index">
                <div class="card-title">
                  <a-tag color="green">
                    {{ meta.method }}
                  </a-tag>
                  <span>{{ item }}</span>
                </div>
                <div><b>summary</b>: {{ meta.summary }}</div>
                <div><b>description</b>: {{ meta.description }}</div>
                <div><b>tags</b>: {{ meta.tags }}</div>
                <div>
                  <span style="font-weight: bold">parameters:</span>
                </div>
                <div>
                  <a-button type="primary" @click="copyParamList(item)">复制参数列表</a-button>
                </div>
                <table>
                  <tr>
                    <th>name</th>
                    <th>description</th>
                    <th>required</th>
                    <th>type</th>
                  </tr>
                  <tr v-for="(param, paramIndex) in meta.parameters" :key="paramIndex">
                    <td>{{ param.name }}</td>
                    <td>{{ param.description }}</td>
                    <td>{{ param.required }}</td>
                    <td>
                      <template v-if="param.schema">
                        <a v-if="param.schema.$ref" @click="className = parseType(param.schema)">
                          {{ parseType(param.schema) }}
                        </a>
                        <span v-else>
                          {{ parseType(param.schema) }}
                        </span>
                      </template>
                      <span v-else>{{ param.type || "void" }}</span>
                    </td>
                  </tr>
                </table>
                <div :id="item + '__param'" style="height: 0; overflow: hidden">
                  <div v-for="(param, paramIndex) in meta.parameters" :key="paramIndex">
                    <div>/*{{ param.description }}*/</div>
                    <div>
                      {{ param.name }}:
                      <template v-if="param.schema">
                        {{ parseType(param.schema) }}
                      </template>
                      <span v-else>{{ param.type || "void" }}</span>
                      <span>;</span>
                    </div>
                  </div>
                </div>
                <div style="font-weight: bold">responses:</div>
                <table>
                  <tr>
                    <th>code</th>
                    <th>description</th>
                    <th>type</th>
                  </tr>
                  <tr v-for="(res, k) in meta.responses" :key="k">
                    <td>{{ k }}</td>
                    <td>{{ res.description }}</td>
                    <td>
                      <template v-if="res.schema">
                        <div v-if="res.schema.$ref">
                          <a @click="className = res.schema.$ref.replace('#/definitions/', '')">
                            {{ res.schema.$ref.replace("#/definitions/", "") }}
                          </a>
                        </div>
                        <div v-else>
                          {{ res.schema.type }}
                        </div>
                      </template>
                    </td>
                  </tr>
                </table>
              </a-card>
            </div>
          </div>
        </div>
      </a-col>
      <a-col :span="12" style="padding-left: 20px">
        <div class="scroll">
          <div class="card-wrap" v-for="defKey in definitionsKeys" :key="defKey">
            <a-card>
              <div class="card-title">
                <span>{{ defKey }}</span>
                <a-button type="primary" @click="copyInterface(defKey)">一键复制TS Interface</a-button>
              </div>
              <div :id="defKey">
                <div v-for="(prop, propKey) in swaggerData.definitions[defKey].properties">
                  <div v-if="prop.description">/*{{ prop.description }}*/</div>
                  <div>{{ propKey }}: {{ parseType(prop) }};</div>
                </div>
              </div>
            </a-card>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import axios from "axios";
import copy from "copy-to-clipboard";

interface ISwaggerData {
  basePath: string;
  host: string;
  info: {
    description: string;
    title: string;
    version: string;
  };
  paths: { [k: string]: any };
  definitions: { [k: string]: any };
}

interface IMeta {
  method: string;
  summary: string;
  description: string;
  tags: string[];
  parameters: any[];
  responses: { [k: string]: any };
}

@Component
export default class App extends Vue {
  swaggerData: ISwaggerData | null = null;
  remoteUrl = "http://192.168.1.5:9999/admin-api";
  url = "";
  className = "";

  get pathList() {
    if (this.swaggerData) {
      if (this.url) {
        return Object.keys(this.swaggerData.paths)
          .filter((k) => k.indexOf(this.url) !== -1)
          .slice(0, 100);
      } else {
        return Object.keys(this.swaggerData.paths).slice(0, 100);
      }
    } else {
      return [];
    }
  }

  get definitionsKeys() {
    if (this.swaggerData) {
      if (this.className) {
        return Object.keys(this.swaggerData.definitions)
          .filter((k) => k.indexOf(this.className) !== -1)
          .slice(0, 100);
      } else {
        return Object.keys(this.swaggerData.definitions).slice(0, 100);
      }
    } else {
      return [];
    }
  }

  async mounted() {}

  async getData() {
    const res = await axios.get(`/getData?url=${encodeURIComponent(this.remoteUrl)}`);
    if (res.data?.code === 200) {
      this.swaggerData = res.data.data;
    } else {
      alert("解析异常");
    }
  }

  copyParamList(path: string) {
    const ele = document.getElementById(path + "__param");
    if (ele) {
      copy(ele.innerText);
      this.$message.info("复制成功");
    }
  }

  copyInterface(id: string) {
    const ele = document.getElementById(id);
    if (ele) {
      copy(`export interface ${id} {\n${ele.innerText}\n}`);
      this.$message.info("复制成功");
    }
  }

  parsePath(path: { [k: string]: any }) {
    const result: IMeta[] = [];
    const keys = Object.keys(path);

    keys.forEach((k) => {
      result.push({
        method: k.toUpperCase(),
        summary: path[k].summary,
        description: path[k].description,
        tags: path[k].tags,
        parameters: path[k].parameters,
        responses: path[k].responses,
      });
    });

    return result;
  }

  parseType(prop: any): string {
    if (prop.type === "array") {
      // 数组，注意递归子级
      if (prop.items && prop.items.$ref) {
        return `${prop.items.$ref.replace("#/definitions/", "")}[]`;
      } else if (prop.items.type === "array") {
        return `${this.parseType(prop.items)}[]`;
      } else {
        return `${prop.items.type}[]`;
      }
    } else if (prop.type === "integer") {
      // 数字
      return "number";
    } else if (prop.$ref) {
      // 实体
      return prop.$ref.replace("#/definitions/", "");
    } else {
      return prop.type;
    }
  }
}
</script>

<style lang="scss" scoped>
.card-wrap {
  padding-bottom: 20px;
}
.card-title {
  font-size: 16px;
  font-weight: bold;
}
.scroll {
  height: calc(100vh - 120px);
  overflow: auto;
}
table {
  width: 100%;
  th {
    background-color: #1890ff;
    color: #fff;
  }
  th,
  td {
    border: 1px solid #eee;
    padding-left: 4px;
    padding-right: 4px;
  }
  tr:nth-child(odd) {
    background-color: #efefef;
  }
}
</style>
