import * as React from 'react';
import * as jsyaml from 'js-yaml';
import classNames from 'classnames';
import TestResult from './TestResult';

abstract class NewRecipeFromState {
  name: string;
  URL: string;
  recipeType: string;
  structure: any;
  structureText: string;
  structureError: Error;
}

abstract class NewRecipeFromProps {
  onCancel: any;
  onSave: any;
  onTest: any;
  currentTest: any;
}

export default class NewRecipeFrom extends React.Component<NewRecipeFromProps , NewRecipeFromState> {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      URL: '',
      recipeType: 'standard',
      structureText: '',
      structureError: null,
      structure: null,
    };
  }

  handleChangeName(event) {
    const newState = Object.assign({}, this.state, {
      name: event.target.value,
    });

    this.setState(newState);
  }

  handleChangeURL(event) {
    const newState = Object.assign({}, this.state, {
      URL: event.target.value,
    });

    this.setState(newState);
  }

  handleChangeType(event) {
    const newState = Object.assign({}, this.state, {
      recipeType: event.target.value,
    });

    this.setState(newState);
  }

  handleChangeStructure(event) {
    const newState = Object.assign({}, this.state, {
      structureText: event.target.value,
    });

    this.setState(newState);
  }

  handleClickDiscard() {
    this.props.onCancel();
  }

  handleClickSave() {
    // validate structure - JSON.parse, show error message
    const { name, URL, recipeType, structure } = this.state;

    if (name.length > 3) {
      this.props.onSave({
        name,
        URL,
        type: recipeType,
        structure
      });
    } else {
      this.setState(Object.assign({}, this.state, {
        nameErrorMessage: 'Name must be longer than 3 chars',
      }));
    }
  }

  handleClickTest() {
    const { name, URL, recipeType, structure } = this.state;

    this.props.onTest({
        name,
        URL,
        type: recipeType,
        structure
      });
  }

  handleBlur(event) {
    let structure = null;
    let structureError = null;

    try {
      structure = jsyaml.safeLoad(event.target.value);
    } catch (err) {
      structureError = err;
    }

    const newState = Object.assign({}, this.state, {
      structureError,
      structure,
    });

    this.setState(newState);
  }

  render() {
    return (
      <div className="ui segment">
        <div className="ui list">
          <div className={classNames('ui form', { error: !!this.state.structureError})}>
            <div className="field">
              <label>Name</label>
              <input type="text" onChange={this.handleChangeName.bind(this)} value={this.state.name}/>
            </div>
            <div className="field">
              <label>URL</label>
              <input type="text" onChange={this.handleChangeURL.bind(this)} value={this.state.URL}/>
            </div>
            <div className="field">
              <label>Type</label>
              <select className="ui dropdown" onChange={this.handleChangeType.bind(this)} value={this.state.recipeType}>
                <option value="standard">Standard</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <div className={classNames('field', {error: !!this.state.structureError})}>
              <button className="ui labeled icon button">
                <i className="add square icon"></i>
                Add
              </button>
              <label>Text</label>
              <textarea
                onBlur={this.handleBlur.bind(this)}
                onChange={this.handleChangeStructure.bind(this)}
                value={this.state.structureText}/>
              {
                this.state.structureError
                  ? (
                      <div className="ui error message">
                        <p>{this.state.structureError.message}</p>
                      </div>
                    )
                  : null
              }
            </div>
            {
              this.props.currentTest
                ? (
                    <div className="field">
                      <TestResult {...this.props.currentTest}/>
                    </div>
                  )
                : null
            }
          </div>
          <br></br>
          <div className="ui primary button" onClick={this.handleClickSave.bind(this)}>Save</div>
          <div className="ui teal button" onClick={this.handleClickTest.bind(this)}>Test</div>
          <div className="ui button" onClick={this.handleClickDiscard.bind(this)}>Discard</div>
        </div>
      </div>
    );
  }
}
