const mainForm = document.querySelector("#main_form")
const list = document.querySelector(".items")


const name = document.querySelector("#person_name")
const email = document.querySelector("#person_email")
const phone = document.querySelector("#person_phone")
const bookNowBtn = document.getElementById('submit')
const saveBtn = document.querySelector('.save-btn')

/* -------------------------------------------------------------------------- */
/*                       Fetching Data on Every Refresh                       */
/* -------------------------------------------------------------------------- */


window.addEventListener("DOMContentLoaded", () => {
    axios.get("https://crudcrud.com/api/0cf8d1500e3b4f30ad46b8cf137cb159/BookedAppointments")
        .then((res) => {
            // console.log(res)
            for (let i = 0; i < res.data.length; i++) {
                if ((list.firstElementChild.className == "list_heading")) {
                    list.removeChild(list.firstElementChild)
                }
                list.innerHTML += ` <li class='listitems'><span class="idtoken">${res.data[i]._id}</span><span>${res.data[i].person_Name}</span> <span>${res.data[i].person_Email}</span> <span>${res.data[i].person_Phone}</span><button class="edit-btn">Edit</button><button class='listitems_btn'>X</button></li> `
            }
        })
        .catch((err) => console.log(err))

})





/* -------------------------------------------------------------------------- */
/*                     Function to Add items into Server                      */
/* -------------------------------------------------------------------------- */

mainForm.addEventListener("submit", additem)
async function additem(e) {
    e.preventDefault()
    try {
        if (bookNowBtn.value == "Book Now") {
            let itemObj = {
                person_Name: name.value,
                person_Email: email.value,
                person_Phone: phone.value

            }
            //creating destruction to get the actual data from the obj
            const { data } = await axios.post('https://crudcrud.com/api/0cf8d1500e3b4f30ad46b8cf137cb159/BookedAppointments', itemObj)
            if ((list.firstElementChild.className == "list_heading")) {
                list.removeChild(list.firstElementChild)
            }
            // also adding those item into web page
            let enteredName = name.value
            let enteredEmail = email.value
            let enteredPhone = phone.value
            list.innerHTML += ` <li class='listitems'><span class="idtoken">${data._id}</span><span>${enteredName}</span> <span>${enteredEmail}</span> <span>${enteredPhone}</span><button class="edit-btn">Edit</button><button class='listitems_btn'>X</button></li> `
            // making the input box empty
            name.value = ""
            email.value = ""
            phone.value = ""
        }
    } catch (error) {
        console.log(error);
    }

}



/* -------------------------------------------------------------------------- */
/*                            Delete Item Function                            */
/* -------------------------------------------------------------------------- */

list.addEventListener("click", deleteItem)
async function deleteItem(e) {
    try {
        if (e.target.classList.contains("listitems_btn")) {
            if (confirm("Are You Sure ? ")) {
                const li = e.target.parentElement
                const idToken = li.firstElementChild.innerText
                await axios.delete(`https://crudcrud.com/api/0cf8d1500e3b4f30ad46b8cf137cb159/BookedAppointments/${idToken}`)

                list.removeChild(li)

            }
        }
        console.log(list.children.length)
    } catch (error) {
        console.log(error)

    }
    if (list.children.length == 0) {
        list.innerHTML += "<h1 class='list_heading'>No Appointment Booked !! </h1>"
    }
}




/* -------------------------------------------------------------------------- */
/*                            Filter Item Function                            */
/* -------------------------------------------------------------------------- */

const filter = document.querySelector("#search")
filter.addEventListener("keyup", filtervalues)

function filtervalues() {
    for (let i = 0; i < list.children.length; i++) {
        var target = list.children[i]
        if (target.children[1].textContent.toLowerCase().includes(filter.value.toLowerCase()) || target.children[2].textContent.toLowerCase().includes(filter.value.toLowerCase()) || target.children[3].textContent.toLowerCase().includes(filter.value.toLowerCase())) {
            target.style.display = "flex"
        }
        else {
            target.style.display = "none"
        }

    }
}





/* -------------------------------------------------------------------------- */
/*                                 Edit Button                                */
/* -------------------------------------------------------------------------- */

list.addEventListener("click", edit)

async function edit(e) {
    try {

        name.value = e.target.parentElement.children[1].textContent
        email.value = e.target.parentElement.children[2].textContent
        phone.value = e.target.parentElement.children[3].textContent

        let parentElement = e.target.parentElement
        let tokenId = parentElement.firstElementChild.textContent
        console.log(tokenId)

        //deleting the target value from the server
        bookNowBtn.style.display = "none"
        saveBtn.style.display = "inline"
        parentElement.remove()
        saveBtn.addEventListener("click", async (e) => {
            e.preventDefault()
            let itemObj = {
                person_Name: name.value,
                person_Email: email.value,
                person_Phone: phone.value

            }

            await axios.put(`https://crudcrud.com/api/0cf8d1500e3b4f30ad46b8cf137cb159/BookedAppointments/${tokenId}`, itemObj)
            let enteredName = name.value
            let enteredEmail = email.value
            let enteredPhone = phone.value
            list.innerHTML += ` <li class='listitems'><span class="idtoken">${tokenId}</span><span>${enteredName}</span> <span>${enteredEmail}</span> <span>${enteredPhone}</span><button class="edit-btn">Edit</button><button class='listitems_btn'>X</button></li> `
            // making the input box empty
            name.value = ""
            email.value = ""
            phone.value = ""
            bookNowBtn.style.display = "inline"
            saveBtn.style.display = "none"

        })


    } catch (error) {
        console.log(error)

    }
}