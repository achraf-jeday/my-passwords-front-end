import * as actionTypes from '../actionTypes';
import axios from 'axios';
import querystring from 'querystring';

export const getAccessToken = (email, password) => async dispatch => {

    const data = {
        grant_type: "password",
        client_id: "3aa7c57d-21d7-4117-974e-ab60c82a24fd",
        client_secret: "SuperSecret123&",
        scope: "customer",
        username: email,
        password: password
    };

    try {
        const response = await axios.post(`http://dev.passwordlocker.loc/oauth/token`, querystring.stringify(data));
        dispatch({
            type: actionTypes.GET_TOKEN,
            payload: response.data.access_token
        });
    }
    catch(e) {
        dispatch({
            type: actionTypes.TOKEN_ERROR,
            payload: console.log(e),
        })
    }

}

export const deleteAccessToken = () => async dispatch => {
   dispatch({
      type: actionTypes.DELETE_TOKEN
   })
}

export const getCSRFToken = () => async dispatch => {

    try {
        const response = await axios.get(`http://dev.passwordlocker.loc/session/token`);
        dispatch( {
            type: actionTypes.GET_CSRF_TOKEN,
            payload: response.data
        });
    }
    catch(e) {
        dispatch( {
            type: actionTypes.CSRF_TOKEN_ERROR,
            payload: console.log(e),
        })
    }

}

export const registerUser = (name, mail, csrf) => async dispatch => {

    const data = JSON.stringify({
      "name": {
        "value": name
      },
      "mail": {
        "value": mail
      },
      "pass": {
        "value": "SuperSecret123&"
      }
    });

    let config = {
        headers: {
            'Content-type': 'application/json',
            'X-CSRF-Token': csrf
        }
    }

    try {
        const response = await axios.post(`http://dev.passwordlocker.loc/user/register?_format=json`, data, config);
        dispatch( {
            type: actionTypes.REGISTER,
            payload: response
        });
    }
    catch(e) {
        dispatch( {
            type: actionTypes.REGISTER_ERROR,
            payload: console.log(e),
        })
    }

}

export const registerEmail = (mail) => async dispatch => {

    const data = JSON.stringify({
        "mail": mail
    });

    let config = {
        headers: {
            'Content-type': 'application/json'
        }
    }

    try {
        const response = await axios.post(`http://dev.passwordlocker.loc/user/lost-password?_format=json`, data, config);
        dispatch( {
            type: actionTypes.REGISTER_EMAIL,
            payload: response
        });
    }
    catch(e) {
        dispatch( {
            type: actionTypes.REGISTER_EMAIL_ERROR,
            payload: console.log(e),
        })
    }

}

export const resetPass = (name, temp_pass, new_pass) => async dispatch => {

    const data = JSON.stringify({
        "name": name,
        "temp_pass": temp_pass,
        "new_pass": new_pass
    });

    let config = {
        headers: {
            'Content-type': 'application/json'
        }
    }

    try {
        const response = await axios.post(`http://dev.passwordlocker.loc/user/lost-password-reset?_format=json`, data, config);
        dispatch( {
            type: actionTypes.RESET_PASSWORD,
            payload: response
        });
    }
    catch(e) {
        dispatch( {
            type: actionTypes.RESET_PASSWORD_ERROR,
            payload: console.log(e),
        })
    }

}
