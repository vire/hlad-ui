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
  agentActive: boolean;
}

const mapStateToProps = state => ({
  displayNewForm: state.get('displayNewForm'),
  recipes: state.get('recipes'),
  currentTest: state.get('currentTest'),
  agentActive: state.get('agentActive'),
});

export class Recipes extends React.Component<any, {}> {

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

  handlePublish() {
    this.props.dispatch(Actions.publish());
  }

  render() {
    const { agentActive } = this.props;

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
        'green': agentActive,
        'red': !agentActive
      },
      'large label'
    );

    return (
      <div>
        <div className={testerClass}>{agentActive ? 'READY' : 'N/A'}</div>
        {
          !this.props.displayNewForm
            ? (<button className="ui secondary button"
                       onClick={this.handleAddNew.bind(this)}>Add</button>)
            : null
        }
        <button className="ui secondary button disabled"
                onClick={this.handlePublish.bind(this)}>Publish</button>
        {
          this.props.displayNewForm
            ? <RecipeEditForm
                 currentTest={this.props.currentTest}
                 onSave={this.handleSaveNew.bind(this)}
                 onTest={this.handleTestNew.bind(this)}
                 onCancel={this.handleCancelNew.bind(this)}/>
            : recipes
        }
      </div>
    );
  }
}

export default connect(mapStateToProps)(Recipes);
