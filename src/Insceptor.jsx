// inspector.jsx

import React, { useState, useEffect } from 'react';
import { IconButton, Switch } from '@mui/material';
import Button from "@mui/material/Button";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SettingsIcon from "@mui/icons-material/Settings";
import GridOnIcon from "@mui/icons-material/GridOn";
import GridOffIcon from "@mui/icons-material/GridOff";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

// const BgcustomColors = ["#EBEBEB", "#F7F7F7", "#3E3E3E", "#1C1A1D"];

const Inspector = ({
  selectedModel,
  onSkyboxChange,
  setShowPreview,
  setModelSettings,
  setShowGrid,
  showGrid,
  onVariantUpload, // New prop for handling variant upload
  onToggleVariant, // New prop for toggling between variants
  variants, // Array of variants
  currentVariantIndex,
}) => {
  // if (!selectedModel) {
  //   return <div className="no-model-message">No model Uploaded</div>;
  // }
  const modelName = selectedModel?.scene?.name || "Unnamed Model";
  return (
    <Box
      sx={{
        width: 230,
        bgcolor: "background.level1",
        p: 2,
        height: "100vh",
        overflowY: "auto",
        borderLeft: "5px solid",
        borderColor: "divider",
        boxShadow: "sm",
      }}
    >
      {/* Model Info
      <Box sx={{ mb: 3, p: 2, borderRadius: "sm", boxShadow: "xs" }}>
        <Typography level="h4" sx={{ mb: 1.5, fontWeight: "lg" }}>
          Model Inspector
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <Typography level="body-sm">
            <strong>Name:</strong> {selectedModel.scene.name || "Unnamed"}
          </Typography>
          <Typography level="body-sm">
            <strong>Objects:</strong> {selectedModel.scene.children.length}
          </Typography>
        </Box>
      </Box> */}

      {/* Background Settings */}
      <BackgroundSetting setModelSettings={setModelSettings} />

      {/* Skybox Settings */}
      <SkyboxSetting onSkyboxChange={onSkyboxChange} />

      {/* Variant Settings 
      <VariantSettings
        onVariantUpload={onVariantUpload}
        onToggleVariant={onToggleVariant}
        variants={variants}
        currentVariantIndex={currentVariantIndex}
        selectedModel={selectedModel}
      />*/}

      {/* Preview Button */}
      <PreviewButton setShowPreview={setShowPreview} />

      {/* Grid Setting Component */}
      <GridSetting setShowGrid={setShowGrid} showGrid={showGrid} />
    </Box>
  );
};

// const BackgroundSetting = ({ setModelSettings }) => {
//   const handleColorChange = (color) => {
//     setModelSettings((prev) => ({ ...prev, background: color }));

//     const appBgElements = document.getElementsByClassName("AppBg");
//     for (let element of appBgElements) {
//       element.style.backgroundColor = color;
//     }
//   };

//   return (
//     <Box
//       sx={{
//         p:3,
//         border: '2px solid #1976d2',
//         borderRadius: 12,
//         mb: 2,
//       }}
//     >
//       <Typography
//         level="h6"
//         sx={{ mb: 2, display: "flex", alignItems: "center", fontWeight: "bold" }}
//       >
//         {/* <SettingsIcon sx={{ mr: 1, fontSize: "1rem" }} /> */}
//         Background Settings
//       </Typography>
//       <BackgroundColorSelector
//         colors={BgcustomColors}
//         defaultColor="#EBEBEB"
//         onColorChange={handleColorChange}
//       />
//     </Box>
//   );
// };

