// simple step-based form
let step = 1;
const container = document.getElementById('form-container');
const resultDiv = document.getElementById('result');

const state = {}; // will hold form fields

function renderStep() {
  container.innerHTML = '';
  if (step === 1) {
    container.innerHTML = `
      <h2>Personal Info</h2>
      <input id="fullName" placeholder="Full Name" />
      <input id="email" placeholder="Email" />
      <input id="phone" placeholder="Phone" />
      <button id="next">Next</button>
    `;
    document.getElementById('next').onclick = () => {
      state.fullName = document.getElementById('fullName').value;
      state.email = document.getElementById('email').value;
      state.phone = document.getElementById('phone').value;
      step=2; renderStep();
    };
  } else if (step === 2) {
    container.innerHTML = `
      <h2>Vehicle Details</h2>
      <select id="vehicleType">
        <option value="">Select type</option>
        <option>Car</option><option>Truck</option><option>Motorcycle</option>
      </select>
      <input id="marketValue" placeholder="Market Value" type="number" />
      <input id="plateNumber" placeholder="Plate Number" />
      <button id="prev">Previous</button>
      <button id="next">Next</button>
    `;
    document.getElementById('prev').onclick = ()=>{step=1;renderStep();};
    document.getElementById('next').onclick = ()=>{
      state.vehicleType=document.getElementById('vehicleType').value;
      state.marketValue=parseFloat(document.getElementById('marketValue').value);
      state.plateNumber=document.getElementById('plateNumber').value;
      step=3; renderStep();
    };
  } else if (step === 3) {
    container.innerHTML = `
      <h2>Coverage</h2>
      <label><input type="radio" name="coverage" value="Third Party" checked/> Third Party</label>
      <label><input type="radio" name="coverage" value="Comprehensive"/> Comprehensive</label>
      <button id="prev">Previous</button>
      <button id="calc">Calculate</button>
    `;
    document.getElementById('prev').onclick = ()=>{step=2;renderStep();};
    document.getElementsByName('coverage').forEach(r=>r.onchange=()=>state.coverageType=r.value);
    document.getElementById('calc').onclick = calculate;
  }
}

function calculate() {
  // call backend
  fetch('/api/quotes/calculate', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({vehicleType:state.vehicleType,marketValue:state.marketValue,coverageType:state.coverageType})
  })
  .then(r=>r.json())
  .then(data=>{
     container.innerHTML='';
     resultDiv.classList.remove('hidden');
     resultDiv.innerHTML=`<h2>Premium: ZMW ${data.premium}</h2>`;
  })
  .catch(e=>alert('error'));
}

renderStep();
