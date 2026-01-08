import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [baseUrl, setBaseUrl] = useState(() => {
    return localStorage.getItem('qr_base_url') || '';
  });

  const targetUrl = baseUrl ? `${baseUrl}/auth?qr=true` : '';
  const qrUrl = targetUrl 
    ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(targetUrl)}`
    : '';

  useEffect(() => {
    validateAdminSession();
  }, []);

  useEffect(() => {
    if (baseUrl) {
      localStorage.setItem('qr_base_url', baseUrl);
    }
  }, [baseUrl]);

  const validateAdminSession = async () => {
    try {
      const data = await adminAuthFetch('validate');

      if (!data?.valid) {
        navigate('/admin/login');
        return;
      }

      setIsAuthorized(true);
    } catch (err) {
      console.error('Session validation error:', err);
      navigate('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!qrUrl) return;
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
          Enter your published app URL to generate the QR code
        </p>

        <div className="space-y-2 mb-6 text-left">
          <Label htmlFor="base-url">Published App URL</Label>
          <Input
            id="base-url"
            type="url"
            placeholder="https://yourapp.lovable.app"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value.replace(/\/$/, ''))}
          />
          <p className="text-xs text-muted-foreground">
            Enter your published URL (e.g., https://yourapp.lovable.app)
          </p>
        </div>
        
        {qrUrl ? (
          <>
            <div className="bg-white p-4 rounded-xl inline-block mb-6">
              <img 
                src={qrUrl} 
                alt="QR Code to Berry Rewards" 
                className="w-[300px] h-[300px]"
              />
            </div>

            <Button onClick={handleDownload} className="mb-4 w-full">
              <Download className="mr-2 h-4 w-4" />
              Download QR Code
            </Button>
            
            <p className="text-sm text-muted-foreground break-all">
              {targetUrl}
            </p>
          </>
        ) : (
          <div className="bg-muted/50 p-8 rounded-xl mb-4">
            <p className="text-muted-foreground">
              Enter your published URL above to generate the QR code
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRCode;
