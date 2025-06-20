// import React, { useState, useEffect, useRef, Suspense } from "react";
// import { Button, Dialog, DialogTitle, DialogContent, Popover, ClickAwayListener } from "@mui/material";
// import { QRCodeCanvas } from "qrcode.react";
// import { Canvas } from "@react-three/fiber";
// import { OrbitControls, useGLTF } from "@react-three/drei";

// const Model = ({ url, color, position, scale }) => {
//   const gltf = useGLTF(url, true);
//   return (
//     <primitive
//       object={gltf.scene}
//       scale={scale}
//       position={[position.x, position.y, 0]}
//     >
//       <meshStandardMaterial attach="material" color={color} />
//     </primitive>
//   );
// };

// const PreviewViewer = () => {
//   const modelUrl = "https://modelviewer.dev/shared-assets/models/Astronaut.glb"; // replace with your .glb URL
//   console.log("🔗 Model URL received in PreviewViewer:", modelUrl);

//   const [qrOpen, setQrOpen] = useState(false);
//   const [shortUrl, setShortUrl] = useState(null);

//   const [scale, setScale] = useState(1);
//   const [colorPickerOpen, setColorPickerOpen] = useState(false);
//   const [color, setColor] = useState("#ffffff");
//   const colorPickerAnchorRef = useRef(null);
//   const [position, setPosition] = useState({ x: 0, y: 0 });

//   useEffect(() => {
//     if (modelUrl) {
//       const shortenUrl = async () => {
//         try {
//           const response = await fetch(
//             `https://tinyurl.com/api-create.php?url=${encodeURIComponent(modelUrl)}`
//           );
//           const shortened = await response.text();
//           setShortUrl(shortened);
//           console.log("✅ Shortened URL:", shortened);
//         } catch (error) {
//           console.error("❌ Short URL generation failed:", error);
//           setShortUrl(modelUrl);
//         }
//       };
//       shortenUrl();
//     }
//   }, [modelUrl]);

//   const handleARView = () => setQrOpen(true);
//   const handleCloseQR = () => setQrOpen(false);
//   const qrCodeValue = shortUrl || modelUrl;

//   const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.1, 3));
//   const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.1, 0.3));
//   const handleMove = () => setPosition((prev) => ({ x: prev.x + 0.1, y: prev.y }));

//   const toggleColorPicker = () => setColorPickerOpen((open) => !open);
//   const handleClickAway = () => setColorPickerOpen(false);
//   const handleColorChange = (e) => setColor(e.target.value);

//   return (
//     <div>
//       <div className="preview-viewer-container">
//         <Button
//           className="movebutton"
//           variant="contained"
//           startIcon={<img src="/icons/arrows.svg" alt="move icon" />}
//           onClick={handleMove}
//         ></Button>

//         <Button
//           className="zoomout"
//           variant="contained"
//           startIcon={<img src="/icons/zoom-out.svg" alt="zoom out icon" />}
//           onClick={handleZoomOut}
//         ></Button>

//         <Button
//           className="zoomin"
//           variant="contained"
//           startIcon={<img src="/icons/zoom-in.svg" alt="zoom in icon" />}
//           onClick={handleZoomIn}
//         ></Button>

//         <Button
//           ref={colorPickerAnchorRef}
//           className="colorpicker"
//           variant="contained"
//           startIcon={<img src="/icons/color-wheel.png" alt="Color picker icon" />}
//           onClick={toggleColorPicker}
//           style={{
//             backgroundColor: color,
//             color: "#000",
//             border: "1px solid #ccc",
//           }}
//         ></Button>
//       </div>

//       <Popover
//         open={colorPickerOpen}
//         anchorEl={colorPickerAnchorRef.current}
//         onClose={() => setColorPickerOpen(false)}
//         anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
//         transformOrigin={{ vertical: "top", horizontal: "left" }}
//         PaperProps={{
//           style: { padding: 10, display: "flex", alignItems: "center" },
//         }}
//       >
//         <ClickAwayListener onClickAway={handleClickAway}>
//           <input
//             type="color"
//             value={color}
//             onChange={handleColorChange}
//             style={{
//               width: 40,
//               height: 40,
//               border: "none",
//               cursor: "pointer",
//               borderRadius: 5,
//               padding: 0,
//               margin: 0,
//             }}
//           />
//         </ClickAwayListener>
//       </Popover>

