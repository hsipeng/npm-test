import '@babel/polyfill';
import {configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// react enzyme 测试环境配置
configure({adapter: new Adapter()});

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;
global.requestAnimationFrame = function(callback) {
  setTimeout(callback, 0);
};
