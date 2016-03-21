import * as React from 'react';

abstract class TestResultProps {
  tested: boolean; // passed failed
  lunch: any; // result lunch
}

export default class TestResult extends React.Component<TestResultProps, {}> {
  render() {
    const pendingMessage = (
      <div className="item">
        <div className="ui icon message">
          <i className="notched circle loading icon"></i>
          <div className="content">
            <div className="header">Test in progress</div>
          </div>
        </div>
      </div>
    );

    const lunchResult = (
      <div className="item">
        <div className="ui info message">
          <code>{JSON.stringify(this.props.lunch)}</code>
        </div>
      </div>
    );

    return (
      <div className="ui list">
        { this.props.tested
            ? null
            : pendingMessage
        }
        {
          this.props.lunch
            ? lunchResult
            : null
        }
      </div>
    );
  }
}
