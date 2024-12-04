export default function handler(req, res) {
    const { itemId } = req.query;
  
    // Sample data for input fields based on the selected second set item
    const inputs = {
      m1: [
        { id: "themeName", type: "text", label: "Theme Name", placeholder: "Enter theme name", name: "themeName" },
        { id: "licenseKey", type: "text", label: "License Key", placeholder: "Enter license key", name: "licenseKey" },
      ],
      m2: [
        { id: "extensionName", type: "text", label: "Extension Name", placeholder: "Enter extension name", name: "extensionName" },
        { id: "supportEmail", type: "email", label: "Support Email", placeholder: "Enter support email", name: "supportEmail" },
      ],
      w1: [
        { id: "pluginName", type: "text", label: "Plugin Name", placeholder: "Enter plugin name", name: "pluginName" },
        { id: "apiToken", type: "text", label: "API Token", placeholder: "Enter API token", name: "apiToken" },
      ],
      w2: [
        { id: "themeName", type: "text", label: "Theme Name", placeholder: "Enter theme name", name: "themeName" },
        { id: "downloadUrl", type: "url", label: "Download URL", placeholder: "Enter download URL", name: "downloadUrl" },
      ],
    };
  
    const response = inputs[itemId] || [];
  
    res.status(200).json(response);
  }
  