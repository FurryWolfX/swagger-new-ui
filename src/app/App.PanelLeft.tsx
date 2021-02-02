import React from "react";
import { copyParamList, getPathList, parsePath, parseType } from "./App.utils";
import store from "./App.store";
import { Button, Card, Tag } from "antd";
import { observer } from "mobx-react-lite";
import { IMeta, Schema } from "../interface";

function ParamType(props: { schema: Schema; type: string }) {
  if (props.schema) {
    const type = parseType(props.schema);
    if (props.schema.$ref) {
      // 是引用类型
      return <a onClick={() => store.setClassName(type)}>{type}</a>;
    } else {
      return <span>{type}</span>;
    }
  } else {
    return <span>{props.type || "void"}</span>;
  }
}

function ParamTable(props: { meta: IMeta }) {
  return (
    <table>
      <tbody>
        <tr>
          <th>name</th>
          <th>description</th>
          <th>required</th>
          <th>type</th>
        </tr>
        {props.meta.parameters?.map((param, paramIndex) => {
          return (
            <tr key={paramIndex}>
              <td>{param.name}</td>
              <td>{param.description}</td>
              <td>{param.required}</td>
              <td>
                <ParamType schema={param.schema} type={param.type} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function ParamTableForCopy(props: { url: string; meta: IMeta }) {
  return (
    <div id={props.url + "__param"} style={{ height: 0, overflow: "hidden" }}>
      {props.meta.parameters?.map((param, paramIndex) => {
        return (
          <div key={paramIndex}>
            <div>/*{param.description}*/</div>
            <div>
              <span>{param.name}:</span>
              <ParamType schema={param.schema} type={param.type} />
              <span>;</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ResponseTable(props: { meta: IMeta }) {
  return (
    <table>
      <tbody>
        <tr>
          <th>code</th>
          <th>description</th>
          <th>type</th>
        </tr>
        {Object.keys(props.meta.responses).map((k: string) => {
          const res = props.meta.responses[k];
          return (
            <tr key={k}>
              <td>{k}</td>
              <td>{res.description}</td>
              <td>
                <ParamType schema={res.schema} type={res.schema?.type} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function PanelLeftItem(props: { url: string; meta: IMeta }) {
  return (
    <div className={"card-wrap"}>
      <Card>
        <div className="card-title">
          <Tag color="green">{props.meta.method}</Tag>
          <span>{props.url}</span>
        </div>
        <div>
          <b>summary</b>: {props.meta.summary}
        </div>
        <div>
          <b>description</b>: {props.meta.description}
        </div>
        <div>
          <b>tags</b>: {props.meta.tags}
        </div>
        <div>
          <span style={{ fontWeight: "bold" }}>parameters↓</span>
        </div>
        <div style={{ padding: "4px 0" }}>
          <Button type="primary" onClick={() => copyParamList(props.url)}>
            复制参数列表
          </Button>
        </div>
        <ParamTable meta={props.meta} />
        <ParamTableForCopy url={props.url} meta={props.meta} />
        <div style={{ fontWeight: "bold" }}>responses↓</div>
        <ResponseTable meta={props.meta} />
      </Card>
    </div>
  );
}

function PanelLeft() {
  // 当依赖变化时，重新获取 pathList
  const pathList = getPathList(store.keyword, store.swaggerData?.paths || {});
  return (
    <div className="scroll">
      {pathList.map((item, pIndex) => {
        return parsePath(
          store.swaggerData?.paths[item] as Record<string, any>
        ).map((meta, index) => {
          return (
            <PanelLeftItem
              url={item}
              meta={meta}
              key={item + "_" + pIndex + "_" + index}
            />
          );
        });
      })}
    </div>
  );
}

export default observer(PanelLeft);
