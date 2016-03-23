import * as React from 'react';
import classNames from 'classnames';
import NewRecipeFrom from './NewRecipeFrom';

const style = require('./style.css');

interface IRecipeStructure {
  main?: any;
  side?: any;
}

interface ITestModel {
  name: string;
  URL: string;
  type: string;
  structure: IRecipeStructure;
  result?: any;
}

interface IRecipeModel {
  structure?: IRecipeStructure;
  URL: string;
  name: string;
  type: string;
  ID: string;
}

interface IRecipeProps extends IRecipeModel {
  editing: boolean;
  onEdit(ID: string): void;
  onCancel(ID: string): void;
  onSave(recipe: any): void;
  onTest(test: ITestModel): any;
  currentTest: ITestModel;
}

const formatURL = URL => URL.split(':')[1].slice(2);

export default class Recipe extends React.Component<IRecipeProps, {}> {

  handleClick() {
    this.props.onEdit(this.props.ID);
  }

  handleSave(test) {
    this.props.onSave(Object.assign({}, test, { id: this.props.ID }));
  }

  handleCancel() {
    this.props.onCancel(this.props.ID);
  }

  render() {
    if ( this.props.editing) {
      return (
        <NewRecipeFrom
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
                    <code>{JSON.stringify(this.props.structure)}</code>
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
