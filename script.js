import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// variable ATOMS
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

// Three.js Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(20, 13, 13);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Initialize OrbitControls
const orbitControls = new OrbitControls(camera, renderer.domElement); // Pass camera and canvas

// Atom components
const nucleusGroup = new THREE.Group();
scene.add(nucleusGroup);

const electronGroup = new THREE.Group();
scene.add(electronGroup);

const orbitGroup = new THREE.Group();
scene.add(orbitGroup);

// Create sphere geometry for protons, neutrons, and electrons
const protonMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const neutronMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const electronMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

const protonGeometry = new THREE.SphereGeometry(0.4, 16, 16); // Smaller size for protons
const neutronGeometry = new THREE.SphereGeometry(0.4, 16, 16);
const electronGeometry = new THREE.SphereGeometry(0.2, 16, 16);

// GUI Setup
const gui = new dat.GUI();
const atomNames = Object.keys(ATOMS);
const controls = {
    selectedAtom: atomNames[0]
};

const infoPanel = {
    atomicNum: ATOMS[controls.selectedAtom].atomicNum,
    atomicMass: ATOMS[controls.selectedAtom].atomicMass,
    atomicSymbol: ATOMS[controls.selectedAtom].atomicSymbol,
    group: ATOMS[controls.selectedAtom].group,
    groupNum: ATOMS[controls.selectedAtom].groupNum,
    periodNum: ATOMS[controls.selectedAtom].periodNum
};

function updateInfo(atomName) {
    const selected = ATOMS[atomName];
    infoPanel.atomicNum = selected.atomicNum;
    infoPanel.atomicMass = selected.atomicMass;
    infoPanel.atomicSymbol = selected.atomicSymbol;
    infoPanel.group = selected.group;
    infoPanel.groupNum = selected.groupNum;
    infoPanel.periodNum = selected.periodNum;
}

// Helper function to determine electron shell distribution
function getElectronConfiguration(electronCount) {
    const shells = [];
    const maxShellCapacity = [2, 8, 8, 8];
    
    for (let i = 0; i < maxShellCapacity.length && electronCount > 0; i++) {
        const electronsInShell = Math.min(electronCount, maxShellCapacity[i]);
        shells.push(electronsInShell);
        electronCount -= electronsInShell;
    }
    
    return shells;
}

// Create the atom based on the selected element
function createAtom(atomName) {
    const selectedAtom = ATOMS[atomName];
    const protonCount = selectedAtom.atomicNum;
    const neutronCount = selectedAtom.atomicMass - protonCount;
    const electronCount = protonCount;

    // Clear previous nucleus, electrons, and orbits
    nucleusGroup.clear();
    electronGroup.clear();
    orbitGroup.clear();

    // Spacing adjustment based on atomic number
    const spacing = 1 + (protonCount / 10); // Adjust the spacing dynamically

    // Create protons
    for (let i = 0; i < protonCount; i++) {
        const proton = new THREE.Mesh(protonGeometry, protonMaterial);
        proton.position.set(
            (Math.random() - 0.5) * spacing, // Smaller area to prevent overlap
            (Math.random() - 0.5) * spacing,
            (Math.random() - 0.5) * spacing
        );
        nucleusGroup.add(proton);
    }

    // Create neutrons
    for (let i = 0; i < neutronCount; i++) {
        const neutron = new THREE.Mesh(neutronGeometry, neutronMaterial);
        neutron.position.set(
            (Math.random() - 0.5) * spacing,
            (Math.random() - 0.5) * spacing,
            (Math.random() - 0.5) * spacing
        );
        nucleusGroup.add(neutron);
    }

    // Create electron orbitals and paths
    const electronShells = getElectronConfiguration(electronCount);
    electronShells.forEach((electronsInShell, shellIndex) => {
        const orbitRadius = (shellIndex + 1) * 4; // Increased distance from nucleus for shells

        for (let i = 0; i < electronsInShell; i++) {
            const electron = new THREE.Mesh(electronGeometry, electronMaterial);

            // Distribute electrons evenly around the orbit
            const angle = (i / electronsInShell) * Math.PI * 2;
            electron.position.set(
                Math.cos(angle) * orbitRadius,
                0,
                Math.sin(angle) * orbitRadius
            );

            electronGroup.add(electron);

            // Animate electron orbit
            electron.orbitAngle = angle;
            electron.orbitSpeed = 0.02;
            electron.orbitRadius = orbitRadius;
        }

        // Draw the electron path (orbit)
        const orbitGeometry = new THREE.RingGeometry(orbitRadius - 0.05, orbitRadius + 0.05, 64);
        const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0x888888, side: THREE.DoubleSide });
        const orbitMesh = new THREE.Mesh(orbitGeometry, orbitMaterial);
        orbitMesh.rotation.x = Math.PI / 2; // Make it flat
        orbitGroup.add(orbitMesh);
    });
}

function animate() {
    requestAnimationFrame(animate);

    // Animate each electron's orbit
    electronGroup.children.forEach(electron => {
        electron.orbitAngle += electron.orbitSpeed;
        electron.position.x = Math.cos(electron.orbitAngle) * electron.orbitRadius;
        electron.position.z = Math.sin(electron.orbitAngle) * electron.orbitRadius;
    });

    orbitControls.update(); // Update controls to reflect changes
    renderer.render(scene, camera);
}

animate();

// GUI Dropdown
gui.add(controls, 'selectedAtom', atomNames).onChange(function(value) {
    createAtom(value);
    updateInfo(value);
});

// Display selected atom info
const folder = gui.addFolder('Atom Info');
folder.add(infoPanel, 'atomicNum').listen();
folder.add(infoPanel, 'atomicMass').listen();
folder.add(infoPanel, 'atomicSymbol').listen();
folder.add(infoPanel, 'group').listen();
folder.add(infoPanel, 'groupNum').listen();
folder.add(infoPanel, 'periodNum').listen();
folder.open();

// Initial creation of the default atom
createAtom(controls.selectedAtom);
