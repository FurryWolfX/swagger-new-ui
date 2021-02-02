import React from "react";
import { observer } from "mobx-react-lite";
import { Row, Col } from "antd";
import SearchBar from "./App.SearchBar";
import PanelLeft from "./App.PanelLeft";
import RightPanel from "./App.RightPanel";

function App() {
  return (
    <div className="App">
      <SearchBar />
      <Row>
        <Col span={12}>
          <PanelLeft />
        </Col>
        <Col span={12}>
          <RightPanel />
        </Col>
      </Row>
    </div>
  );
}

export default observer(App);
