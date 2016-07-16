/// <reference path="../../node_modules/immutable/dist/immutable.d.ts" />
import * as React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { autobind } from 'core-decorators';

import Recipe from './Recipe';
import RecipeEditForm from './RecipeEditForm';
import {
  cancelNewForm,
  cancelEditForm,
  publishRecipes,
  saveRecipe,
  showEditForm,
  showNewRecipeForm,
  requestTesting,
  updateRecipe
} from '../redux/recipes';
const style = require('./style.css');

type RecipesProps = {
  dispatch?: any;
  displayNewForm: boolean;
  recipes: Immutable.Iterable<any, any>;
  agentActive: boolean;
  saving: boolean;
  testing: boolean;
  testResult: any // TODO typings
}

const mapStateToProps = (state: any): RecipesProps => ({
  displayNewForm: state.get('displayNewForm'),
  recipes: state.get('recipes'),
  agentActive: state.get('agentActive'),
  saving: state.get('saving'),
  testing: state.get('testing'),
  testResult: state.get('testResult'),
});

export class Recipes extends React.Component<RecipesProps, {}> {

  @autobind
  handleEdit(recipe) {
    this.props.dispatch(showEditForm(recipe));
  }

  @autobind
  handleSave(recipe) {
    this.props.dispatch(updateRecipe(recipe));
  }

  @autobind
  handleSaveNew(recipe) {
    this.props.dispatch(saveRecipe(recipe));
  }

  @autobind
  handleTestRequest(recipe) {
    this.props.dispatch(requestTesting(recipe));
  }

  @autobind
  handleCancel(id) {
    this.props.dispatch(cancelEditForm(id));
  }

  @autobind
  handleCancelNew() {
    this.props.dispatch(cancelNewForm());
  }

  @autobind
  handleAddNew() {
    this.props.dispatch(showNewRecipeForm());
  }

  @autobind
  handlePublish() {
    this.props.dispatch(publishRecipes());
  }

  render() {
    const { agentActive, displayNewForm, saving, testing, testResult } = this.props;

    const recipes = this.props.recipes.toArray().map(
      (recipe, idx) => (
        <Recipe key={idx}
            onTest={this.handleTestRequest}
            onEdit={this.handleEdit}
            onSave={this.handleSave}
            onCancel={this.handleCancel}
            saving={saving}
            testing={testing}
            testResult={testResult}
            {...recipe.toJS()}/>
      )
    );

    const testerClass = classNames(
      'ui',
      {
        'green': agentActive,
        'red': !agentActive
      },
      'empty circular label'
    );

    return (
      <div>
        <div className="ui grid">
          <div className="four column row">
            <div className="left floated column">
              <button className="ui button"
                      onClick={this.handlePublish}>Publish</button>
              {
                !displayNewForm
                  ? (<button className="ui button"
                             onClick={this.handleAddNew}>Add</button>)
                  : null
              }
            </div>
            <div className="right aligned floated column">
              <div className={`ui segment ${style.indicator}`}>
                <div className={testerClass}></div> Agent
              </div>
            </div>
          </div>
          <div className="row">
            <div className="sixteen wide column">
              {
                displayNewForm
                  ? <RecipeEditForm
                  onSave={this.handleSaveNew}
                  onTest={this.handleTestRequest}
                  onCancel={this.handleCancelNew}
                  saving={saving}
                  testing={testing}
                  testResult={testResult}/>
                  : recipes
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Recipes as any);
