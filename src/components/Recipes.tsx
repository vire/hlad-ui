/// <reference path="../../node_modules/immutable/dist/immutable.d.ts" />

import * as React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Recipe from './Recipe';
import RecipeEditForm from './RecipeEditForm';
import * as Actions from '../redux/rootReducer';

interface RecipesProps {
  dispatch: any;
  recipes: Immutable.Iterable<any, any>;
  displayNewForm: boolean;
  currentTest: any;
  testerActive: boolean;
}

const mapStateToProps = state => ({
  displayNewForm: state.get('displayNewForm'),
  recipes: state.get('recipes'),
  currentTest: state.get('currentTest'),
  testerActive: state.get('testerActive'),
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

  handleTestNew(recipe) {
    this.props.dispatch(Actions.testNewRecipe(recipe));
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
            currentTest={this.props.currentTest}
            onTest={this.handleTestNew.bind(this)}
            onEdit={this.handleEdit.bind(this)}
            onSave={this.handleSave.bind(this)}
            onCancel={this.handleCancel.bind(this)}
            {...recipe.toJS()}/>
      )
    );

    const testerClass = classNames(
      'ui',
      {
        'green': this.props.testerActive,
        'red': !this.props.testerActive
      },
      'large label'
    );

    const content = (
      <div>
        <button className="ui secondary button"
                onClick={this.handleAddNew.bind(this)}>Add</button>
        <div className={testerClass}>recipe tester</div>
        { recipes }
      </div>
    );

    return (
      <div>
        {
          this.props.displayNewForm
            ? <RecipeEditForm
                 currentTest={this.props.currentTest}
                 onSave={this.handleSaveNew.bind(this)}
                 onTest={this.handleTestNew.bind(this)}
                 onCancel={this.handleCancelNew.bind(this)}/>
            : content
        }
      </div>
    );
  }
}

export default connect(mapStateToProps)(Recipes);
