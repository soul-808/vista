import React from "react";
import * as ReactDOMClient from "react-dom/client";
import reactToWebComponent from "react-to-webcomponent";
import App from "../App";
import tailwindCss from "../index.css?inline";

interface RootedElement extends Element {
  __root?: ReactDOMClient.Root;
}

// Compatibility wrapper for React 18+
const compatReactDOM = {
  render: (reactElement: unknown, domElement: unknown) => {
    const el = domElement as RootedElement;
    // Inject Tailwind CSS into the shadow root
    const shadowRoot = el.getRootNode() as ShadowRoot;
    if (shadowRoot && !shadowRoot.querySelector("style[data-tailwind]")) {
      const style = document.createElement("style");
      style.setAttribute("data-tailwind", "true");
      style.textContent = tailwindCss;
      shadowRoot.appendChild(style);
    }
    const root = ReactDOMClient.createRoot(el);
    root.render(reactElement as React.ReactElement);
    el.__root = root;
  },
  unmountComponentAtNode: (domElement: unknown): boolean => {
    const el = domElement as RootedElement;
    if (el.__root) {
      el.__root.unmount();
      delete el.__root;
      return true;
    }
    return false;
  },
};

// Using standalone flag instead of wrapping with router
const AppWithRouting = () => <App standalone={true} />;

// Convert the React component to a Web Component
const InfrastructureMFE = reactToWebComponent(
  AppWithRouting,
  React,
  compatReactDOM,
  {
    shadow: "open",
  }
);

// Register the web component
customElements.define("infrastructure-mfe", InfrastructureMFE);

export default InfrastructureMFE;
