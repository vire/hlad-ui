import * as React from 'react';
import classNames from 'classnames';
import RecipeEditForm from './RecipeEditForm';

const style = require('./style.css');

interface RecipeProps {
  editing: boolean;
  URL: string;
  name: string;
  type: string;
  ID: string;
  structure?: any;
  onEdit: any;
  onCancel: any;
  onSave: any;
}

const formatURL = URL => URL.split(':')[1].slice(2);

export default class Recipe extends React.Component<RecipeProps, {}> {

  handleClick() {
    this.props.onEdit(this.props.ID);
  }

  render() {
    if ( this.props.editing) {
      return (<RecipeEditForm {...this.props}/>);
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
