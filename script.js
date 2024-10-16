// variable for current state of simulation
let state = {
    protons: 1, // num of protons
    neutrons: 0, // num of neutrons
    electrons: 2, // num of electrons
};

massNumber = state.protons + state.neutrons;
ionicCharge = state.protons - state.electrons;

if (ionicCharge > 0) {
    console.log("Cation")
    console.log("Ionic Charge: " + ionicCharge)
} else if (ionicCharge < 0) {
    console.log("Anion")
    console.log("Ionic Charge: " + ionicCharge)
} else {
    console.log("No Ionic Charge")
}