const BackgroundSetting = ({ setModelSettings }) => {
  const defaultColor = "#EBEBEB"; // Light Gray

  const colorNameMap = {
    "#EBEBEB": "Light Gray",
    "#F7F7F7": "Off White",
    "#3E3E3E": "Dark Gray",
    "#1C1A1D": "Almost Black",
  };

  // Set default background color on mount
  useEffect(() => {
    setModelSettings((prev) => ({ ...prev, background: defaultColor }));

    const appBgElements = document.getElementsByClassName("AppBg");
    for (let element of appBgElements) {
      element.style.backgroundColor = defaultColor;
    }
  }, []);

  const handleColorChange = (color) => {
    setModelSettings((prev) => ({ ...prev, background: color }));

    const appBgElements = document.getElementsByClassName("AppBg");
    for (let element of appBgElements) {
      element.style.backgroundColor = color;
    }
  };

  return (
    <Box
      sx={{
        p: 0,
        borderRadius: 5,
        mb: 0.5,
        gap: 1,
        width: 199,
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginLeft: -1.2,
      }}
    >
      <Typography
        level="subtitle1"
        sx={{
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif',
          color: 'primary.main',
        }}
      >
        Background
      </Typography>

      <BackgroundColorSelector
        colors={Object.keys(colorNameMap)}
        defaultColor={defaultColor}
        onColorChange={handleColorChange}
        colorNameMap={colorNameMap}
      />
    </Box>
  );
};

const BackgroundColorSelector = ({ colors, defaultColor, onColorChange, colorNameMap }) => {
  const [selected, setSelected] = useState(defaultColor || colors[0]);

  useEffect(() => {
    setSelected(defaultColor);
  }, [defaultColor]);

  const handleChange = (_, newValue) => {
    setSelected(newValue);
    onColorChange(newValue);
  };

  return (
    <Select
      value={selected}
      onChange={handleChange}
      size="sm"
      sx={{ width: 120, minWidth: 20, minHeight: 20 }}
    >
      {colors.map((color) => (
        <Option key={color} value={color}>
          <Box
            component="span"
            sx={{
              display: 'inline-block',
              width: 16,
              height: 16,
              borderRadius: '50%',
              bgcolor: color,
              border: '1px solid #ccc',
              marginRight: 1,
              verticalAlign: 'middle',
              color: 'white',
            }}
          />
          <span style={{ fontSize: '12px', verticalAlign: 'middle' }}>
            {colorNameMap[color] || color}
          </span>
        </Option>
      ))}
    </Select>
  );
};

const SkyboxSetting = ({ onSkyboxChange }) => {
  const skyboxOptions = [
    { value: "apartment", label: "Apartment" },
    { value: "city", label: "City" },
    { value: "dawn", label: "Dawn" },
    { value: "forest", label: "Forest" },
    { value: "lobby", label: "Lobby" },
    { value: "night", label: "Night" },
    { value: "park", label: "Park" },
    { value: "studio", label: "Studio" },
    { value: "sunset", label: "Sunset" },
    { value: "warehouse", label: "Warehouse" },
  ];

  const handleChange = (event, newValue) => {
    onSkyboxChange(newValue);
  };

  return (
    <Box
      sx={{
        width: 193,
        display:'flex',
        gap: 4, 
        alignItems:'center',
        marginLeft:-0.6,
        // border: '2px solid #D3D3D3', 
        borderRadius: 5, mt: 1, mzxWidth:400,
      }}>
      <Typography level="subtitle1"  sx={{fontSize:'12px', color: 'primary.main',fontFamily: "Inter, sans-serif"}} >
        {/* <SettingsIcon sx={{ mr: 1, fontSize: "1rem" }} /> */}
        Skybox  
      </Typography>
      <Select
        defaultValue="city"
        onChange={(e) => handleChange(null, e.target.value)}
        size="sm"
        sx={{ width: "100%",minWidth: 20, minHeight:20, }}
      >
        {skyboxOptions.map(({ value, label }) => (
          <Option key={value} value={value}>
            {label}
          </Option>
        ))}
      </Select>
    </Box>
  );
};

