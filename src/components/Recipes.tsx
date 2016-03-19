/// <reference path="../../node_modules/immutable/dist/immutable.d.ts" />

import * as React from 'react';
import { connect } from 'react-redux';
import Recipe from './Recipe';
import NewRecipeFrom from './NewRecipeFrom';
import * as Actions from '../redux/rootReducer';

interface RecipesProps {
  dispatch: any;
  recipes: Immutable.Iterable<any, any>;
  displayNewForm: boolean;
}

const mapStateToProps = state => ({
  displayNewForm: state.get('displayNewForm'),
  recipes: state.get('recipes'),
});

export class Recipes extends React.Component<RecipesProps, {}> {

  handleEdit(recipe) {
    this.props.dispatch(Actions.showEditForm(recipe));
  }

  handleSave(recipe) {
    this.props.dispatch(Actions.updateRecipe(recipe));
  }

  handleSaveNew(recipe) {
    this.props.dispatch(Actions.saveRecipe(recipe));
  }

  handleCancel(id) {
    this.props.dispatch(Actions.cancelEditForm(id));
  }

  handleCancelNew() {
    this.props.dispatch(Actions.cancelNewForm());
  }

  handleAddNew() {
    this.props.dispatch(Actions.showNewRecipeForm());
  }

  render() {
    const recipes = this.props.recipes.toArray().map(
      (recipe, idx) => (
        <Recipe key={idx}
            onEdit={this.handleEdit.bind(this)}
            onSave={this.handleSave.bind(this)}
            onCancel={this.handleCancel.bind(this)}
            {...recipe.toJS()}/>
      )
    );

    const content = (
      <div>
        <button className="ui secondary button"
                onClick={this.handleAddNew.bind(this)}>Add</button>
        { recipes }
      </div>
    );

    return (
      <div>
        {
          this.props.displayNewForm
            ? <NewRecipeFrom
                 onSave={this.handleSaveNew.bind(this)}
                 onCancel={this.handleCancelNew.bind(this)}/>
            : content
        }
      </div>
    );
  }
}

export default connect(mapStateToProps)(Recipes);
