import { useEffect, useState } from "react";

const QRCode = () => {
  const [qrUrl, setQrUrl] = useState("");

  useEffect(() => {
    // Get the base URL of the current site
    const baseUrl = window.location.origin;
    const targetUrl = `${baseUrl}/auth?qr=true`;
    
    // Use QR Server API to generate QR code
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(targetUrl)}`;
    setQrUrl(qrApiUrl);
  }, []);

  const targetUrl = `${window.location.origin}/auth?qr=true`;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="bg-card rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">Berry Rewards QR Code</h1>
        <p className="text-muted-foreground mb-6">
          Scan this QR code to access the welcome page
        </p>
        
        {qrUrl && (
          <div className="bg-white p-4 rounded-xl inline-block mb-6">
            <img 
              src={qrUrl} 
              alt="QR Code to Berry Rewards" 
              className="w-[300px] h-[300px]"
            />
          </div>
        )}
        
        <p className="text-sm text-muted-foreground break-all">
          {targetUrl}
        </p>
      </div>
    </div>
  );
};

export default QRCode;
