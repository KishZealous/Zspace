import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { storage, ref, getDownloadURL } from "./firebase";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, Center } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Button } from "@mui/material";
import * as THREE from "three";

const ShareARPage = () => {
  const { projectName } = useParams();
  const [modelUrl, setModelUrl] = useState(null);
  const [usdzUrl, setUsdzUrl] = useState(null);   // USDZ URL
  const [skybox, setSkybox] = useState("studio");
  const [background, setBackground] = useState("#ffffff");
  const [loading, setLoading] = useState(true); // Correct state variable
  const [modelLoading, setModelLoading] = useState(false);
  const controlsRef = useRef();

  // Fetch AR data from Firebase
  useEffect(() => {
    const loadARData = async () => {
      setLoading(true);
      try {
        const jsonRef = ref(storage, `projects/${projectName}/share-ar-data.json`);
        const jsonUrl = await getDownloadURL(jsonRef);
        const response = await fetch(jsonUrl);

        if (!response.ok) {
          throw new Error(`Failed to fetch AR data: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Fetched AR Data:", data); // Debug: Log the fetched data
        setModelUrl(data.modelUrl); // GLB URL
        setUsdzUrl(data.usdzUrl);   // USDZ URL
        setSkybox(data.skybox || "studio");
        setBackground(data.background || "#ffffff");
      } catch (error) {
        console.error("Error loading AR data:", error);
        setModelUrl("");
        setUsdzUrl("");
      } finally {
        setLoading(false);
      }
    };

    if (projectName) {
      loadARData();
    }
  }, [projectName]);

  // Function to open AR mode
  const openARView = () => {
    if (!modelUrl) {
      alert("Model not found!");
      console.log("No modelUrl available.");
      return;
    }

    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);

    console.log("Device Detection:", { isIOS, isAndroid }); // Debug: Log device type
    console.log("URLs:", { modelUrl, usdzUrl }); // Debug: Log available URLs

    if (isIOS) {
      if (usdzUrl) {
        console.log("Opening USDZ on iOS:", usdzUrl);
        window.location.href = usdzUrl; // Use USDZ for iOS (same as SharePage)
      } else {
        alert("No USDZ file available for AR. Please upload a USDZ file when sharing.");
        console.log("No USDZ URL found for iOS.");
      }
    } else if (isAndroid) {
      console.log("Opening GLB on Android:", modelUrl);
      window.location.href = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(
        modelUrl
      )}&mode=ar_preferred#Intent;scheme=https;package=com.google.android.googlequicksearchbox;end;`;
    } else if (navigator.xr) {
      alert("WebXR not implemented yet. Try opening this on a mobile device for AR.");
      console.log("WebXR detected but not implemented.");
    } else {
      alert("Your device does not support AR.");
      console.log("Non-mobile device detected.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      {modelLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Loading Model...</p>
        </div>
      )}

      {/* 3D Canvas for Model Viewing */}
      <Canvas
        camera={{ position: [0, 0, 3], fov: 40 }}
        dpr={[1, 2]}
        style={{ background }}
      >
        <ambientLight intensity={0.2} />
        <OrbitControls ref={controlsRef} />
        <Environment preset={skybox} background={false} />
        <Center>
          <ModelViewer modelUrl={modelUrl} setModelLoading={setModelLoading} />
        </Center>
      </Canvas>


{/* Share button and exit button */}
    <div className="preview-viewer-container">

    <Button 
      className="movebutton"
      variant="contained"
      startIcon={<img src="/icons/arrows.svg" />} onClick={handleMove}
      
    ></Button>

    <Button 
      className="zoomout"
      variant="contained"
      startIcon={<img src="/icons/zoom-out.svg" />}  onClick={handleZoomOut}
    
    ></Button>

    <Button 
      className="zoomin"
      variant="contained"
      startIcon={<img src="/icons/zoom-in.svg"/>}
    onClick={handleZoomIn}
    ></Button>

    <Button 
      className="colorpicker"
      variant="contained"
      startIcon={<img src="/icons/color-wheel.png" />} onClick={toggleColorPicker}  ></Button>
    </div>

{/* Preview model area showing position, scale and color 
      <div
        className="preview-model"
        style={{
          marginTop: 20,
          width: 300,
          height: 300,
          backgroundColor: color,
          transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
          transition: "transform 0.3s ease",
          border: "1px solid #ccc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          userSelect: "none",
        }}
      >
        <p></p>
      </div>*/}


      {/* Color picker dialog */}
      <Dialog open={colorPickerOpen} onClose={toggleColorPicker}>
        <DialogTitle>Pick a Color</DialogTitle>
        <DialogContent>
          <input
            type="color"
            value={color}
            onChange={handleColorChange}
            style={{ width: "100%", height: 40, border: "none",borderRadius:'5',cursor:'pointer',
          backgroundColor: color,
          transition: "transform 0.3s ease",
           }}
          />
        </DialogContent>
      </Dialog>

      {/* AR Button */}
      <div className='Arviewbutton-container'
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
        }}
      >
        {/* <Button
          variant="contained"
          startIcon={<img className="Aricon-icon" src="/icons/Aricon.svg" alt="AR Icon" />}  
          onClick={openARView}
        >
          See in Your Space
        </Button> */}

        <Button 
          className="ARbutton"
          variant="contained"
          startIcon={<img className="Aricon-icon" src="/icons/Aricon.svg" />}
          onClick={openARView}
        >
          See in your Space
        </Button>

        
      </div>
    </div>
  );
};

// ModelViewer Component
const ModelViewer = ({ modelUrl, setModelLoading }) => {
    const { scene, camera, controls } = useThree();
    const [model, setModel] = useState(null);
  
    useEffect(() => {
      if (modelUrl) {
        setModelLoading(true);
        const loader = new GLTFLoader();
  
        if (model) {
          scene.remove(model.scene);
        }
  
        loader.load(
          modelUrl,
          (gltf) => {
            const modelScene = gltf.scene;
            const box = new THREE.Box3().setFromObject(modelScene);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());
  
            modelScene.position.sub(center);
  
            const maxDim = Math.max(size.x, size.y, size.z);
            const fov = camera.fov * (Math.PI / 180);
            const cameraZ = Math.abs(maxDim / (2 * Math.tan(fov / 2)));
  
            camera.position.set(center.x, center.y, cameraZ + maxDim);
            camera.lookAt(center);
  
            if (controls) {
              controls.target.set(center.x, center.y, center.z);
              controls.update();
            }
  
            scene.add(modelScene);
            setModel(gltf);
            setModelLoading(false);
          },
          undefined,
          (error) => {
            console.error("Error loading model:", error);
            setModelLoading(false);
          }
        );
      }
    }, [modelUrl, scene, camera, controls, setModelLoading]);
  
    return null;
  };

export default ShareARPage;