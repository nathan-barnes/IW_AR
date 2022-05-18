import { loadGLTF } from "./libs/loader.js";
import * as THREE3 from "./libs/three.js-r132/build/three.module.js";
import { ARButton } from "./libs/three.js-r132/examples/jsm/webxr/ARButton.js";

const THREE = window.MINDAR.IMAGE.THREE;
// import THREE from "./libs/mindar/mindar-image-three.prod.js";
// const THREEImport = "./libs/mindar/mindar-image-three.prod.js";
// const THREE = THREEImport.THREE;
// const THREEImage = THREEImport;
// console.log(THREEImage)

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
    // const mindarThree = new THREEImage.MindARThree({
      container: document.body,
      imageTargetSrc: './assets/targets/QR.mind',
      // imageTargetSrc: './assets/targets/dearZoo.mind',
    });
    const {renderer, scene, camera} = mindarThree;

    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    scene.add(light);

    // const gltf = await loadGLTF('./assets/models/IW/scene.gltf');
    const gltf = await loadGLTF('./assets/models/musicband-raccoon/scene.gltf');
    console.log(gltf)
    gltf.scene.scale.set(0.1, 0.1, 0.1);
    gltf.scene.position.set(0, -0.4, 0);

    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(gltf.scene);

    const mixer = new THREE.AnimationMixer(gltf.scene);
    const action = mixer.clipAction(gltf.animations[0]);
    action.play();

    const clock = new THREE.Clock();
    console.log(clock)

    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      const delta = clock.getDelta();
      // gltf.scene.rotation.set(0, gltf.scene.rotation.y+delta, 0);
      mixer.update(delta);
      renderer.render(scene, camera);
    });
  }
  start();
});

// const normalizeModel = (obj, height) => {
//   // scale it according to height
//   const bbox = new THREE3.Box3().setFromObject(obj);
//   const size = bbox.getSize(new THREE3.Vector3());
//   obj.scale.multiplyScalar(height / size.y);

//   // reposition to center
//   const bbox2 = new THREE3.Box3().setFromObject(obj);
//   const center = bbox2.getCenter(new THREE3.Vector3());
//   obj.position.set(-center.x, -center.y, -center.z);
// };

// // recursively set opacity
// const setOpacity = (obj, opacity) => {
//   obj.children.forEach((child) => {
//     setOpacity(child, opacity);
//   });
//   if (obj.material) {
//     obj.material.format = THREE3.RGBAFormat; // required for opacity
//     obj.material.opacity = opacity;
//   }
// };

// // make clone object not sharing materials
// const deepClone = (obj) => {
//   const newObj = obj.clone();
//   newObj.traverse((o) => {
//     if (o.isMesh) {
//       o.material = o.material.clone();
//     }
//   });
//   return newObj;
// };

// document.addEventListener("DOMContentLoaded", () => {
//   const initialize = async () => {
//     const scene = new THREE3.Scene();
//     const camera = new THREE3.PerspectiveCamera(
//       70,
//       window.innerWidth / window.innerHeight,
//       0.01,
//       20
//     );

//     const light = new THREE3.HemisphereLight(0xffffff, 0xbbbbff, 1);
//     scene.add(light);

//     const renderer = new THREE3.WebGLRenderer({ antialias: true, alpha: true });
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     renderer.xr.enabled = true;

//     const arButton = ARButton.createButton(renderer, {
//       requiredFeatures: ["hit-test"],
//       optionalFeatures: ["dom-overlay"],
//       domOverlay: { root: document.body },
//     });
//     document.body.appendChild(renderer.domElement);
//     document.body.appendChild(arButton);

//     // const itemNames = ['IW-AngelHair', 'IW-Solanum', 'IW'];
//     const itemNames = ["IW-AngelHair", "IW-Solanum"];
//     // const itemHeights = [4.5, 4.5, 4.5];
//     const itemHeights = [4.5, 4.5];
//     const items = [];
//     for (let i = 0; i < itemNames.length; i++) {
//       const model = await loadGLTF(
//         "./assets/models/" + itemNames[i] + "/scene.gltf"
//       );
//       normalizeModel(model.scene, itemHeights[i]);
//       const item = new THREE3.Group();
//       item.add(model.scene);
//       item.visible = false;
//       setOpacity(item, 0.5);
//       items.push(item);
//       scene.add(item);
//     }

//     let selectedItem = null;
//     let prevTouchPosition = null;
//     let touchDown = false;

//     const itemButtons = document.querySelector("#item-buttons");
//     const confirmButtons = document.querySelector("#confirm-buttons");
//     itemButtons.style.display = "block";
//     confirmButtons.style.display = "none";

