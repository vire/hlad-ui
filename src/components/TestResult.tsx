import * as React from 'react';

interface ITestResultProps {
  result: any;
}

export default class TestResult extends React.Component<ITestResultProps, {}> {
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
          <code>{JSON.stringify(this.props.result)}</code>
        </div>
      </div>
    );

    return (
      <div className="ui list">
        {
          this.props.result
            ? lunchResult
            : pendingMessage
        }
      </div>
    );
  }
}
