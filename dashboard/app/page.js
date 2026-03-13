'use client';

import { useState } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import HealthSnapshotCards from '@/components/HealthSnapshotCards';
import PrescriptionsCarousel from '@/components/PrescriptionsCarousel';
import NearbyStoresMap from '@/components/NearbyStoresMap';
import QuickActions from '@/components/QuickActions';
import PrescriptionModal from '@/components/PrescriptionModal';

export default function Dashboard() {
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePrescriptionClick = (prescription) => {
    setSelectedPrescription(prescription);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPrescription(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <DashboardHeader />
      
      {/* Main Content */}
      <main className="px-4 pb-20 space-y-6">
        {/* Health Snapshot */}
        <section className="space-y-4">
          <h2 className="text-section flex items-center gap-2">
            <span className="text-2xl">📊</span>
            Your Health Snapshot
          </h2>
          <HealthSnapshotCards />
        </section>

        {/* Prescriptions */}
        <section className="space-y-4">
          <h2 className="text-section flex items-center gap-2">
            <span className="text-2xl">💊</span>
            Past Prescriptions
          </h2>
          <PrescriptionsCarousel onPrescriptionClick={handlePrescriptionClick} />
        </section>

        {/* Nearby Medical Stores */}
        <section className="space-y-4">
          <h2 className="text-section flex items-center gap-2">
            <span className="text-2xl">🏥</span>
            Find Nearby Medical Stores
          </h2>
          <NearbyStoresMap />
        </section>

        {/* Quick Actions */}
        <section className="space-y-4">
          <h2 className="text-section flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            Quick Actions
          </h2>
          <QuickActions />
        </section>
      </main>

      {/* Prescription Modal */}
      {isModalOpen && selectedPrescription && (
        <PrescriptionModal
          prescription={selectedPrescription}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
