'use client';

import { getGreeting } from '@/lib/utils';
import { User, Bell, Settings } from 'lucide-react';
import { Button } from '@nextui-org/react';

export default function DashboardHeader() {
  const greeting = getGreeting();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-4 safe-area-top">
      <div className="flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
            <span className="text-2xl">🏥</span>
          </div>
          <div>
            <h1 className="text-hero text-primary-600">Swaasthya-Saathi</h1>
            <p className="text-small text-gray-500">Your Health Companion</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            isIconOnly
            variant="light"
            size="lg"
            className="text-gray-600 hover:text-primary-500 touch-target"
            aria-label="Notifications"
          >
            <Bell className="w-6 h-6" />
          </Button>
          <Button
            isIconOnly
            variant="light"
            size="lg"
            className="text-gray-600 hover:text-primary-500 touch-target"
            aria-label="Settings"
          >
            <Settings className="w-6 h-6" />
          </Button>
          <Button
            isIconOnly
            variant="light"
            size="lg"
            className="text-gray-600 hover:text-primary-500 touch-target"
            aria-label="Profile"
          >
            <User className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Greeting */}
      <div className="mt-4">
        <h2 className="text-lg font-semibold text-gray-800">
          {greeting}! 👋
        </h2>
        <p className="text-small text-gray-600">
          How can we help you today?
        </p>
      </div>
    </header>
  );
}
