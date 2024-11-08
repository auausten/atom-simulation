import * as THREE from 'three'; // imports for 3D graphics
import * as dat from 'dat.gui'; // imports for GUI control interface
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'; // imports orbital controls to allow viewer to move around and zoom in on atom

// stores atomic data for elements
const ATOMS = {
    'Hydrogen': { atomicNum: 1, atomicMass: 1, atomicSymbol: 'H', group: 'N/A', groupNum: 1, periodNum: 1 },
    'Helium': { atomicNum: 2, atomicMass: 4, atomicSymbol: 'He', group: 'Noble Gas', groupNum: 18, periodNum: 1 },
    'Lithium': { atomicNum: 3, atomicMass: 7, atomicSymbol: 'Li', group: 'Alkali Metal', groupNum: 1, periodNum: 2 },
    'Beryllium': { atomicNum: 4, atomicMass: 9, atomicSymbol: 'Be', group: 'Alkaline Earth Metal', groupNum: 2, periodNum: 2 },
    'Boron': { atomicNum: 5, atomicMass: 11, atomicSymbol: 'B', group: 'Boron Group', groupNum: 13, periodNum: 2 },
    'Carbon': { atomicNum: 6, atomicMass: 12, atomicSymbol: 'C', group: 'Carbon Group', groupNum: 14, periodNum: 2 },
    'Nitrogen': { atomicNum: 7, atomicMass: 14, atomicSymbol: 'N', group: 'Pnictogen', groupNum: 15, periodNum: 2 },
    'Oxygen': { atomicNum: 8, atomicMass: 16, atomicSymbol: 'O', group: 'Chalcogen', groupNum: 16, periodNum: 2 },
    'Fluorine': { atomicNum: 9, atomicMass: 19, atomicSymbol: 'F', group: 'Halogen', groupNum: 17, periodNum: 2 },
    'Neon': { atomicNum: 10, atomicMass: 20, atomicSymbol: 'Ne', group: 'Noble Gas', groupNum: 18, periodNum: 2 },
    'Sodium': { atomicNum: 11, atomicMass: 23, atomicSymbol: 'Na', group: 'Alkali Metal', groupNum: 1, periodNum: 3 },
    'Magnesium': { atomicNum: 12, atomicMass: 24, atomicSymbol: 'Mg', group: 'Alkaline Earth Metal', groupNum: 2, periodNum: 3 },
    'Aluminum': { atomicNum: 13, atomicMass: 27, atomicSymbol: 'Al', group: 'Boron Group', groupNum: 13, periodNum: 3 },
    'Silicon': { atomicNum: 14, atomicMass: 28, atomicSymbol: 'Si', group: 'Carbon Group', groupNum: 14, periodNum: 3 },
    'Phosphorus': { atomicNum: 15, atomicMass: 31, atomicSymbol: 'P', group: 'Pnictogen', groupNum: 15, periodNum: 3 },
    'Sulfur': { atomicNum: 16, atomicMass: 32, atomicSymbol: 'S', group: 'Chalcogen', groupNum: 16, periodNum: 3 },
    'Chlorine': { atomicNum: 17, atomicMass: 35, atomicSymbol: 'Cl', group: 'Halogen', groupNum: 17, periodNum: 3 },
    'Argon': { atomicNum: 18, atomicMass: 40, atomicSymbol: 'Ar', group: 'Noble Gas', groupNum: 18, periodNum: 3 },
    'Potassium': { atomicNum: 19, atomicMass: 39, atomicSymbol: 'K', group: 'Alkali Metal', groupNum: 1, periodNum: 4 },
    'Calcium': { atomicNum: 20, atomicMass: 40, atomicSymbol: 'Ca', group: 'Alkaline Earth Metal', groupNum: 2, periodNum: 4 }
};

// three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(20, 13, 13);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const orbitControls = new OrbitControls(camera, renderer.domElement);

const nucleusGroup = new THREE.Group();
scene.add(nucleusGroup);

const electronGroup = new THREE.Group();
scene.add(electronGroup);

const orbitGroup = new THREE.Group();
scene.add(orbitGroup);

// defines materials and geometries for protons, neutrons, and electrons in the atom
const protonMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const neutronMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const electronMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

const protonGeometry = new THREE.SphereGeometry(0.4, 16, 16);
const neutronGeometry = new THREE.SphereGeometry(0.4, 16, 16);
const electronGeometry = new THREE.SphereGeometry(0.2, 16, 16);

// GUI setup
const gui = new dat.GUI();
const atomNames = Object.keys(ATOMS);
const controls = { selectedAtom: atomNames[0] };

// panel to display atomic information in the GUI
const infoPanel = {
    atomicNum: ATOMS[controls.selectedAtom].atomicNum,
    atomicMass: ATOMS[controls.selectedAtom].atomicMass,
    atomicSymbol: ATOMS[controls.selectedAtom].atomicSymbol,
    group: ATOMS[controls.selectedAtom].group,
    groupNum: ATOMS[controls.selectedAtom].groupNum,
    periodNum: ATOMS[controls.selectedAtom].periodNum
};

// initialises button to open 'More Info' webpage
const customButton = { 
    moreInfo: function moreInfo() { 
        window.open('explanation.html', '_self');
    }
};