//     const select = (selectItem) => {
//       items.forEach((item) => {
//         //start animations
//         // if(item.animations){
//         // const mixer = new THREE3.AnimationMixer(item.scene);
//         // const action = mixer.clipAction(item.animations[0]);
//         // action.play();}
//         item.visible = item === selectItem;
//       });
//       selectedItem = selectItem;
//       itemButtons.style.display = "none";
//       confirmButtons.style.display = "block";
//       //start animations

//       // const clock = new THREE3.Clock();

//       // // await mindarThree.start();
//       // renderer.setAnimationLoop(() => {
//       //   const delta = clock.getDelta();
//       //   mixer.update(delta);
//       //   renderer.render(scene, camera);
//       // });
//     };
//     const cancelSelect = () => {
//       itemButtons.style.display = "block";
//       confirmButtons.style.display = "none";
//       if (selectedItem) {
//         selectedItem.visible = false;
//       }
//       selectedItem = null;
//     };

//     const placeButton = document.querySelector("#place");
//     const cancelButton = document.querySelector("#cancel");
//     placeButton.addEventListener("beforexrselect", (e) => {
//       e.preventDefault();
//     });
//     placeButton.addEventListener("click", (e) => {
//       e.preventDefault();
//       e.stopPropagation();
//       const spawnItem = deepClone(selectedItem);
//       setOpacity(spawnItem, 1.0);
//       scene.add(spawnItem);

//       // // start animations
//       // if(spawnItem.animations){
//       //   console.log(spawnItem)
//       //   const mixer = new THREE3.AnimationMixer(spawnItem.scene);
//       //   const action = mixer.clipAction(spawnItem.animations[0]);
//       //   action.play();
//       //   // await mindarThree.start();
//       //   renderer.setAnimationLoop(() => {
//       //     const delta = clock.getDelta();
//       //     mixer.update(delta);
//       //     renderer.render(scene, camera);
//       //   });
//       // }
      

//       cancelSelect();
//     });
//     cancelButton.addEventListener("beforexrselect", (e) => {
//       e.preventDefault();
//     });
//     cancelButton.addEventListener("click", (e) => {
//       e.preventDefault();
//       e.stopPropagation();
//       cancelSelect();
//     });

//     for (let i = 0; i < items.length; i++) {
//       const el = document.querySelector("#item" + i);
//       el.addEventListener("beforexrselect", (e) => {
//         e.preventDefault();
//       });
//       el.addEventListener("click", (e) => {
//         e.preventDefault();
//         e.stopPropagation();
//         select(items[i]);
//       });
//     }

//     const controller = renderer.xr.getController(0);
//     scene.add(controller);
//     controller.addEventListener("selectstart", (e) => {
//       touchDown = true;
//     });
//     controller.addEventListener("selectend", (e) => {
//       touchDown = false;
//       prevTouchPosition = null;
//     });

//     renderer.xr.addEventListener("sessionstart", async (e) => {
//       const session = renderer.xr.getSession();
//       const viewerReferenceSpace = await session.requestReferenceSpace(
//         "viewer"
//       );
//       const hitTestSource = await session.requestHitTestSource({
//         space: viewerReferenceSpace,
//       });

//       renderer.setAnimationLoop((timestamp, frame) => {
//         if (!frame) return;

//         const referenceSpace = renderer.xr.getReferenceSpace(); // ARButton requested 'local' reference space
//         if (touchDown && selectedItem) {
//           const viewerMatrix = new THREE3.Matrix4().fromArray(
//             frame.getViewerPose(referenceSpace).transform.inverse.matrix
//           );
//           const newPosition = controller.position.clone();
//           newPosition.applyMatrix4(viewerMatrix); // change to viewer coordinate
//           if (prevTouchPosition) {
//             const deltaX = newPosition.x - prevTouchPosition.x;
//             const deltaZ = newPosition.y - prevTouchPosition.y;
//             selectedItem.rotation.y += deltaX * 30;
//           }
//           prevTouchPosition = newPosition;
//         }

//         if (selectedItem) {
//           const hitTestResults = frame.getHitTestResults(hitTestSource);
//           if (hitTestResults.length) {
//             const hit = hitTestResults[0];
//             // start animations
//             // if(selectedItem.animations){
//             // const mixer = new THREE3.AnimationMixer(selectedItem.scene);
//             // const action = mixer.clipAction(selectedItem.animations[0]);
//             // action.play();}
//             // // await mindarThree.start();
//             // renderer.setAnimationLoop(() => {
//             //   const delta = clock.getDelta();
//             //   mixer.update(delta);
//             //   renderer.render(scene, camera);
//             // });

//             selectedItem.visible = true;
//             selectedItem.position.setFromMatrixPosition(
//               new THREE3.Matrix4().fromArray(
//                 hit.getPose(referenceSpace).transform.matrix
//               )
//             );
//           } else {
//             selectedItem.visible = false;
//           }
//         }

//         renderer.render(scene, camera);
//       });
//     });
//   };
//   initialize();
// });
