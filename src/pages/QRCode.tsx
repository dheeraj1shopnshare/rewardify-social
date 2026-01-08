import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

async function adminAuthFetch(action: string) {
  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-auth`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      },
      credentials: 'include',
      body: JSON.stringify({ action }),
    }
  );
  return response.json();
}

const QRCode = () => {
  const navigate = useNavigate();
  const [qrUrl, setQrUrl] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  const baseUrl = window.location.origin;
  const targetUrl = `${baseUrl}/auth?qr=true`;

  useEffect(() => {
    validateAdminSession();
  }, []);

  const validateAdminSession = async () => {
    try {
      const data = await adminAuthFetch('validate');

      if (!data?.valid) {
        navigate('/admin/login');
        return;
      }

      setIsAuthorized(true);
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(targetUrl)}`;
      setQrUrl(qrApiUrl);
    } catch (err) {
      console.error('Session validation error:', err);
      navigate('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'berry-rewards-qr-code.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

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

        <Button onClick={handleDownload} className="mb-4">
          <Download className="mr-2 h-4 w-4" />
          Download QR Code
        </Button>
        
        <p className="text-sm text-muted-foreground break-all">
          {targetUrl}
        </p>
      </div>
    </div>
  );
};

export default QRCode;
