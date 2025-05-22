import React, { useState, useEffect } from "react";

export default function UploadImage({ onFileSelected }) {
  const [isMobile, setIsMobile] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const mobileCheck = /android|iphone|ipad|ipod/i.test(userAgent.toLowerCase());
    setIsMobile(mobileCheck);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onFileSelected(file);
    }
  };

  return (
    <div className="space-y-4">
      {isMobile ? (
        <div>
          <label className="block font-medium mb-2">📸 Scan Using Camera:</label>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="block"
          />
        </div>
      ) : (
        <div>
          <label className="block font-medium mb-2">🗂️ Upload Handwritten Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block"
          />
        </div>
      )}

      {previewUrl && (
        <div>
          <h3 className="font-semibold mt-4">📄 Preview:</h3>
          <img src={previewUrl} alt="Preview" className="max-h-64 border rounded" />
        </div>
      )}
    </div>
  );
}