//       <div style={{ height: "400px", marginTop: "20px", border: "1px solid #ccc" }}>
//         <Canvas camera={{ position: [0, 0, 3] }}>
//           <ambientLight intensity={0.5} />
//           <directionalLight position={[5, 5, 5]} />
//           <Suspense fallback={null}>
//             <Model url={modelUrl} color={color} position={position} scale={scale} />
//           </Suspense>
//           <OrbitControls />
//         </Canvas>
//       </div>

//       <div className="Arviewbutton-container">
//         <Button
//           className="ARbutton"
//           variant="contained"
//           startIcon={<img className="Aricon-icon" src="/icons/Aricon.svg" alt="AR icon" />}
//           onClick={handleARView}
//         >
//           See in your Space
//         </Button>
//       </div>

//       <Dialog open={qrOpen} onClose={handleCloseQR}>
//         <DialogTitle>Scan QR Code for AR View</DialogTitle>
//         <DialogContent>
//           {qrCodeValue ? (
//             <QRCodeCanvas value={qrCodeValue} size={256} />
//           ) : (
//             <p>Model URL is not available</p>
//           )}
//           <p>Scan this QR code with your mobile device to view the model in AR.</p>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default PreviewViewer;










//  new code

import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Popover,
  ClickAwayListener,IconButton,
} from "@mui/material";
import { QRCodeCanvas } from "qrcode.react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";


const getArViewerUrl = (modelUrl, type = "google") => {
  switch (type) {
    case "google":
      return `https://arvr.google.com/?model=${encodeURIComponent(modelUrl)}`;
    default:
      return modelUrl;
  }
};

const Model = ({ modelUrl, color, scale, position }) => {
  const { scene } = useGLTF(modelUrl);
  scene.traverse((child) => {
    if (child.isMesh) child.material.color.set(color);
  });
  return (
    <primitive
      object={scene}
      scale={scale}
      position={[position.x, position.y, position.z]}
    />
  );
};

