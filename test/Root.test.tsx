import * as React from 'react';
import * as TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';

import { Root } from '../src/containers/Root';

describe('Root', () => {
  it('should render', () => {
    const renderer = TestUtils.createRenderer();
    renderer.render(<Root appMounted={() => ({type: 'xxx'})}/>);
    const result = renderer.getRenderOutput();
    expect(result).to.be.ok;
  });
});
