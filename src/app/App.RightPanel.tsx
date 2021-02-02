import React from "react";
import { observer } from "mobx-react-lite";
import { Button, Card } from "antd";
import store from "./App.store";
import { copyInterface, getDefinitionsKeys, parseType } from "./App.utils";
import { PropertyItem } from "../interface";

function PropertyList(props: { properties: Record<string, PropertyItem> }) {
  return (
    <>
      {Object.keys(props.properties).map(propKey => {
        const prop = props.properties[propKey];
        if (prop) {
          return (
            <div key={propKey}>
              {prop.description && <div>/*{prop.description}*/</div>}
              <div>
                {propKey}: {parseType(prop)};
              </div>
            </div>
          );
        } else {
          return null;
        }
      })}
    </>
  );
}

function RightPanel() {
  const definitionsKeys = getDefinitionsKeys();
  return (
    <div className="scroll">
      {definitionsKeys.map(defKey => {
        return (
          <div className="card-wrap" key={defKey}>
            <Card>
              <div className="card-title">
                <span style={{ paddingRight: 10 }}>{defKey}</span>
                <Button type="primary" onClick={() => copyInterface(defKey)}>
                  一键复制TS Interface
                </Button>
              </div>
              <div id={defKey}>
                <PropertyList
                  properties={
                    store.swaggerData?.definitions[defKey]?.properties || {}
                  }
                />
              </div>
            </Card>
          </div>
        );
      })}
    </div>
  );
}

export default observer(RightPanel);
