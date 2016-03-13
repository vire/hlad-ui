import * as React from 'react';
import Recipes from './Recipes';

interface AppProps {}

export default class App extends React.Component<AppProps, {}> {

  render() {
    return (
      <div>
        <Recipes/>
      </div>
    );
  }
}
