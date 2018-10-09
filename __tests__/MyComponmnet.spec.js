import React from "react";
import ReactDOM from "react-dom";
import MyComponent from "../src/MyComponent";
import { shallow } from "enzyme";

const setup = () => {
  // 模拟 props
  const props = {
    // Jest 提供的mock 函数
    // onAddClick: jest.fn(e => {})
  };

  // 通过 enzyme 提供的 shallow(浅渲染) 创建组件
  const wrapper = shallow(<MyComponent {...props} />);
  return {
    props,
    wrapper
  };
};
describe("Mycomponent", () => {
  const { wrapper, props } = setup();
  it("render component", () => {
    const div = document.createElement("div");
    ReactDOM.render(<MyComponent />, div);
  });

  it("render content in component", () => {
    expect(wrapper.find("label").exists());
  });
});
