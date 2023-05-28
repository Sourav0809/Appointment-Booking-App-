const mainForm = document.querySelector("#main_form")
const list = document.querySelector(".items")


const name = document.querySelector("#person_name")
const email = document.querySelector("#person_email")
const phone = document.querySelector("#person_phone")


/* -------------------------------------------------------------------------- */
/*                              Add item Function                             */
/* -------------------------------------------------------------------------- */

mainForm.addEventListener("submit", additem)
function additem(e) {
    e.preventDefault()
    // also deleting the no appointment heading
    if ((list.firstElementChild.className == "list_heading")) {
        list.removeChild(list.firstElementChild)
    }
    // adding to crud crud
    addtoServer()

    let enteredName = name.value
    let enteredEmail = email.value
    let enteredPhone = phone.value
    list.innerHTML += ` <li class='listitems'><span contenteditable = 'true'>${enteredName}</span> <span>${enteredEmail}</span> <span>${enteredPhone}</span><button class="edit-btn">Edit</button><button class='listitems_btn'>X</button></li> `
    // making the input box empty
    name.value = ""
    email.value = ""
    phone.value = ""




}


/* -------------------------------------------------------------------------- */
/*                            Delete Item Function                            */
/* -------------------------------------------------------------------------- */

list.addEventListener("click", deleteItem)
function deleteItem(e) {
    if (e.target.classList.contains("listitems_btn")) {
        if (confirm("Are You Sure ? ")) {
            const li = e.target.parentElement
            // Also deleting form local storage
            localStorage.removeItem(li.children[1].innerText)
            list.removeChild(li)

        }
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
        if (target.children[0].textContent.toLowerCase().includes(filter.value.toLowerCase()) || target.children[1].textContent.toLowerCase().includes(filter.value.toLowerCase()) || target.children[2].textContent.toLowerCase().includes(filter.value.toLowerCase())) {
            target.style.display = "flex"
        }
        else {
            target.style.display = "none"
        }

    }
}


/* -------------------------------------------------------------------------- */
/*                     Function to Add items into Server                      */
/* -------------------------------------------------------------------------- */

function addtoServer() {
    let itemObj = {
        person_Name: name.value,
        person_Email: email.value,
        person_Phone: phone.value

    }

    axios.post('https://crudcrud.com/api/08ee7597555341bcbc444aa444c3ea3a/BookedAppointments', itemObj)
        .then((res) => console.log(res))
        .catch(err => console.log(err))

}



/* -------------------------------------------------------------------------- */
/*                                 Edit Button                                */
/* -------------------------------------------------------------------------- */

list.addEventListener("click", edit)

function edit(e) {
    if (e.target.classList.contains("edit-btn")) {
        if (e.target.innerText == "Edit") {
            e.target.innerText = "Save"
            e.target.parentElement.children[0].setAttribute("contenteditable", "true")

        }
        else {
            e.target.innerText = "Edit"
            e.target.parentElement.children[0].setAttribute("contenteditable", "false")
            let editObj = {
                person_Name: e.target.parentElement.children[0].textContent,
                person_Email: e.target.parentElement.children[1].textContent,
                person_Phone: e.target.parentElement.children[2].textContent

            }

            localStorage.setItem(e.target.parentElement.children[1].textContent, JSON.stringify(editObj))

        }
    }
}
