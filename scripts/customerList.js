import * as fn from "./functions.js"

window.onload = () => {
    if (!fn.checkTokenValue()) {
        window.location.href = "login.html";
    }
}
const customerAPI = 'https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp';

async function getCustomerList() {
    const token = fn.getTokenValue();
    const response = await fetch(`${customerAPI}?cmd=get_customer_list`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (response.status === 200) {
        const data = await response.json();
        return data;
    } else {
        throw new Error('Failed to get customer list. Please try again later.');
    }
}

function display_customer_list() {
    const data = getCustomerList();
    let tableBody = document.getElementById("customerlist")
    data.forEach(customer => {
        var row = tableBody.insertRow();

        var cellFirstName = row.insertCell();
        var cellLastName = row.insertCell();
        var cellStreet = row.insertCell();
        var cellAddress = row.insertCell();
        var cellCity = row.insertCell();
        var cellState = row.insertCell();
        var cellEmail = row.insertCell();
        var cellPhone = row.insertCell();
        var cellActions = row.insertCell();

        cellFirstName.textContent = customer.first_name;
        cellLastName.textContent = customer.last_name;
        cellStreet.textContent = customer.street;
        cellAddress.textContent = customer.address;
        cellCity.textContent = customer.city;
        cellState.textContent = customer.state;
        cellEmail.textContent = customer.email;
        cellPhone.textContent = customer.phone;
        var uuid = customer.uuid;
        var edit_button = document.createElement("button");
        edit_button.textContent = "Edit";
        edit_button.addEventListener("click",edit_customer);
        var delete_button = document.createElement("button");
        delete_button.textContent = "Delete";
        delete_button.addEventListener("click",delete_customer);

        cellActions.appendChild(edit_button);
        cellActions.appendChild(delete_button);
        cellActions.id = uuid;
    });
}

function edit_customer(event) {
    const uuid = event.target.parentElement.id;
    const row = event.target.parentElement.parentElement.children;
    window.location.href = `addCustomer.html?uuid=${uuid}&fname=${row[0].textContent}&lname=${row[1].textContent}&street=${row[2].textContent}&address=${row[3].textContent}&city=${row[4].textContent}&state=${row[5].textContent}&email=${row[6].textContent}&phone=${row[7].textContent}`;
}

async function delete_customer(event) {
    const token = fn.getTokenValue();
    const uuid = event.target.parentElement.id;
    const response = await fetch(`${customerAPI}?cmd=delete&uuid=${uuid}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (response.status === 200) {
        return 'Successfully deleted';
    } else if (response.status === 400) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    } else if (response.status === 500) {
        throw new Error('Error: Not deleted');
    } else {
        throw new Error('Failed to delete customer. Please try again later.');
    }
}
document.addEventListener('DOMContentLoaded',display_customer_list)