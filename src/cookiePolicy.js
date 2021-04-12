let vendors = [];
let modal;
let userDecision;

window.onload = function myFunction() {
  checkCookie();
}

const getCookie = (cname) => {
  let name = cname + '=';
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

const checkCookie = () => {
  let consent = getCookie('GDPRconsent');
  if (consent == '') {
    getVendors();
  }
}

async function getVendors() {
  let res = await fetch('https://optad360.mgr.consensu.org/cmp/v2/vendor-list.json');
  let data = await res.json();
  vendors = data.vendors;
  openModal();
}

const openModal = () => {
  document.body.style.overflow = 'hidden';

  modal = document.createElement('div');
  const modalContent = document.createElement('div');
  const title = document.createElement('h2');
  const buttonAccept = document.createElement('button');
  const buttonReject = document.createElement('button');
  const buttonWrapper = document.createElement('div');
  const form = document.createElement('form');
  const checkAll = document.createElement('input');
  const checkAllLabel = document.createElement('label');
  const checkAllWrapper = document.createElement('div');

  createVendorsList(form);

  checkAll.setAttribute('type', 'checkbox');
  checkAll.setAttribute('id', 'checkAllVendors');
  checkAll.addEventListener('click', checkAllVendors);

  checkAllLabel.setAttribute('for', 'checkAllVendors');
  checkAllLabel.innerHTML = 'Check All';

  checkAllWrapper.classList.add('checkAll-wrapper');
  checkAllWrapper.appendChild(checkAll);
  checkAllWrapper.appendChild(checkAllLabel);

  modal.classList.add('modal');
  modalContent.classList.add('modal-content');

  buttonAccept.addEventListener('click', acceptVendors);
  buttonReject.addEventListener('click', rejectVendors);

  modal.style.display = 'block';

  title.innerHTML = 'GDPR consent';
  buttonAccept.innerHTML = 'Accept';
  buttonReject.innerHTML = 'Reject';

  buttonWrapper.classList.add('button-wrapper');
  buttonWrapper.appendChild(buttonAccept);
  buttonWrapper.appendChild(buttonReject);

  modalContent.appendChild(title);
  modalContent.appendChild(checkAllWrapper);
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

    vendorLabel.setAttribute('for', vendors[vendor].id);
    vendorLabel.innerHTML = vendors[vendor].name + ' ';
    vendorLabel.appendChild(vendorUrl);

    vendorWrapper.classList.add('vendor-wrapper');
    vendorWrapper.appendChild(vendorInput);
    vendorWrapper.appendChild(vendorLabel);
    vendorWrapper.appendChild(nextLine);

    form.appendChild(vendorWrapper);
  })
}

const checkAllVendors = () => {
  let checkboxes = document.getElementsByName('vendor');

  for (let i = 0; i < checkboxes.length; i++) {
    if(document.getElementById('checkAllVendors').checked) {
      checkboxes[i].checked = true;
    }else {
      checkboxes[i].checked = false;
    }
  }
}

const acceptVendors = () => {
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';

  userDecision = 'accept';

  let checkboxes = document.getElementsByName('vendor');
  let checkboxesChecked = [];
  for (let i = 0; i < checkboxes.length; i++) {
    if(checkboxes[i].checked){
      checkboxesChecked.push(checkboxes[i].value);
    }
  }

  createCookie(userDecision, checkboxesChecked);
}

const rejectVendors = () => {
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';

  userDecision = 'reject';

  createCookie(userDecision, []);
}

const createCookie = (userDecision, vendors) => {
  let expires = (new Date(Date.now()+ 86400*1000)).toUTCString();
  let cookieContent = {userDecision: userDecision, vendors: vendors};

  document.cookie = 'GDPRconsent=' + JSON.stringify(cookieContent)  + '; expires=' + expires;
}
