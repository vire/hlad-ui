import * as React from 'react';
import { connect } from 'react-redux';

import Recipes from '../components/Recipes';

type RootProps = {
  appMounted: any;
}

const mapDispatchToProps = (dispatch) => ({
  appMounted() {
    return dispatch({
      type: 'ROOT_MOUNTED',
    });
  }
});

export class Root extends React.Component<RootProps, any> {

  componentDidMount() {
    this.props.appMounted();
  }

  render() {
    return (
      <div className="ui container">
        <Recipes/>
      </div>
    );
  }
}

export default connect(undefined, mapDispatchToProps)(Root as any);
