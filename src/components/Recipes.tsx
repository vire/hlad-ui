/// <reference path="../../node_modules/immutable/dist/immutable.d.ts" />
import * as React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { autobind } from 'core-decorators';

import Recipe from './Recipe';
import RecipeEditForm from './RecipeEditForm';
import * as Actions from '../redux/rootReducer';

type RecipesProps = {
  dispatch?: any;
  displayNewForm: boolean;
  recipes: Immutable.Iterable<any, any>;
  currentTest: any;
  agentActive: boolean;
}

const mapStateToProps = (state: any): RecipesProps => ({
  displayNewForm: state.get('displayNewForm'),
  recipes: state.get('recipes'),
  currentTest: state.get('currentTest'),
  agentActive: state.get('agentActive'),
});

export class Recipes extends React.Component<RecipesProps, {}> {

  @autobind
  handleEdit(recipe) {
    this.props.dispatch(Actions.showEditForm(recipe));
  }

  @autobind
  handleSave(recipe) {
    this.props.dispatch(Actions.updateRecipe(recipe));
  }

  @autobind
  handleSaveNew(recipe) {
    this.props.dispatch(Actions.saveRecipe(recipe));
  }

  @autobind
  handleTestNew(recipe) {
    this.props.dispatch(Actions.testNewRecipe(recipe));
  }

  @autobind
  handleCancel(id) {
    this.props.dispatch(Actions.cancelEditForm(id));
  }

  @autobind
  handleCancelNew() {
    this.props.dispatch(Actions.cancelNewForm());
  }

  @autobind
  handleAddNew() {
    this.props.dispatch(Actions.showNewRecipeForm());
  }

  @autobind
  handlePublish() {
    this.props.dispatch(Actions.publish());
  }

  render() {
    const { agentActive, currentTest, displayNewForm } = this.props;

    const recipes = this.props.recipes.toArray().map(
      (recipe, idx) => (
        <Recipe key={idx}
            currentTest={currentTest}
            onTest={this.handleTestNew}
            onEdit={this.handleEdit}
            onSave={this.handleSave}
            onCancel={this.handleCancel}
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
          !displayNewForm
            ? (<button className="ui secondary button"
                       onClick={this.handleAddNew}>Add</button>)
            : null
        }
        <button className="ui secondary button disabled"
                onClick={this.handlePublish}>Publish</button>
        {
          displayNewForm
            ? <RecipeEditForm
                 currentTest={currentTest}
                 onSave={this.handleSaveNew}
                 onTest={this.handleTestNew}
                 onCancel={this.handleCancelNew}/>
            : recipes
        }
      </div>
    );
  }
}

export default connect(mapStateToProps)(Recipes as any);
