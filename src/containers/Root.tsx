import * as React from 'react';
import { connect } from 'react-redux';
import { Observable } from 'rxjs/Observable';

import Recipes from '../components/Recipes';
import * as Constants from '../constants';

type RootProps = {
  appMounted: any;
}

const mapDispatchToProps = (dispatch) => ({
  appMounted() {
    dispatch(() => Observable.of({ type: Constants.ROOT_MOUNTED }));
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
