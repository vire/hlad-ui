import * as React from 'react';
import * as jsyaml from 'js-yaml';
import classNames from 'classnames';
import { autobind } from 'core-decorators';

import TestResult from './TestResult';

type RecipeEditFormState = {
  name: string;
  URL: string;
  recipeType: string;
  structure: any;
  structureText: string;
  structureError: Error;
}

type RecipeEditFormProps = {
  onCancel: any;
  onSave: any;
  onTest: any;
  name?: string;
  currentTest: any;
  structure?: any;
  URL?: string;
  type?: string;
}

class RecipeEditForm extends React.Component<RecipeEditFormProps, RecipeEditFormState> {

  constructor(props) {
    super(props);
    const safeDump = jsyaml.safeDump as any; // TODO remove when typings are updated

    const structureText = props.structure ? safeDump(props.structure, { lineWidth: 120 }) : '';

    this.state = {
      name: props.name || '',
      URL: props.URL || '',
      recipeType: props.type || 'standard',
      structureText,
      structure: props.structure || null,
      structureError: null,
    };
  }

  @autobind
  handleChangeName(event) {
    const newState = Object.assign({}, this.state, {
      name: event.target.value,
    });

    this.setState(newState);
  }

  @autobind
  handleChangeURL(event) {
    const newState = Object.assign({}, this.state, {
      URL: event.target.value,
    });

    this.setState(newState);
  }

  @autobind
  handleChangeType(event) {
    const newState = Object.assign({}, this.state, {
      recipeType: event.target.value,
    });

    this.setState(newState);
  }

  @autobind
  handleChangeStructure(event) {
    let structureError;
    let structure;

    try {
      structure = jsyaml.safeLoad(event.target.value);
    } catch (err) {
      structureError = err;
    }
    const newState = Object.assign({}, this.state, {
      structure,
      structureError,
      structureText: event.target.value,
    });

    this.setState(newState);
  }

  @autobind
  handleClickDiscard() {
    this.props.onCancel();
  }

  @autobind
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

  @autobind
  handleClickTest() {
    const { name, URL, recipeType, structure } = this.state;

    this.props.onTest({
        name,
        URL,
        type: recipeType,
        structure
      });
  }

  @autobind
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
    const hasStructureError = !!this.state.structureError;

    return (
      <div className="ui segment">
        <div className="ui list">
          <div className={classNames('ui form', { error: hasStructureError})}>
            <div className="field">
              <label>Name</label>
              <input type="text" onChange={this.handleChangeName} value={this.state.name}/>
            </div>
            <div className="field">
              <label>URL</label>
              <input type="text" onChange={this.handleChangeURL} value={this.state.URL}/>
            </div>
            <div className="field">
              <label>Type</label>
              <select className="ui dropdown" onChange={this.handleChangeType} value={this.state.recipeType}>
                <option value="standard">Standard</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <div className={classNames('field', {error: hasStructureError})}>
              <label>Recipe</label>
              <textarea
                onBlur={this.handleBlur}
                onChange={this.handleChangeStructure}
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
            <small>
              <a href="http://nodeca.github.io/js-yaml/" rel="noreferrer" target="_blank" >Need help with YAML syntax?</a>
            </small>
            {
              this.props.currentTest
                ? (
                    <div className="field">
                      <TestResult {...this.props.currentTest.toJS()}/>
                    </div>
                  )
                : null
            }
          </div>
          <br></br>
          <div className={classNames('ui primary button', { disabled: hasStructureError })}
               onClick={this.handleClickSave}>Save</div>
          <div className={classNames('ui teal button', { disabled: hasStructureError })}
               onClick={this.handleClickTest}>Test</div>
          <div className="ui button" onClick={this.handleClickDiscard}>Discard</div>
        </div>
      </div>
    );
  }
}

export default RecipeEditForm;
