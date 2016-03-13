import * as React from 'react';

interface RecipeEditFormProps {
  editing: boolean;
  url: string;
  name: string;
  type: string;
  structure?: any;
}

export default class RecipeEditForm extends React.Component<RecipeEditFormProps, {}> {
  render() {
    return (
      <div className="ui segment">
        <div className="ui list">
          <div className="ui form">
            <div className="field">
              <label>Name</label>
              <input type="text" value={this.props.name}/>
            </div>
            <div className="field">
              <label>URL</label>
              <input type="text" value={this.props.url}/>
            </div>
            <div className="field">
              <label>Type</label>
              <select className="ui dropdown">
                <option value="1">Standard</option>
                <option value="0">Custom</option>
              </select>
            </div>
            <div className="field">
              <label>Text</label>
              <textarea value={JSON.stringify(this.props.structure, null, 4)}/>
            </div>
          </div>
          <br></br>
          <div className="ui primary button">Save</div>
          <div className="ui button">Discard</div>
        </div>
      </div>
    );
  }
}
