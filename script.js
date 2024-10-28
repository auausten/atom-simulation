import * as THREE from 'three';
import * as dat from 'dat.gui';

const ATOMS =
{   'Hydrogen':
    {   atomicNum: 1,
        atomicMass: 1,
        atomicSymbol: 'H',
    },
    'Helium':
    {   atomicNum: 2,
        atomicMass: 4,
        atomicSymbol: 'He',
    },
    'Lithium':
    {   atomicNum: 3,
        atomicMass: 7,
        atomicSymbol: 'Li',
    },
    'Beryllium':
    {   atomicNum: 4,
        atomicMass: 9,
        atomicSymbol: 'Be',
    },
    'Boron':
    {   atomicNum: 5,
        atomicMass: 11,
        atomicSymbol: 'B',
    },
    'Carbon':
    {   atomicNum: 6,
        atomicMass: 12,
        atomicSymbol: 'C',
    },
    'Nitrogen':
    {   atomicNum: 7,
        atomicMass: 14,
        atomicSymbol: 'N',
    },
    'Oxygen':
    {   atomicNum: 8,
        atomicMass: 16,
        atomicSymbol: 'O',
    },
    'Fluorine':
    {   atomicNum: 9,
        atomicMass: 19,
        atomicSymbol: 'F',
    },
    'Neon':
    {   atomicNum: 10,
        atomicMass: 20,
        atomicSymbol: 'Ne',
    },
    'Sodium':
    {   atomicNum: 11,
        atomicMass: 23,
        atomicSymbol: 'Na',
    },
    'Magnesium':
    {   atomicNum: 12,
        atomicMass: 24,
        atomicSymbol: 'Mg',
    },
    'Aluminum':
    {   atomicNum: 13,
        atomicMass: 27,
        atomicSymbol: 'Al',
    },
    'Silicon':
    {   atomicNum: 14,
        atomicMass: 28,
        atomicSymbol: 'Si',
    },
    'Phosphorus':
    {   atomicNum: 15,
        atomicMass: 31,
        atomicSymbol: 'P',
    },
    'Sulfur':
    {   atomicNum: 16,
        atomicMass: 32,
        atomicSymbol: 'S',
    },
    'Chlorine':
    {   atomicNum: 17,
        atomicMass: 35,
        atomicSymbol: 'Cl',
    },
    'Argon':
    {   atomicNum: 18,
        atomicMass: 40,
        atomicSymbol: 'Ar',
    },
    'Potassium':
    {   atomicNum: 19,
        atomicMass: 39,
        atomicSymbol: 'K',
    },
    'Calcium':
    {   atomicNum: 20,
        atomicMass: 40,
        atomicSymbol: 'Ca',
    }
};

const scene = new THREE.Scene(window.innerWidth, window.innerHeight);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const radius = 0.5;
const widthSegments = 32;
const heightSegments = 32;

const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
const material = new THREE.MeshBasicMaterial({color: 0xffffff});
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

camera.position.z = 3;

function animate() {
    requestAnimationFrame(animate);

    sphere.rotation.x += 0.01;
    sphere.rotation.y += 0.01;

    renderer.render(scene, camera);
}

animate();

const gui = new dat.GUI();
dropdown = gui.addFolder('Atom');
