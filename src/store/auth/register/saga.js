import { takeEvery, fork, put, all, call } from 'redux-saga/effects';

//Account Redux states
import { REGISTER_USER } from './actionTypes';
import { registerUserSuccessful, registerUserFailed } from './actions';

//Include Both Helper File with needed methods
import { getFirebaseBackend } from '../../../helpers/firebase_helper';
import { postRegister } from '../../../helpers/fakebackend_helper';

// initialize relavant method of both Auth
const fireBaseBackend = getFirebaseBackend();

// Is user register successfull then direct plot user in redux.
function* registerUser({ payload: { user } }) {
    try {
    	if(process.env.REACT_APP_DEFAULTAUTH === "firebase")
    	{
           const response = yield call(fireBaseBackend.registerUser, user.email, user.password);
           yield put(registerUserSuccessful(response));
    	}
    	else
    	{
            const response = yield call(postRegister, '/post-register', user);
            yield put(registerUserSuccessful(response));
    	}
    } catch (error) {
        yield put(registerUserFailed(error));
    }
}

export function* watchUserRegister() {
    yield takeEvery(REGISTER_USER, registerUser);
}

function* accountSaga() {
    yield all([fork(watchUserRegister)]);
}

export default accountSaga;