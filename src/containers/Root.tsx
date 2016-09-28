import * as React from 'react';
import { connect } from 'react-redux';

import Recipes from '../components/Recipes';
import { appMounted } from '../redux/application';

type RootProps = {
  appMounted: any;
}

export class Root extends React.Component<RootProps, any> {

  componentDidMount() {
    this.props.appMounted();
  }

  render() {
    return (
      <div className="ui container" style={{marginTop: '20px'}}>
        <Recipes/>
      </div>
    );
  }
}

export default connect(() => ({}), { appMounted })(Root as any);
