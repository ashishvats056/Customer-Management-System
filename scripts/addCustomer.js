import * as fn from "./functions.js"

window.onload = () => {
    if (!fn.checkTokenValue()) {
        window.location.href = "login.html";
    }
};
const customerAPI = 'https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp';

function fill_fields(event) {
    const queryString = location.search;
    const urlParams = new URLSearchParams(queryString);
    if(urlParams.has('uuid')){
        const fname = urlParams.get('fname');
        const lname = urlParams.get('lname');
        const street = urlParams.get('street');
        const address = urlParams.get('address');
        const city = urlParams.get('city');
        const state = urlParams.get('state');
        const email = urlParams.get('email');
        const phone = urlParams.get('phone');
        
        document.getElementsByName("FirstName")[0].value = fname;
        document.getElementsByName("LastName")[0].value = lname;
        document.getElementsByName("Street")[0].value = street;
        document.getElementsByName("Address")[0].value = address;
        document.getElementsByName("City")[0].value = city;
        document.getElementsByName("State")[0].value = state;
        document.getElementsByName("Email")[0].value = email;
        document.getElementsByName("Phone")[0].value = phone;
    }
}

function updateCustomerList(event) {
    event.preventDefault();
    const queryString = location.search;
    const urlParams = new URLSearchParams(queryString);
    let firstName = document.getElementsByName("FirstName")[0].value;
    let lastName = document.getElementsByName("LastName")[0].value;
    let street = document.getElementsByName("Street")[0].value;
    let address = document.getElementsByName("Address")[0].value;
    let city = document.getElementsByName("City")[0].value;
    let state = document.getElementsByName("State")[0].value;
    let email = document.getElementsByName("Email")[0].value;
    let phone = document.getElementsByName("Phone")[0].value;
    let customerData = {
        first_name: firstName,
        last_name: lastName,
        street: street,
        address: address,
        city: city,
        state: state,
        email: email,
        phone: phone
        };
    const token = fn.getTokenValue();
    if (urlParams.has('uuid')) {
        editCustomer(urlParams.get('uuid'), customerData, token);
    } else {
        createCustomer(customerData, token);
    }
}

async function createCustomer(customerData, token) {

    const response = await fetch(`${customerAPI}?cmd=create`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(customerData)
    });

    if (response.status === 201) {
        return 'Successfully Created';
    } else if (response.status === 400) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    } else {
        throw new Error('Failed to create customer. Please try again later.');
    }
}

async function editCustomer(uuid, customerData, token) {
    const response = await fetch(`${customerAPI}?cmd=update&uuid=${uuid}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: customerData
    });

    if (response.status === 200) {
        return 'Successfully Updated';
    } else if (response.status === 400) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    } else if (response.status === 500) {
        throw new Error('UUID not found');
    } else {
        throw new Error('Failed to update customer. Please try again later.');
    }
}
document.querySelector("input[type=submit]").addEventListener("click", updateCustomerList)
document.addEventListener('DOMContentLoaded',fill_fields)