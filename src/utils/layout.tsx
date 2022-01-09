import React from "react";
import Layout from "../components/Layout/layout";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
function wrapLayout(WrappedComponent) {
  return class PP extends React.Component {
    constructor(props: any) {
      super(props);
      this.state = {
        isWrapped: true,
      };
    }

    render() {
      return (
        <Layout>
          <WrappedComponent {...this.props} />
        </Layout>
      );
    }
  };
}

export default wrapLayout;
