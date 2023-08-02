import * as fn from "./functions.js"

const authenticationAPI = 'https://qa2.sunbasedata.com/sunbase/portal/api/assignment_auth.jsp';

window.onload = () => {
    if (fn.checkTokenValue()){
        window.location.href = "customerList.html";
    }
}

async function authenticateUser(event) {
    event.preventDefault()
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    const response = await fetch(authenticationAPI, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            login_id: email,
            password: password
        })
    });

    if (response.status === 200) {
        const data = await response.json();
        window.location.href = "customerList.html";
        setTokenValue(data.token);
    } else if (response.status === 401) {
        throw new Error('Invalid Authorization: Please check your credentials.');
    } else {
        throw new Error('Authentication failed. Please try again later.');
    }
}

function setTokenValue(cvalue) {
    const d = new Date();
    d.setTime(d.getTime() + (2 * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = "token=" + cvalue + ";" + expires + ";path=/";
}

document.querySelector("input[type=submit]").addEventListener("click",authenticateUser);