const PreviewButton = ({ setShowPreview }) => {
  return (
    <Box
      sx={{
        // p: 2,
        // border: '2px solid #D3D3D3',
        marginLeft:-0.5,
        borderRadius: 5,
        mt: 1,
        gap:8,
        // height:45,
        width: 50,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}  >
      <Typography level="subtitle1"  sx={{fontSize:'12px',fontFamily: "Inter, sans-serif", color: 'primary.main'}} >
        Preview
      </Typography>
      <IconButton
        onClick={() => setShowPreview(true)}
        sx={{
          p: 0.15,
          // backgroundColor: 'transparent',
          border: '1px solid grey',
          borderRadius: 2,
          transition: 'all 0.3s ease',
          color: 'black',
          '&:hover': {
            backgroundColor: 'black',
            color: 'white',
          },
        }}
      >
        <RemoveRedEyeIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

const GridSetting = ({ showGrid, setShowGrid }) => {
  const handleToggle = () => {
    setShowGrid((prev) => !prev);
  };

  return (
    <Box
      sx={{
        width: 180,
        marginLeft: -0.6,
        borderRadius: 5,
        mt: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Typography
        level="subtitle1"
        sx={{
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif',
          color: 'primary.main',
        }}
      >
        Grid
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {showGrid ? <GridOnIcon sx={{ color: '#1976d2' }} /> : <GridOffIcon sx={{ color: '#aaa' }} />}
        <Switch
          checked={showGrid}
          onChange={handleToggle}
          variant="outlined"
          color={showGrid ? 'primary' : 'neutral'}
        />
      </Box>
    </Box>
  );
};

const VariantSettings = ({
  onVariantUpload,
  onToggleVariant,
  variants = [],
  currentVariantIndex,
  selectedModel,
}) => {
   // const [hasVariants, setHasVariants] = useState(false);

  // const handleToggleVariants = (event) => {
  //   setHasVariants(event.target.checked);
  //   if (!event.target.checked) {
  //     onToggleVariant(0); // Reset to the first variant if variants are disabled
  //   }
  // };
  const handleAddVariant = (file) => {
    if (file) {
      try {
        onVariantUpload(file);
      } catch (error) {
        console.error("Error uploading variant:", error);
        // Optionally, show a user-friendly error message
      }
    }
  };

  // Combine the initial model and uploaded variants into a single list
  const allVariants = selectedModel ? [selectedModel, ...variants] : variants;

  return (
    <Box sx={{ width: 200,marginLeft:-0.5,
    display: 'flex',
    alignItems: 'center',
    gap:0.25,
    borderRadius: 5, mt:1,
    // border: '2px solid #D3D3D3',
  }}
>
  {/* Variant Label */}
  <Typography
    level="subtitle1"
    sx={{
      fontSize: '12px',
      color: 'primary.main',
      fontFamily: 'Inter, sans-serif',
      whiteSpace: 'nowrap',
    }}
  >
    Variant
  </Typography>

  {/* Upload Button */}
  <Button
    variant="outlined"
    component="label"
    startIcon={<CloudUploadIcon />}
    sx={{borderRadius:5, minWidth: 20, minHeight:20,
      transition: "all 0.3s ease","&:hover": {
            backgroundColor: "#1565c0",
            color:'white',
            transform: "scale(1.05)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", 
          },
    }} >
    <input
      type="file"
      hidden
      accept=".glb,.gltf"
      onChange={(e) => handleAddVariant(e.target.files[0])}
    />
  </Button>

  {/* Variant Dropdown */}
  {allVariants.length > 1 && (
    <Select
      value={currentVariantIndex}
      onChange={(event) =>
        onToggleVariant(parseInt(event.target.value, 10))
      }
      size="sm"
      sx={{
        minWidth: 100,minHeight:10,
        fontSize: '13px',
        borderRadius: 5,
        fontWeight: 500,
        flexShrink: 0,
      }}
    >
      {allVariants.map((_, index) => (
        <Option key={index} value={index}>
          Variant {index + 1}
        </Option>
      ))}
    </Select>
  )}
</Box>


  );
};

export default Inspector;
