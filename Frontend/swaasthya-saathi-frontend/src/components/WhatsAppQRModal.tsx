import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MessageCircle } from "lucide-react";

interface WhatsAppQRModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WhatsAppQRModal = ({ open, onOpenChange }: WhatsAppQRModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <MessageCircle className="w-6 h-6 text-primary" />
            Scan to Start Chat with AI Doctor
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            Scan this QR code with your WhatsApp to start chatting with our AI Doctor
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center py-4">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <img
              src="/whatsapp-qr-code.png"
              alt="WhatsApp QR Code"
              className="w-64 h-64 object-contain"
              onError={(e) => {
                // Fallback if image doesn't exist
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `
                    <div class="w-64 h-64 flex items-center justify-center bg-gray-100 rounded-lg">
                      <p class="text-gray-500 text-sm text-center px-4">
                        Please add your QR code image at<br/>
                        <code class="text-xs">/public/whatsapp-qr-code.png</code>
                      </p>
                    </div>
                  `;
                }
              }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WhatsAppQRModal;