// updates infoPanel properties based on the currently selected atom
// ensures the GUI reflects the correct information
function updateInfo(atomName) {
    const selected = ATOMS[atomName];
    infoPanel.atomicNum = selected.atomicNum;
    infoPanel.atomicMass = selected.atomicMass;
    infoPanel.atomicSymbol = selected.atomicSymbol;
    infoPanel.group = selected.group;
    infoPanel.groupNum = selected.groupNum;
    infoPanel.periodNum = selected.periodNum;
}

// calculates the electron configuration for a given atom using the electron count
function getElectronConfiguration(electronCount) {
    const shells = [];
    const maxShellCapacity = [2, 8, 8, 8]; // max electrons per shell
    for (let i = 0; i < maxShellCapacity.length && electronCount > 0; i++) {
        const electronsInShell = Math.min(electronCount, maxShellCapacity[i]);
        shells.push(electronsInShell); // adds electrons to the current shell
        electronCount -= electronsInShell; // decrease remaining electrons by 1
    }
    return shells; // returns array representing electron distribution
}

// generates fixed positions for nucleons in a spherical pattern
function generateSphericalPattern(nucleonCount, nucleonRadius) {
    const positions = []; // array to store positions of nucleons
    const spacing = nucleonRadius * 1.5; // spacing between nucleons to have constant spacing in between each nucleon (touching but no overlap)

    let nucleonsPlaced = 0; // counter to track num of placed nucleons 
    let layer = 0; // counter to represent each layer in the spherical structure

    // loop until all nucleons have been placed
    while (nucleonsPlaced < nucleonCount) {
        const radius = layer * spacing * 0.9; // calculates radius of current layer based on layer index
        const numParticles = 4 * layer ** 2 || 1; // defines num of particles in the current layer; the first layer has 1
        
        // place nucleons in the current layer (ChatGPT)
        for (let i = 0; i < numParticles && nucleonsPlaced < nucleonCount; i++) {
            const theta = Math.acos(1 - 2 * (i + 0.5) / numParticles); // calculates polar angle for positioning
            const phi = Math.PI * (1 + Math.sqrt(5)) * i; // calculates azimuthal angle for positioning
            
            // converts spherical coordinates to cartesian coordinates
            const x = radius * Math.sin(theta) * Math.cos(phi);
            const y = radius * Math.sin(theta) * Math.sin(phi);
            const z = radius * Math.cos(theta);

            positions.push(new THREE.Vector3(x, y, z)); // adds position as a 3D vector to the array
            nucleonsPlaced++; // increments nucleons placed
        }
        layer++; // moves to the next layer to create a spherical shell pattern
    }
    return positions;
}

// creates the atom
function createAtom(atomName) {
    const selectedAtom = ATOMS[atomName];
    const protonCount = selectedAtom.atomicNum;
    const neutronCount = selectedAtom.atomicMass - protonCount;
    const electronCount = protonCount;

    // clears previous atom components
    nucleusGroup.clear();
    electronGroup.clear();
    orbitGroup.clear();

    const nucleonPositions = generateSphericalPattern(protonCount + neutronCount, 0.4);

    nucleonPositions.slice(0, protonCount).forEach((position) => {
        const proton = new THREE.Mesh(protonGeometry, protonMaterial);
        proton.position.copy(position);
        nucleusGroup.add(proton);
    });

    nucleonPositions.slice(protonCount).forEach((position) => {
        const neutron = new THREE.Mesh(neutronGeometry, neutronMaterial);
        neutron.position.copy(position);
        nucleusGroup.add(neutron);
    });

    const electronShells = getElectronConfiguration(electronCount);
    electronShells.forEach((electronsInShell, shellIndex) => {
        const orbitRadius = (shellIndex + 1) * 4;
        for (let i = 0; i < electronsInShell; i++) {
            const electron = new THREE.Mesh(electronGeometry, electronMaterial);
            const angle = (i / Math.max(1, electronsInShell)) * Math.PI * 2;
            electron.position.set(
                orbitRadius * Math.cos(angle),
                0,
                orbitRadius * Math.sin(angle)
            );

            electronGroup.add(electron);

            electron.orbitAngle = angle;
            electron.orbitSpeed = 0.02;
            electron.orbitRadius = orbitRadius;
        }

        const orbitGeometry = new THREE.RingGeometry(orbitRadius - 0.05, orbitRadius + 0.05, 64);
        const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0x888888, side: THREE.DoubleSide });
        const orbitMesh = new THREE.Mesh(orbitGeometry, orbitMaterial);
        orbitMesh.rotation.x = Math.PI / 2;
        orbitGroup.add(orbitMesh);
    });
}

function animate() {
    requestAnimationFrame(animate);

    electronGroup.children.forEach(electron => {
        electron.orbitAngle += electron.orbitSpeed;
        electron.position.x = Math.cos(electron.orbitAngle) * electron.orbitRadius;
        electron.position.z = Math.sin(electron.orbitAngle) * electron.orbitRadius;
    });

    orbitControls.update();
    renderer.render(scene, camera);
}

animate();

gui.add(controls, 'selectedAtom', atomNames).onChange(function(value) {
    createAtom(value);
    updateInfo(value);
});

const folder = gui.addFolder('Atom Info');
folder.add(infoPanel, 'atomicNum').listen();
folder.add(infoPanel, 'atomicMass').listen();
folder.add(infoPanel, 'atomicSymbol').listen();
folder.add(infoPanel, 'group').listen();
folder.add(infoPanel, 'groupNum').listen();
folder.add(infoPanel, 'periodNum').listen();
folder.open();

gui.add(customButton, 'moreInfo').name('Instructions & More Info');

createAtom(controls.selectedAtom);