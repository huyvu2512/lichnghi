import React, { useState } from 'react';

// html2canvas is loaded from a script tag in index.html, so we declare it globally.
declare const html2canvas: any;

interface DownloadButtonProps {
  elementId: string;
  currentDate: Date;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ elementId, currentDate }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    const captureElement = document.getElementById(elementId);
    if (!captureElement) {
      console.error('Element to capture not found!');
      return;
    }

    setIsDownloading(true);

    const buttonElement = document.getElementById('download-calendar-button');

    try {
      if (buttonElement) buttonElement.style.visibility = 'hidden';

      const canvas = await html2canvas(captureElement, {
        useCORS: true,
        scale: 2, // Higher resolution for better quality
        backgroundColor: '#ffffff', // Explicitly set background to white to avoid transparency
      });
      
      if (buttonElement) buttonElement.style.visibility = 'visible';

      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const filename = `Lich-Nghi-Thang-${month}-${year}.png`;

      const image = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.href = image;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error('Error generating image:', error);
      // Ensure the button is visible again in case of an error
      if (buttonElement) buttonElement.style.visibility = 'visible';
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      id="download-calendar-button"
      onClick={handleDownload}
      disabled={isDownloading}
      className="p-2 rounded-full text-gray-500 hover:bg-gray-200/60 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label="Tải ảnh lịch tháng này"
      title="Tải ảnh lịch tháng này"
    >
      {isDownloading ? (
        <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      )}
    </button>
  );
};

export default DownloadButton;