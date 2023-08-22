import React from "react";
import { LOCAL_STORAGE_USER } from "../contants";
import { Navigate } from "react-router-dom";
import { fetch } from "meteor/fetch";
import notification from "antd/lib/notification";
import Layout from "antd/lib/layout";
import Spin from "antd/lib/spin";
import Tree from "antd/lib/tree";

export default class Homepage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: false, data: [] };
  }
  componentDidMount() {
    if (!this.state.data.length) this.getTerritories();
  }
  toggleLoading(args = this.state) {
    this.setState({ ...args, loading: !this.state.loading });
  }
  isLogin() {
    const user = localStorage.getItem(LOCAL_STORAGE_USER);
    if (user) return user;
    return null;
  }
  errorPopup(args = { title: "", message: "" }) {
    notification.open({
      message: args.title,
      description: args.message,
      placement: "bottomRight",
      type: "error",
    });
  }
  logout() {
    localStorage.removeItem(LOCAL_STORAGE_USER);
  }
  sortData(territories) {
    const mainObj = {};
    const subObj = {};
    const tertiary = {};
    territories.forEach(({ name, id }) => {
      if (id.length === 1) mainObj[id] = { title: name, key: id, children: [] };
      else if (id.length === 3) subObj[id] = { title: name, key: id, children: [] };
      else if (id.length === 5) tertiary[id] = { title: name, key: id };
    });
    Object.keys(tertiary).forEach((id) => {
      const subId = id.substring(0, 3);
      subObj[subId].children.push(tertiary[id]);
    });
    Object.keys(subObj).forEach((id) => {
      const mainId = id.charAt();
      mainObj[mainId].children.push(subObj[id]);
    });
    return Object.keys(mainObj).map((id) => mainObj[id]);
  }
  async getTerritories() {
    try {
      this.toggleLoading();
      const response = await fetch("/allTeritories", { method: "GET" });
      const data = await response.json();
      let sortedData = [];

      if (data && data.data) sortedData = this.sortData(data.data);

      this.toggleLoading({ ...this.state, data: sortedData });
    } catch (error) {
      this.errorPopup({ title: "Something went Wrong!", message: error.message || "Something went Wrong!" });
      this.toggleLoading();
    }
  }
  render() {
    if (!this.isLogin()) return <Navigate to={"/account/login"} />;
    return (
      <Spin spinning={this.state.loading}>
        <Layout style={{ height: "95vh", overflow: "auto", background: "#fff", width: "25%" }}>
          <h1>Territories</h1>
          <Tree treeData={this.state.data} />
        </Layout>
      </Spin>
    );
  }
}
