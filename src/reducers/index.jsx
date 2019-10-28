import {combineReducers} from 'redux';
import history from './history_reducer';
import techStack from './techStack_reducer';

const rootReducer = combineReducers({
    history, techStack
});

export default rootReducer;