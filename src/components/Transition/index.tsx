import React from "react";
import {
  TransitionGroup,
  Transition as ReactTransition,
} from "react-transition-group";

const getTransitionStyles = {
  entering: {
    position: "absolute",
    opacity: 0,
  },
  entered: {
    transition: "opacity 100ms ease-in-out",
    opacity: 1,
  },
  exiting: {
    transition: "all 100ms ease-in-out",
    opacity: 0,
  },
};

type Props = {
  children: React.ReactNode;
  location: {
    pathname: string;
  };
};

class Transition extends React.PureComponent<Props> {
  render() {
    // Destructuring props to avoid garbage this.props... in return statement
    const { children, location } = this.props;

    // the key is necessary
    // As our ReactTransition needs to know when pages are entering/exiting the DOM
    return (
      <TransitionGroup>
        <ReactTransition
          key={location.pathname}
          timeout={
            { enter: 100, exit: 100 } // duration of transition
          }
        >
          {
            // Styles depends on the status of page(entering, exiting, entered) in the DOM
            (status) => (
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              <div style={{ ...getTransitionStyles[status] }}>{children}</div>
            )
          }
        </ReactTransition>
      </TransitionGroup>
    );
  }
}

export default Transition;
