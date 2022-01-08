import React from "react";
import Layout from "../components/Layout/layout";

function wrapLayout(WrappedComponent: any) {
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
