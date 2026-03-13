'use client';

import { useState } from 'react';
import { Card, CardBody, CardHeader, Button, Chip } from '@nextui-org/react';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { samplePrescriptions } from '@/lib/samplePrescriptions';
import { formatDate, getPrescriptionStatusColor } from '@/lib/utils';

export default function PrescriptionsCarousel({ onPrescriptionClick }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const prescriptions = samplePrescriptions.slice(0, 5); // Show only 5 most recent

  const nextPrescription = () => {
    setCurrentIndex((prev) => (prev + 1) % prescriptions.length);
  };

  const prevPrescription = () => {
    setCurrentIndex((prev) => (prev - 1 + prescriptions.length) % prescriptions.length);
  };

  const currentPrescription = prescriptions[currentIndex];

  return (
    <div className="space-y-4">
      {/* Carousel Container */}
      <div className="relative">
        <Card className="card-mobile animate-slide-up">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                  <span className="text-xl">{currentPrescription.clinicEmoji}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {currentPrescription.doctor}
                  </h3>
                  <p className="text-small text-gray-500">
                    {currentPrescription.clinic}
                  </p>
                </div>
              </div>
              <Chip
                color={getPrescriptionStatusColor(currentPrescription.status)}
                variant="flat"
                size="sm"
                className="capitalize"
              >
                {currentPrescription.status}
              </Chip>
            </div>
          </CardHeader>
          
          <CardBody className="pt-0 space-y-4">
            {/* Date and Diagnosis */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">📅</span>
                <span className="text-small text-gray-600">
                  {formatDate(currentPrescription.date)}
                </span>
              </div>
              <div className="text-small text-gray-600 bg-gray-100 px-2 py-1 rounded-lg">
                {currentPrescription.diagnosis}
              </div>
            </div>

            {/* Medicines */}
            <div className="space-y-2">
              <h4 className="text-small font-medium text-gray-700 flex items-center gap-1">
                <span>💊</span>
                Key Medicines
              </h4>
              <div className="flex flex-wrap gap-2">
                {currentPrescription.medicines.slice(0, 3).map((medicine, index) => (
                  <Chip
                    key={index}
                    variant="flat"
                    color="primary"
                    size="sm"
                    className="text-xs"
                  >
                    <div className="flex items-center gap-1">
                      <span>{medicine.icon}</span>
                      <span>{medicine.name}</span>
                      <span className="text-gray-500">{medicine.timing}</span>
                    </div>
                  </Chip>
                ))}
                {currentPrescription.medicines.length > 3 && (
                  <Chip
                    variant="flat"
                    color="default"
                    size="sm"
                    className="text-xs"
                  >
                    +{currentPrescription.medicines.length - 3} more
                  </Chip>
                )}
              </div>
            </div>

            {/* Action Button */}
            <Button
              color="primary"
              variant="flat"
              size="lg"
              className="w-full font-semibold"
              onPress={() => onPrescriptionClick(currentPrescription)}
              startContent={<Eye className="w-4 h-4" />}
            >
              View Details
            </Button>
          </CardBody>
        </Card>

        {/* Navigation Arrows */}
        {prescriptions.length > 1 && (
          <>
            <Button
              isIconOnly
              variant="flat"
              size="lg"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm shadow-lg touch-target"
              onPress={prevPrescription}
              aria-label="Previous prescription"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              isIconOnly
              variant="flat"
              size="lg"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm shadow-lg touch-target"
              onPress={nextPrescription}
              aria-label="Next prescription"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </>
        )}
      </div>

      {/* Dots Indicator */}
      {prescriptions.length > 1 && (
        <div className="flex justify-center gap-2">
          {prescriptions.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? 'bg-primary-500 w-6'
                  : 'bg-gray-300'
              }`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to prescription ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Prescription Counter */}
      <div className="text-center">
        <p className="text-small text-gray-500">
          {currentIndex + 1} of {prescriptions.length} prescriptions
        </p>
      </div>
    </div>
  );
}
