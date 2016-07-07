'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactAddonsPureRenderMixin = require('react-addons-pure-render-mixin');

var _reactAddonsPureRenderMixin2 = _interopRequireDefault(_reactAddonsPureRenderMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var stackBlurImage = require('../lib/StackBlur.js');

var ReactBlur = function (_React$Component) {
  _inherits(ReactBlur, _React$Component);

  function ReactBlur(props) {
    _classCallCheck(this, ReactBlur);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ReactBlur).call(this, props));

    _this.shouldComponentUpdate = _reactAddonsPureRenderMixin2.default.shouldComponentUpdate.bind(_this);
    return _this;
  }

  _createClass(ReactBlur, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.loadImage(this.props);

      window.addEventListener('resize', this.resize.bind(this));
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      window.removeEventListener('resize', this.resize.bind(this));
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      if (!this.img) {
        this.loadImage(this.props);
      } else if (!this.isCurrentImgSrc(this.props.img)) {
        this.img.src = this.props.img;
        this.setDimensions();
      } else {
        // if some other prop changed reblur
        stackBlurImage(this.img, this.canvas, this.getCurrentBlur(), this.width, this.height);
      }
    }
  }, {
    key: 'isCurrentImgSrc',
    value: function isCurrentImgSrc(newSrc) {
      // Handle relative paths
      if (this.img) {
        var newImg = new Image();
        newImg.src = newSrc;

        // if absolute SRC is the same
        return newImg.src === this.img.src;
      }

      return false;
    }
  }, {
    key: 'getCurrentBlur',
    value: function getCurrentBlur() {
      return this.props.blurRadius;
    }
  }, {
    key: 'loadImage',
    value: function loadImage(props) {
      var _this2 = this;

      if (this.isCurrentImgSrc(props.img)) {
        stackBlurImage(this.img, this.canvas, props.blurRadius, this.width, this.height);
        return;
      }

      this.img = new Image();
      this.img.crossOrigin = 'Anonymous';
      this.img.onload = function (event) {
        stackBlurImage(_this2.img, _this2.canvas, _this2.getCurrentBlur(), _this2.width, _this2.height);
        props.onLoadFunction(event);
      };
      this.img.onerror = function (event) {
        _this2.img.src = '';
        props.onLoadFunction(event);
      };
      this.img.src = props.img;

      this.setDimensions();
    }
  }, {
    key: 'resize',
    value: function resize() {
      var _this3 = this;

      var now = new Date().getTime();
      var deferTimer = void 0;
      var threshhold = this.props.resizeInterval;

      if (this.last && now < this.last + threshhold) {
        clearTimeout(deferTimer);
        deferTimer = setTimeout(function () {
          _this3.last = now;
          _this3.doResize();
        }, threshhold);
      } else {
        this.last = now;
        this.doResize();
      }
    }
  }, {
    key: 'setDimensions',
    value: function setDimensions() {
      var container = _reactDom2.default.findDOMNode(this);

      this.height = container.offsetHeight;
      this.width = container.offsetWidth;

      this.canvas = _reactDom2.default.findDOMNode(this.refs.canvas);
      this.canvas.height = this.height;
      this.canvas.width = this.width;
    }
  }, {
    key: 'doResize',
    value: function doResize() {
      this.setDimensions();

      stackBlurImage(this.img, this.canvas, this.getCurrentBlur(), this.width, this.height);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props;
      var className = _props.className;
      var children = _props.children;

      var other = _objectWithoutProperties(_props, ['className', 'children']);

      var classes = 'react-blur';

      if (className) {
        classes += ' ' + className;
      }

      return _react2.default.createElement(
        'div',
        { className: classes, onClick: this.clickTest },
        _react2.default.createElement('canvas', { className: 'react-blur-canvas', ref: 'canvas' }),
        children
      );
    }
  }]);

  return ReactBlur;
}(_react2.default.Component);

ReactBlur.propTypes = {
  img: _react2.default.PropTypes.string.isRequired,
  blurRadius: _react2.default.PropTypes.number,
  resizeInterval: _react2.default.PropTypes.number,
  className: _react2.default.PropTypes.string,
  children: _react2.default.PropTypes.any,
  onLoadFunction: _react2.default.PropTypes.func
};
ReactBlur.defaultProps = {
  blurRadius: 0,
  resizeInterval: 128,
  onLoadFunction: function onLoadFunction() {}
};
exports.default = ReactBlur;
;
