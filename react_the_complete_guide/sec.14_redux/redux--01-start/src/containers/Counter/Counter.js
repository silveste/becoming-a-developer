import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actionTypes from '../../store/actions';
import CounterControl from '../../components/CounterControl/CounterControl';
import CounterOutput from '../../components/CounterOutput/CounterOutput';

class Counter extends Component {
    render () {
        return (
            <div>
                <CounterOutput value={this.props.ctr} />
                <CounterControl label="Increment" clicked={this.props.onIncrementCounter} />
                <CounterControl label="Decrement" clicked={this.props.onDecrementCounter}  />
                <CounterControl label="Add 5" clicked={this.props.onAddCounter}  />
                <CounterControl label="Subtract 5" clicked={this.props.onSubstractCounter}  />
                <hr />
                <button onClick={() => this.props.onStoreResult(this.props.ctr)}>Store Result</button>
                <ul>
                  {this.props.historyResults.map(result => (
                    <li key={result.id} onClick={() => this.props.onDeleteResult(result.id)}>{result.value}</li>
                  ))}
                </ul>
            </div>
        );
    }
}

const mapStateToProps = state => {
  return {
    ctr: state.ctr.counter,
    historyResults: state.res.results
  };
}

const mapDispatchToProps = dispatch => {
  return {
    onIncrementCounter: () => dispatch({type: actionTypes.INCREMENT}),
    onDecrementCounter: () => dispatch({type: actionTypes.DECREMENT}),
    onAddCounter: () => dispatch({type: actionTypes.ADD, payload: 10}),
    onSubstractCounter: () => dispatch({type: actionTypes.SUBSTRACT, payload: 10}),
    onStoreResult: (res) => dispatch({type: actionTypes.STORE_RESULT, payload: res}),
    onDeleteResult: (id) => dispatch({type: actionTypes.DELETE_RESULT, payload: id}),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Counter);