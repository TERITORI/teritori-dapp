/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prefer-rest-params */
/* eslint-disable no-func-assign */
/* eslint-disable no-void */
/* eslint-disable no-var */

import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  CodeButton,
} from "@draft-js-plugins/buttons";
import { createStore } from "@draft-js-plugins/utils";
import { getVisibleSelectionRect } from "draft-js";
import React, { useState, useRef, useEffect, Fragment } from "react";

function _extends() {
  _extends = Object.assign
    ? Object.assign.bind()
    : function (target) {
        for (let i = 1; i < arguments.length; i++) {
          const source = arguments[i];
          for (const key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        }
        return target;
      };
  return _extends.apply(this, arguments);
}

const Toolbar = function Toolbar(_ref) {
  const defaultStore = _ref.store,
    children = _ref.children,
    defaultIsVisible = _ref.isVisible,
    defaultPosition = _ref.position,
    defaultOverrideContent = _ref.overrideContent,
    defaultTheme = _ref.theme;
  const _useState = useState({
      store: defaultStore,
      isVisible: defaultIsVisible,
      position: defaultPosition,
      theme: defaultTheme,
      overrideContent: defaultOverrideContent,
    }),
    toolbarPropsState = _useState[0],
    setToolbarPropsState = _useState[1];
  const toolbar = useRef(null);
  const onOverrideContent = function onOverrideContent(newOverrideContent) {
    setToolbarPropsState(function (prev) {
      return _extends({}, prev, {
        overrideContent: newOverrideContent,
      });
    });
  };
  const onSelectionChanged = function onSelectionChanged() {
    // need to wait a tick for window.getSelection() to be accurate
    // when focusing editor with already present selection
    setTimeout(function () {
      let _toolbar$current;
      if (!toolbar) return;

      // The editor root should be two levels above the node from
      // `getEditorRef`. In case this changes in the future, we
      // attempt to find the node dynamically by traversing upwards.
      const editorRef = toolbarPropsState.store.getItem("getEditorRef")();
      if (!editorRef) return;

      // This keeps backwards compatibility with React 15
      let editorRoot =
        editorRef.refs && editorRef.refs.editor
          ? editorRef.refs.editor
          : editorRef.editor;
      while (editorRoot.className.indexOf("DraftEditor-root") === -1) {
        editorRoot = editorRoot.parentNode;
      }
      const editorRootRect = editorRoot.getBoundingClientRect();
      const parentWindow =
        editorRoot.ownerDocument && editorRoot.ownerDocument.defaultView;
      const selectionRect = getVisibleSelectionRect(parentWindow || window);
      if (!selectionRect) return;

      // The toolbar shouldn't be positioned directly on top of the selected text,
      // but rather with a small offset so the caret doesn't overlap with the text.
      const extraTopOffset = -5;

      // Account for scrollTop of all ancestors
      let scrollOffset = 0;
      let ancestorNode = editorRoot.parentNode;
      while (ancestorNode !== null && ancestorNode.nodeName !== "HTML") {
        var _ancestorNode$scrollT;
        scrollOffset +=
          (_ancestorNode$scrollT = ancestorNode.scrollTop) != null
            ? _ancestorNode$scrollT
            : 0;
        ancestorNode = ancestorNode.parentNode;
      }
      const newPosition = {
        top:
          editorRoot.offsetTop -
          scrollOffset -
          (((_toolbar$current = toolbar.current) == null
            ? void 0
            : _toolbar$current.offsetHeight) || 0) +
          (selectionRect.top - editorRootRect.top) +
          extraTopOffset,
        left:
          editorRoot.offsetLeft +
          (selectionRect.left - editorRootRect.left) +
          selectionRect.width / 2,
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
          position: newPosition,
        });
      });
    });
  };
  const getStyle = function getStyle() {
    const overrideContent = toolbarPropsState.overrideContent,
      position = toolbarPropsState.position,
      store = toolbarPropsState.store;
    const selection = store.getItem("getEditorState")().getSelection();
    // overrideContent could for example contain a text input, hence we always show overrideContent
    // TODO: Test readonly mode and possibly set isVisible to false if the editor is readonly
    const visible =
      (!selection.isCollapsed() && selection.getHasFocus()) || overrideContent;
    const style = _extends({}, position);
    if (visible) {
      style.visibility = "visible";
      style.transform = "translate(-50%) scale(1)";
      style.transition = "transform 0.15s cubic-bezier(.3,1.2,.2,1)";
    } else {
      style.transform = "translate(-50%) scale(0)";
      style.visibility = "hidden";
    }
    return style;
  };
  const childrenProps = {
    theme: toolbarPropsState.theme.buttonStyles,
    getEditorState: toolbarPropsState.store.getItem("getEditorState"),
    setEditorState: toolbarPropsState.store.getItem("setEditorState"),
    onOverrideContent,
  };
  useEffect(function () {
    toolbarPropsState.store.subscribeToItem("selection", onSelectionChanged);
  }, []);
  useEffect(function () {
    return function () {
      toolbarPropsState.store.unsubscribeFromItem(
        "selection",
        onSelectionChanged,
      );
    };
  }, []);
  const OverrideContent = toolbarPropsState.overrideContent;
  return /*#__PURE__*/ React.createElement(
    "div",
    {
      className: toolbarPropsState.theme.toolbarStyles.toolbar,
      style: getStyle(),
      ref: toolbar,
    },
    OverrideContent
      ? /*#__PURE__*/ React.createElement(OverrideContent, childrenProps)
      : /*#__PURE__*/ React.createElement(
          React.Fragment,
          null,
          children
            ? children(childrenProps)
            : /*#__PURE__*/ React.createElement(
                Fragment,
                null,
                /*#__PURE__*/ React.createElement(ItalicButton, childrenProps),
                /*#__PURE__*/ React.createElement(BoldButton, childrenProps),
                /*#__PURE__*/ React.createElement(
                  UnderlineButton,
                  childrenProps,
                ),
                /*#__PURE__*/ React.createElement(CodeButton, childrenProps),
              ),
        ),
  );
};
const Toolbar$1 = Toolbar;

