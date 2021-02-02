import React, { useCallback, useState } from "react";
import { Button, Col, Input, Row, AutoComplete } from "antd";
import { observer } from "mobx-react-lite";
import { getData } from "./App.utils";
import store from "./App.store";

const options = [
  { value: "http://192.168.1.5:9999/admin-api" },
  { value: "http://192.168.1.5:8083/mms-car-wechat" },
  { value: "http://192.168.1.5:8888/saas-api" },
  { value: "http://192.168.1.5:8085/admin-app" },
  { value: "http://192.168.1.5:8089/workflow" }
];

function SearchBar() {
  const [remoteUrl, setRemoteUrl] = useState(
    "http://192.168.1.5:9999/admin-api"
  );
  const [loading, setLoading] = useState(false);
  const getDataAsync = useCallback(async () => {
    setLoading(true);
    await getData(remoteUrl);
    setLoading(false);
  }, [remoteUrl]);
  return (
    <>
      <div>为难以检索的Swagger重新写了个新界面（v3.0）By wolfx.cn</div>
      <Row>
        <Col span={12}>
          <span style={{ verticalAlign: "middle" }}>
            <AutoComplete
              options={options}
              onChange={ev => setRemoteUrl(ev)}
              value={remoteUrl}
              placeholder="请输入服务端地址"
            >
              <Input
                style={{ width: 400 }}
                value={remoteUrl}
                onInput={ev => setRemoteUrl(ev.currentTarget.value)}
              />
            </AutoComplete>
          </span>
          <span style={{ verticalAlign: "middle", paddingLeft: 20 }}>
            <Button loading={loading} onClick={() => getDataAsync()}>
              解析
            </Button>
          </span>
        </Col>
      </Row>
      <Row style={{ paddingBottom: 10, marginTop: 10 }}>
        <Col span={12}>
          <Input
            placeholder="请输入接口URL"
            value={store.keyword}
            onInput={ev => store.setKeyword(ev.currentTarget.value)}
          />
        </Col>
        <Col span={12} style={{ paddingLeft: 20 }}>
          <Input
            placeholder="请输入类名"
            value={store.className}
            onInput={ev => store.setClassName(ev.currentTarget.value)}
          />
        </Col>
      </Row>
    </>
  );
}

export default observer(SearchBar);
