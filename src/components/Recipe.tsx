import * as React from 'react';
import * as jsyaml from 'js-yaml';
import classNames from 'classnames';
import RecipeEditForm from './RecipeEditForm';
import { RecipeModel } from '../models/recipe';
import { TestModel } from '../models/test';
const style = require('./style.css');

interface RecipeProps extends RecipeModel {
  editing: boolean;
  onEdit(ID: string): void;
  onCancel(ID: string): void;
  onSave(recipe: any): void;
  onTest(test: TestModel): any;
  currentTest: TestModel;
}

const formatURL = URL => URL.split(':')[1].slice(2);

export default class Recipe extends React.Component<RecipeProps, {}> {

  handleClick() {
    this.props.onEdit(this.props.ID);
  }

  handleSave(test) {
    this.props.onSave(Object.assign({}, test, { id: this.props.ID }));
  }

  handleCancel() {
    this.props.onCancel(this.props.ID);
  }

  getStructureString(structure) {
    let structureString = '';
    try {
      structureString = jsyaml.safeDump(structure);
    } catch (parseError) {
      // TODO display some message about broken structure
      console.error(`YAML Parsing failed: ${parseError.message}`);
    }

    return structureString;
  }

  render() {
    if ( this.props.editing) {
      return (
        <RecipeEditForm
          onSave={this.handleSave.bind(this)}
          onCancel={this.handleCancel.bind(this)}
          onTest={this.props.onTest}
          currentTest={this.props.currentTest}
          name={this.props.name}
          URL={this.props.URL}
          structure={this.props.structure}
          type={this.props.type}
        />
      );
    }

    return (
      <div className="ui segment">
        <div className="ui list">
          <div className="item">
            <div className="ui small header">
              {this.props.name}
              <span className={classNames('ui', { blue: this.props.type === 'custom'}, 'small', 'label')}>
                {this.props.type}
              </span>
              <i className={classNames([style.edit], 'tiny configure icon')} onClick={this.handleClick.bind(this)}/>
            </div>
          </div>
          <div className="item">
            <a href={this.props.URL} target="_blank">{formatURL(this.props.URL)}</a>
          </div>
          { this.props.structure
            ? (
                <div className="item">
                  <div className="ui info message">
                    <code className={style.structure}>{this.getStructureString(this.props.structure)}</code>
                  </div>
                </div>
              )
            : null
          }
        </div>
      </div>
    );
  }
}
