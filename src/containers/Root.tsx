import * as React from 'react';
import { connect } from 'react-redux';
import Recipes from '../components/Recipes';

const initAction = () => {
  return {
    type: 'ROOT_MOUNTED',
  };
};

export class Root extends React.Component<any, void> {

  componentWillMount() {
    this.props.dispatch(initAction());
  }

  render() {
    return (
      <div className="ui container">
        <Recipes/>
      </div>
    );
  }
}

export default connect()(Root);
