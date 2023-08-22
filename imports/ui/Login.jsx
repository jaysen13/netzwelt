import React from "react";
import { Navigate } from "react-router-dom";
import Layout from "antd/lib/layout";
import Form from "antd/lib/form";
import Input from "antd/lib/input";
import Button from "antd/lib/button";
import Col from "antd/lib/col";
import Row from "antd/lib/row";
import Alert from "antd/lib/alert";
import Spin from "antd/lib/spin";
import { LOCAL_STORAGE_USER } from "../contants";
import { fetch, Headers } from "meteor/fetch";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: false, showError: false, errorMessage: "" };
  }
  isLogin() {
    const user = localStorage.getItem(LOCAL_STORAGE_USER);
    if (user) return user;
    return null;
  }
  toggleLoading(args = this.state) {
    this.setState({ ...args, loading: !this.state.loading });
  }
  async onFinish(values) {
    try {
      if (values.username && values.password) {
        this.toggleLoading({ ...this.state, showError: false, errorMessage: "" });
        const response = await fetch("/login", {
          method: "POST",
          headers: new Headers({
            "Content-Type": "application/json",
          }),
          body: JSON.stringify(values),
        });
        const data = await response.json();
        if (data && data.message)
          this.toggleLoading({ ...this.state, showError: true, errorMessage: data.message || "something went wrong" });
        else {
          localStorage.setItem(LOCAL_STORAGE_USER, JSON.stringify(data));
          this.toggleLoading();
        }
      }
    } catch (error) {
      this.toggleLoading({ ...this.state, showError: true, errorMessage: error.message || "something went wrong" });
    }
  }
  render() {
    let alert = "";
    if (this.state.showError)
      alert = (
        <Col span={16} offset={8}>
          <Alert message={this.state.errorMessage} type="error" closable />
        </Col>
      );
    if (this.isLogin()) return <Navigate to={"/"} replace={true} />;
    return (
      <Layout style={{ height: "95vh", justifyContent: "center" }}>
        <Row>
          <Col style={{ height: "100%" }} span={12} offset={6}>
            <Spin spinning={this.state.loading} size="large">
              <Form
                name="basic"
                labelCol={{
                  span: 8,
                }}
                wrapperCol={{
                  span: 16,
                }}
                style={{
                  maxWidth: 600,
                }}
                initialValues={{
                  remember: true,
                }}
                onFinish={(values) => this.onFinish(values)}
                onFinishFailed={() => {}}
                autoComplete="off"
              >
                <Row>
                  <Col span={6} offset={14}>
                    <h1>Login</h1>
                  </Col>
                  {alert}
                </Row>

                <Form.Item
                  label="Username"
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "Please input your username!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please input your password!",
                    },
                  ]}
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item
                  wrapperCol={{
                    offset: 8,
                    span: 16,
                  }}
                >
                  <Button style={{ width: "100%" }} type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </Spin>
          </Col>
        </Row>
      </Layout>
    );
  }
}
