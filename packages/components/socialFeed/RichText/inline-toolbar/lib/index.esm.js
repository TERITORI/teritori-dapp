import React, { useState, useRef, useEffect, Fragment } from 'react';
import { createStore } from '@draft-js-plugins/utils';
import { getVisibleSelectionRect } from 'draft-js';
import { ItalicButton, BoldButton, UnderlineButton, CodeButton } from '@draft-js-plugins/buttons';

function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}

var Toolbar = function Toolbar(_ref) {
  var defaultStore = _ref.store,
    children = _ref.children,
    defaultIsVisible = _ref.isVisible,
    defaultPosition = _ref.position,
    defaultOverrideContent = _ref.overrideContent,
    defaultTheme = _ref.theme;
  var _useState = useState({
      store: defaultStore,
      isVisible: defaultIsVisible,
      position: defaultPosition,
      theme: defaultTheme,
      overrideContent: defaultOverrideContent
    }),
    toolbarPropsState = _useState[0],
    setToolbarPropsState = _useState[1];
  var toolbar = useRef(null);
  var onOverrideContent = function onOverrideContent(newOverrideContent) {
    setToolbarPropsState(function (prev) {
      return _extends({}, prev, {
        overrideContent: newOverrideContent
      });
    });
  };
  var onSelectionChanged = function onSelectionChanged() {
    // need to wait a tick for window.getSelection() to be accurate
    // when focusing editor with already present selection
    setTimeout(function () {
      var _toolbar$current;
      if (!toolbar) return;

      // The editor root should be two levels above the node from
      // `getEditorRef`. In case this changes in the future, we
      // attempt to find the node dynamically by traversing upwards.
      var editorRef = toolbarPropsState.store.getItem('getEditorRef')();
      if (!editorRef) return;

      // This keeps backwards compatibility with React 15
      var editorRoot = editorRef.refs && editorRef.refs.editor ? editorRef.refs.editor : editorRef.editor;
      while (editorRoot.className.indexOf('DraftEditor-root') === -1) {
        editorRoot = editorRoot.parentNode;
      }
      var editorRootRect = editorRoot.getBoundingClientRect();
      var parentWindow = editorRoot.ownerDocument && editorRoot.ownerDocument.defaultView;
      var selectionRect = getVisibleSelectionRect(parentWindow || window);
      if (!selectionRect) return;

      // The toolbar shouldn't be positioned directly on top of the selected text,
      // but rather with a small offset so the caret doesn't overlap with the text.
      var extraTopOffset = -5;

      // Account for scrollTop of all ancestors
      var scrollOffset = 0;
      var ancestorNode = editorRoot.parentNode;
      while (ancestorNode !== null && ancestorNode.nodeName !== 'HTML') {
        var _ancestorNode$scrollT;
        scrollOffset += (_ancestorNode$scrollT = ancestorNode.scrollTop) != null ? _ancestorNode$scrollT : 0;
        ancestorNode = ancestorNode.parentNode;
      }
      var newPosition = {
        top: editorRoot.offsetTop - scrollOffset - (((_toolbar$current = toolbar.current) == null ? void 0 : _toolbar$current.offsetHeight) || 0) + (selectionRect.top - editorRootRect.top) + extraTopOffset,
        left: editorRoot.offsetLeft + (selectionRect.left - editorRootRect.left) + selectionRect.width / 2
      };

      //custom-changes
      if (newPosition.left < 90) {
        newPosition.left = 90;
      }
      if (newPosition.top < 0) {
        if (newPosition.top < -20 && newPosition.top > -40) {
          newPosition.top = 40;
        } else if (newPosition.top < -40) {
          newPosition.top = 20;
        } else {
          newPosition.top = 0;
        }
      }
      setToolbarPropsState(function (prevState) {
        return _extends({}, prevState, {
          position: newPosition
        });
      });
    });
  };
  var getStyle = function getStyle() {
    var overrideContent = toolbarPropsState.overrideContent,
      position = toolbarPropsState.position,
      store = toolbarPropsState.store;
    var selection = store.getItem('getEditorState')().getSelection();
    // overrideContent could for example contain a text input, hence we always show overrideContent
    // TODO: Test readonly mode and possibly set isVisible to false if the editor is readonly
    var visible = !selection.isCollapsed() && selection.getHasFocus() || overrideContent;
    var style = _extends({}, position);
    if (visible) {
      style.visibility = 'visible';
      style.transform = 'translate(-50%) scale(1)';
      style.transition = 'transform 0.15s cubic-bezier(.3,1.2,.2,1)';
    } else {
      style.transform = 'translate(-50%) scale(0)';
      style.visibility = 'hidden';
    }
    return style;
  };
  var childrenProps = {
    theme: toolbarPropsState.theme.buttonStyles,
    getEditorState: toolbarPropsState.store.getItem('getEditorState'),
    setEditorState: toolbarPropsState.store.getItem('setEditorState'),
    onOverrideContent: onOverrideContent
  };
  useEffect(function () {
    toolbarPropsState.store.subscribeToItem('selection', onSelectionChanged);
  }, []);
  useEffect(function () {
    return function () {
      toolbarPropsState.store.unsubscribeFromItem('selection', onSelectionChanged);
    };
  }, []);
  var OverrideContent = toolbarPropsState.overrideContent;
  return /*#__PURE__*/React.createElement("div", {
    className: toolbarPropsState.theme.toolbarStyles.toolbar,
    style: getStyle(),
    ref: toolbar
  }, OverrideContent ? /*#__PURE__*/React.createElement(OverrideContent, childrenProps) : /*#__PURE__*/React.createElement(React.Fragment, null, children ? children(childrenProps) : /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement(ItalicButton, childrenProps), /*#__PURE__*/React.createElement(BoldButton, childrenProps), /*#__PURE__*/React.createElement(UnderlineButton, childrenProps), /*#__PURE__*/React.createElement(CodeButton, childrenProps))));
};
var Toolbar$1 = Toolbar;

var separator = "s1o2cezu";
function Seperator(_ref) {
  var _ref$className = _ref.className,
    className = _ref$className === void 0 ? separator : _ref$className;
  return /*#__PURE__*/React.createElement("div", {
    className: className
  });
}

var buttonStyles = {
  buttonWrapper: "bpsgbes",
  button: "b181v2oy",
  active: "a9immln"
};
var toolbarStyles = {
  toolbar: "tukdd6b"
};
var defaultTheme = {
  buttonStyles: buttonStyles,
  toolbarStyles: toolbarStyles
};

var index = (function (config) {
  if (config === void 0) {
    config = {};
  }
  var store = createStore({
    isVisible: false
  });
  var _config = config,
    _config$theme = _config.theme,
    theme = _config$theme === void 0 ? defaultTheme : _config$theme;
  var InlineToolbar = function InlineToolbar(props) {
    return /*#__PURE__*/React.createElement(Toolbar$1, _extends({}, props, {
      store: store,
      theme: theme
    }));
  };
  return {
    initialize: function initialize(_ref) {
      var getEditorState = _ref.getEditorState,
        setEditorState = _ref.setEditorState,
        getEditorRef = _ref.getEditorRef;
      store.updateItem('getEditorState', getEditorState);
      store.updateItem('setEditorState', setEditorState);
      store.updateItem('getEditorRef', getEditorRef);
    },
    // Re-Render the text-toolbar on selection change
    onChange: function onChange(editorState) {
      store.updateItem('selection', editorState.getSelection());
      return editorState;
    },
    InlineToolbar: InlineToolbar
  };
});

export { Seperator as Separator, index as default };
