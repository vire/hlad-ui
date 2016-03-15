/// <reference path="../../node_modules/immutable/dist/immutable.d.ts" />

import * as React from 'react';
import { connect } from 'react-redux';
import Recipe from './Recipe';

interface RecipesProps {
  dispatch: any;
  recipes: Immutable.Iterable<any, any>;
}

const fooAction = payload => ({ type: 'CLICKED_EDIT_RECIPE', payload });

const saveRecipe = payload => ({ type: 'CLICKED_RECIPE_SAVE', payload });

const mapStateToProps = state => ({
  recipes: state.get('recipes'),
});

export class Recipes extends React.Component<RecipesProps, {}> {

  handleEdit(recipe) {
    this.props.dispatch(fooAction(recipe));
  }

  handleSave(recipe) {
    this.props.dispatch(saveRecipe(recipe));
  }

  render() {
    const recipes = this.props.recipes.toArray().map(
      (recipe, idx) => (
        <Recipe key={idx}
            onEdit={this.handleEdit.bind(this)}
            onSave={this.handleSave.bind(this)}
            {...recipe.toJS()}/>
      )
    );

    return (
      <div>{ recipes }</div>
    );
  }
}

export default connect(mapStateToProps)(Recipes);
