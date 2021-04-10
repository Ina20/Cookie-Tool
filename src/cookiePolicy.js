let vendors = [];
let modal;

window.onload = function myFunction() {
  document.getElementById('button').addEventListener("click", openModal);
  //openModal();
  getVendors();

}

const openModal = () => {
  document.body.style.overflow = "hidden";

  modal = document.createElement('div');
  const modalContent = document.createElement('div');
  const title = document.createElement('h2');
  const buttonAccept = document.createElement('button');
  const buttonReject = document.createElement('button');
  const buttonWrapper = document.createElement('div');
  const form = document.createElement('form');

  createVendorsList(form);

  modal.classList.add('modal');
  modalContent.classList.add('modal-content');

  buttonAccept.addEventListener("click", acceptVendors);
  buttonReject.addEventListener("click", rejectVendors);

  modal.style.display = "block";

  title.innerHTML = "GDPR consent";
  buttonAccept.innerHTML = "Accept";
  buttonReject.innerHTML = "Reject";

  buttonWrapper.classList.add('button-wrapper');
  buttonWrapper.appendChild(buttonAccept);
  buttonWrapper.appendChild(buttonReject);

  modalContent.appendChild(title);
  modalContent.appendChild(form);
  modalContent.appendChild(buttonWrapper);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
}

const createVendorsList = (form) => {
  Object.keys(vendors).forEach(vendor => {
    const vendorInput = document.createElement('input');
    const vendorLabel = document.createElement('label');
    const vendorUrl = document.createElement('a');
    const nextLine = document.createElement('br');
    const vendorWrapper = document.createElement('div');

    vendorInput.setAttribute('type', 'checkbox');
    vendorInput.setAttribute('id', vendors[vendor].id);
    vendorInput.setAttribute('name', 'vendor');
    vendorInput.setAttribute('value', vendors[vendor].name);

    vendorUrl.setAttribute('href', vendors[vendor].policyUrl);
    vendorUrl.innerText = 'Cookie Policy';

    vendorLabel.setAttribute("for", vendors[vendor].id);
    vendorLabel.innerHTML = vendors[vendor].name + " ";
    vendorLabel.appendChild(vendorUrl);

    vendorWrapper.classList.add('vendor-wrapper');
    vendorWrapper.appendChild(vendorInput);
    vendorWrapper.appendChild(vendorLabel);
    vendorWrapper.appendChild(nextLine);

    form.appendChild(vendorWrapper);
  })
}

const acceptVendors = () => {
  console.log('accept');


  let checkboxes = document.getElementsByName('vendor');
  let checkboxesChecked = [];
  console.log(checkboxes);

  for (let i = 0; i < checkboxes.length; i++) {
    if(checkboxes[i].checked){
      console.log('checked ' + checkboxes[i].value);
      checkboxesChecked.push(checkboxes[i].value);
    }
  }

  console.log(checkboxesChecked);

  modal.style.display = "none";
  document.body.style.overflow = "auto";
}

const rejectVendors = () => {
  console.log('reject');

  modal.style.display = "none";
  document.body.style.overflow = "auto";
}

async function getVendors() {
  let res = await fetch('https://optad360.mgr.consensu.org/cmp/v2/vendor-list.json');
  let data = await res.json();
  vendors = data.vendors;
  console.log(vendors);
}
