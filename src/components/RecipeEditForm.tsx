import * as React from 'react';

interface IRecipeEditFormProps {
  editing: boolean;
  id: string;
  url: string;
  name: string;
  type: string;
  structure?: any;
  onSave: any;
}

interface IRecipeEditFormState {
  name: string;
  nameErrorMessage: string;
  recipeType: string;
  structure: string;
  URL: string;
}

export default class RecipeEditForm extends React.Component<IRecipeEditFormProps, IRecipeEditFormState> {

  constructor(props) {
    super(props);
    this.state = {
      name: props.name || '',
      nameErrorMessage: '',
      URL: props.url || '',
      recipeType: props.type || 'standard',
      structure: props.structure || '',
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
      structure: event.target.value,
    });

    this.setState(newState);
  }

  handleClickDiscard() {
    throw 'Not yet implemented';
  }

  handleClickSave() {
    // validate structure - JSON.parse, show error message
    const { name, URL, recipeType, structure } = this.state;

    if (name.length > 3) {
      this.props.onSave({
        id: this.props.id,
        name,
        URL,
        recipeType,
        structure
      });
    } else {
      this.setState(Object.assign({}, this.state, {
        nameErrorMessage: 'Name must be longer than 3 chars',
      }));
    }
  }

  render() {
    return (
      <div className="ui segment">
        <div className="ui list">
          <div className="ui form">
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
            <div className="field">
              <label>Text</label>
              <textarea
                  onChange={this.handleChangeStructure.bind(this)}
                  value={this.state.structure}/>
            </div>
          </div>
          <br></br>
          <div className="ui primary button" onClick={this.handleClickSave.bind(this)}>Save</div>
          <div className="ui button" onClick={this.handleClickDiscard.bind(this)}>Discard</div>
        </div>
      </div>
    );
  }
}