const PreviewViewer = () => {
  const [modelUrl, setModelUrl] = useState(null);
  const [qrOpen, setQrOpen] = useState(false);
  const [shortUrl, setShortUrl] = useState(null);
  const [scale, setScale] = useState(1);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [color, setColor] = useState("#ffffff");
  const colorPickerAnchorRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 });

  const arType = "google";

  useEffect(() => {
    setModelUrl("https://modelviewer.dev/shared-assets/models/Astronaut.glb");
  }, []);

  useEffect(() => {
    if (modelUrl) {
      const arViewerUrl = getArViewerUrl(modelUrl, arType);
      const shortenUrl = async () => {
        try {
          const response = await fetch(
            `https://tinyurl.com/api-create.php?url=${encodeURIComponent(arViewerUrl)}`
          );
          const shortened = await response.text();
          setShortUrl(shortened);
        } catch {
          setShortUrl(arViewerUrl);
        }
      };
      shortenUrl();
    }
  }, [modelUrl, arType]);

  if (!modelUrl) return <p>Loading 3D model URL...</p>;

  const qrCodeValue = shortUrl || modelUrl;

  const handleARView = () => setQrOpen(true);
  const handleCloseQR = () => setQrOpen(false);
  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.1, 3));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.1, 0.3));
  const toggleColorPicker = () => setColorPickerOpen((open) => !open);
  const handleClickAway = () => setColorPickerOpen(false);
  const handleColorChange = (e) => setColor(e.target.value);

  // Move along X axis by +1 unit on each click
  const moveRight = () => setPosition((pos) => ({ ...pos, x: pos.x + 1 }));

  return (
    <div>
      <div className="preview-viewer-container" style={{ marginBottom: 10 }}>
        <Button
          className="movebutton"
          variant="contained"
          // startIcon={<img src="/icons/arrows.svg" alt="move icon" sx={{objectFit: 'contain',}} />}
          onClick={moveRight} 
          sx={{
              width: 47,
              height: 47,
              borderRadius: '20%',
              padding: 0,
              minWidth: 0,         // Prevents default min width
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              '& .MuiButton-startIcon': {
                margin: 0, // remove default left margin
              },
            }}> 
            <img  src="/icons/arrows.svg"  alt="move icon"  style={{ width: 24, height: 24, objectFit: 'contain' }}  /></Button>

        <Button
          className="zoomout"
          variant="contained"
          startIcon={<img src="/icons/zoom-out.svg" alt="zoom out icon" sx={{objectFit: 'contain',}} />}
          onClick={handleZoomOut} 
          sx={{
              width: 47,
              height: 47,
              borderRadius: '20%',
              padding: 0,
              minWidth: 0,         // Prevents default min width
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              '& .MuiButton-startIcon': {
                margin: 0, // remove default left margin
              },
            }}
        ></Button>

        <Button
          className="zoomin"
          variant="contained"
          startIcon={<img src="/icons/zoom-in.svg" alt="zoom in icon" sx={{objectFit: 'contain',}} />}
          onClick={handleZoomIn} 
          sx={{
            
              width: 47,
              height: 47,
              borderRadius: '20%',
              padding: 0,
              minWidth: 0,         // Prevents default min width
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              '& .MuiButton-startIcon': {
                margin: 0, // remove default left margin
              },
            }}
        ></Button>

        {/* Color picker button */}
        <Button
          ref={colorPickerAnchorRef}
          className="colorpicker"
          variant="contained"
          startIcon={<img src="/icons/color-wheel.png" alt="Color picker icon" sx={{objectFit: 'contain',}} />}
          onClick={toggleColorPicker}
          style={{
            backgroundColor: color,
            color: "#000",
            border: "1px solid #ccc",
          }} 
          sx={{
              width: 47,
              height: 47,
              borderRadius: '20%',
              padding: 0,
              minWidth: 0,         // Prevents default min width
             display: 'flex',
             justifyContent: 'center',
             alignItems: 'center',
              '& .MuiButton-startIcon': {
              margin: 0, // remove default left margin
            },
            }}
        ></Button>
      </div>

      <Popover
        open={colorPickerOpen}
        anchorEl={colorPickerAnchorRef.current}
        onClose={() => setColorPickerOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <ClickAwayListener onClickAway={handleClickAway}>
          <input
            type="color"
            value={color}
            onChange={handleColorChange}
            style={{
              width: 40,
              height: 40,
              border: "none",
              cursor: "pointer",
              borderRadius: 5,
            }}
          />
        </ClickAwayListener>
      </Popover>

      {/* <div 
        style={{
          marginTop: 20,
          width: 500,
          height: 500,
          border: "1px solid #ccc",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <Canvas camera={{ position: [0, 1, 5] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <gridHelper args={[10, 10]} />
          <axesHelper args={[5]} />
          <Model modelUrl={modelUrl} color={color} scale={scale} position={position} />
          <OrbitControls />
        </Canvas>
      </div> */}

      <div className="Arviewbutton-container">
        <Button
          className="ARbutton"
          variant="contained"
          startIcon={<img className="Aricon-icon" src="/icons/Aricon.svg" alt="AR icon" />}
          onClick={handleARView}
        >
          See in your Space
        </Button>
      </div>

      {/* === Added 3 buttons at bottom center to change X position === */}
     <div
      style={{
        position: "fixed",
        bottom: 50,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: 5,
        zIndex: 1000,
        background: "rgba(255, 255, 255, 0.9)",
        padding: "4px 6px",
        borderRadius: "10px",
        boxShadow: "0 3px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      {[{ x: 30 }, { x: 50 }, { x: -50 }].map((pos, i) => (
    <IconButton
      key={i}
      aria-label={`icon${i + 1}`}
      onClick={() => setPosition({ x: pos.x, y: 0, z: 0 })}
      size="small"
      sx={{
        backgroundColor: "#f0f0f0",
        borderRadius: "50%",
        padding: "3px",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          backgroundColor: "#e0e0e0",
          // transform: "scale(1.1)",
        },
      }}
    >
      <img
        src="/icons/circle-line-icon.svg"
        alt={`Icon ${i + 1}`}
        width={20}
        height={20}
        style={{ display: "block" }}
      />
    </IconButton>
  ))}
</div>

      <Dialog open={qrOpen} onClose={handleCloseQR}>
        <DialogTitle style={{ textAlign: "center" }}>Scan QR Code </DialogTitle>
        {/* for AR View */}
        <DialogContent>
          {qrCodeValue ? (
            <div
              style={{
                border: "2px solid #E0E0E0",
                borderRadius: "12px",
                padding: "16px",
                display: "inline-block",
                backgroundColor: "#fff",
              }}
            >
              <QRCodeCanvas value={qrCodeValue} size={250} />
            </div>
          ) : (
            <p>Model URL is not available</p>
          )}
          <p style={{ textAlign: "center" }}>Scan to view the model in AR.</p>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PreviewViewer;


