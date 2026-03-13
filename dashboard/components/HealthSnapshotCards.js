"use client";

import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { Pill, Calendar, AlertTriangle, Clock } from "lucide-react";
import {
  getActivePrescriptions,
  getPrescriptionsNeedingRefill,
} from "@/lib/samplePrescriptions";
import { getDaysUntilRefill, getUrgencyColor } from "@/lib/utils";

export default function HealthSnapshotCards() {
  const activePrescriptions = getActivePrescriptions();
  const prescriptionsNeedingRefill = getPrescriptionsNeedingRefill();
  const today = new Date();
  const lastConsultation = "2025-11-20"; // Mock data

  // Calculate today's medicines
  const todaysMedicines = activePrescriptions.reduce((total, prescription) => {
    return total + prescription.medicines.length;
  }, 0);

  // Get next refill info
  const nextRefill =
    prescriptionsNeedingRefill.length > 0
      ? prescriptionsNeedingRefill[0].nextRefill
      : null;

  const daysUntilRefill = nextRefill ? getDaysUntilRefill(nextRefill) : null;
  const urgency = daysUntilRefill
    ? getRefillUrgency(daysUntilRefill)
    : "normal";

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Today's Medicines */}
      <Card className="card-mobile animate-fade-in">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
              <Pill className="w-4 h-4 text-primary-600" />
            </div>
            <span className="text-small font-medium text-gray-600">
              Today&apos;s Meds
            </span>
          </div>
        </CardHeader>
        <CardBody className="pt-0">
          <div className="text-2xl font-bold text-gray-900">
            {todaysMedicines}
          </div>
          <p className="text-small text-gray-500">
            {todaysMedicines === 0 ? "No medicines today" : "Medicines to take"}
          </p>
        </CardBody>
      </Card>

      {/* Next Refill */}
      <Card className="card-mobile animate-fade-in">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-warning-600" />
            </div>
            <span className="text-small font-medium text-gray-600">
              Next Refill
            </span>
          </div>
        </CardHeader>
        <CardBody className="pt-0">
          <div
            className={`text-2xl font-bold ${
              urgency === "critical"
                ? "text-danger-600"
                : urgency === "urgent"
                ? "text-warning-600"
                : "text-gray-900"
            }`}
          >
            {daysUntilRefill !== null ? `${daysUntilRefill}d` : "N/A"}
          </div>
          <p className="text-small text-gray-500">
            {daysUntilRefill === null ? "No refills due" : "Days remaining"}
          </p>
        </CardBody>
      </Card>

      {/* Last Consultation */}
      <Card className="card-mobile animate-fade-in">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-success-600" />
            </div>
            <span className="text-small font-medium text-gray-600">
              Last Visit
            </span>
          </div>
        </CardHeader>
        <CardBody className="pt-0">
          <div className="text-lg font-bold text-gray-900">Nov 20</div>
          <p className="text-small text-gray-500">Dr. Priya Sharma</p>
        </CardBody>
      </Card>

      {/* Alerts */}
      <Card className="card-mobile animate-fade-in">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-danger-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-danger-600" />
            </div>
            <span className="text-small font-medium text-gray-600">Alerts</span>
          </div>
        </CardHeader>
        <CardBody className="pt-0">
          <div className="text-2xl font-bold text-gray-900">
            {prescriptionsNeedingRefill.length}
          </div>
          <p className="text-small text-gray-500">
            {prescriptionsNeedingRefill.length === 0
              ? "All good!"
              : "Refills needed"}
          </p>
        </CardBody>
      </Card>
    </div>
  );
}

// Helper function to get urgency level
function getRefillUrgency(daysUntilRefill) {
  if (daysUntilRefill <= 0) return "critical";
  if (daysUntilRefill <= 2) return "urgent";
  if (daysUntilRefill <= 7) return "warning";
  return "normal";
}