const separator = "s1o2cezu";
function Seperator(_ref) {
  const _ref$className = _ref.className,
    className = _ref$className === void 0 ? separator : _ref$className;
  return /*#__PURE__*/ React.createElement("div", {
    className,
  });
}

const buttonStyles = {
  buttonWrapper: "bpsgbes",
  button: "b181v2oy",
  active: "a9immln",
};
const toolbarStyles = {
  toolbar: "tukdd6b",
};
const defaultTheme = {
  buttonStyles,
  toolbarStyles,
};

const index = function (config) {
  if (config === void 0) {
    config = {};
  }
  const store = createStore({
    isVisible: false,
  });
  const _config = config,
    _config$theme = _config.theme,
    theme = _config$theme === void 0 ? defaultTheme : _config$theme;
  const InlineToolbar = function InlineToolbar(props) {
    return /*#__PURE__*/ React.createElement(
      Toolbar$1,
      _extends({}, props, {
        store,
        theme,
      }),
    );
  };
  return {
    initialize: function initialize(_ref) {
      const getEditorState = _ref.getEditorState,
        setEditorState = _ref.setEditorState,
        getEditorRef = _ref.getEditorRef;
      store.updateItem("getEditorState", getEditorState);
      store.updateItem("setEditorState", setEditorState);
      store.updateItem("getEditorRef", getEditorRef);
    },
    // Re-Render the text-toolbar on selection change
    onChange: function onChange(editorState) {
      store.updateItem("selection", editorState.getSelection());
      return editorState;
    },
    InlineToolbar,
  };
};

export { Seperator as Separator, index as default };
