'use client';

import { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Card, CardBody, Chip, Divider } from '@nextui-org/react';
import { X, Download, Share2, Bell, Calendar, Clock, User, MapPin } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function PrescriptionModal({ prescription, isOpen, onClose }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    // Simulate download
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsDownloading(false);
    // In real app, generate and download PDF
    alert('PDF downloaded successfully!');
  };

  const handleShare = async () => {
    setIsSharing(true);
    // Simulate sharing
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSharing(false);
    // In real app, open WhatsApp or other sharing options
    alert('Prescription shared via WhatsApp!');
  };

  const handleSetReminders = () => {
    // In real app, open reminders settings
    alert('Reminders set for this prescription!');
  };

  if (!prescription) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
      scrollBehavior="inside"
      className="max-h-[90vh]"
      classNames={{
        base: "m-4",
        body: "py-6",
        header: "border-b border-gray-200",
        footer: "border-t border-gray-200"
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">{prescription.clinicEmoji}</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {prescription.doctor}
                </h2>
                <p className="text-small text-gray-500">
                  {prescription.clinic}
                </p>
              </div>
            </div>
            <Button
              isIconOnly
              variant="light"
              size="lg"
              onPress={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </ModalHeader>

        <ModalBody className="space-y-6">
          {/* Prescription Info */}
          <Card className="card-mobile">
            <CardBody className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary-500" />
                  <div>
                    <p className="text-small text-gray-500">Date</p>
                    <p className="font-semibold">{formatDate(prescription.date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary-500" />
                  <div>
                    <p className="text-small text-gray-500">Diagnosis</p>
                    <p className="font-semibold">{prescription.diagnosis}</p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Medicines */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <span className="text-xl">💊</span>
              Medicines Prescribed
            </h3>
            <div className="space-y-3">
              {prescription.medicines.map((medicine, index) => (
                <Card key={index} className="card-mobile">
                  <CardBody className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{medicine.icon}</span>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {medicine.name}
                          </h4>
                          <p className="text-small text-gray-500">
                            {medicine.dosage}
                          </p>
                        </div>
                      </div>
                      <Chip
                        color="primary"
                        variant="flat"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <span>{medicine.timing}</span>
                      </Chip>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-small">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">
                          {medicine.frequency}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">
                          {medicine.duration}
                        </span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>

          {/* Next Refill Info */}
          {prescription.nextRefill && (
            <Card className="card-mobile bg-warning-50 border-warning-200">
              <CardBody>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-warning-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-warning-800">
                      Next Refill Due
                    </h4>
                    <p className="text-small text-warning-600">
                      {formatDate(prescription.nextRefill)}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}
        </ModalBody>

        <ModalFooter className="flex flex-col gap-3">
          <Divider />
          <div className="flex flex-col gap-3 w-full">
            <Button
              color="primary"
              size="lg"
              className="w-full font-semibold"
              onPress={handleDownload}
              isLoading={isDownloading}
              startContent={!isDownloading && <Download className="w-4 h-4" />}
            >
              {isDownloading ? 'Downloading...' : 'Download PDF'}
            </Button>
            
            <div className="grid grid-cols-2 gap-3">
              <Button
                color="success"
                variant="flat"
                size="lg"
                className="font-semibold"
                onPress={handleShare}
                isLoading={isSharing}
                startContent={!isSharing && <Share2 className="w-4 h-4" />}
              >
                {isSharing ? 'Sharing...' : 'Share'}
              </Button>
              
              <Button
                color="warning"
                variant="flat"
                size="lg"
                className="font-semibold"
                onPress={handleSetReminders}
                startContent={<Bell className="w-4 h-4" />}
              >
                Set Reminders
              </Button>
            </div>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
