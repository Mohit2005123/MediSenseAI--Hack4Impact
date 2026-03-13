'use client';

import { Card, CardBody, Button } from '@nextui-org/react';
import { MessageCircle, Camera, Phone, FileText, Calendar, HelpCircle } from 'lucide-react';

export default function QuickActions() {
  const actions = [
    {
      id: 'new-query',
      title: 'New Query',
      description: 'Ask health questions',
      icon: MessageCircle,
      color: 'primary',
      emoji: '💬'
    },
    {
      id: 'scan-prescription',
      title: 'Scan Prescription',
      description: 'Upload & analyze',
      icon: Camera,
      color: 'success',
      emoji: '📷'
    },
    {
      id: 'call-help',
      title: 'Call Help',
      description: 'Emergency support',
      icon: Phone,
      color: 'danger',
      emoji: '📞'
    },
    {
      id: 'health-records',
      title: 'Health Records',
      description: 'View medical history',
      icon: FileText,
      color: 'secondary',
      emoji: '📋'
    },
    {
      id: 'book-appointment',
      title: 'Book Appointment',
      description: 'Schedule visit',
      icon: Calendar,
      color: 'warning',
      emoji: '📅'
    },
    {
      id: 'help-support',
      title: 'Help & Support',
      description: 'Get assistance',
      icon: HelpCircle,
      color: 'default',
      emoji: '❓'
    }
  ];

  const handleActionClick = (actionId) => {
    // In real app, navigate to respective pages or open modals
    switch (actionId) {
      case 'new-query':
        alert('Opening health query form...');
        break;
      case 'scan-prescription':
        alert('Opening camera to scan prescription...');
        break;
      case 'call-help':
        alert('Calling emergency support...');
        break;
      case 'health-records':
        alert('Opening health records...');
        break;
      case 'book-appointment':
        alert('Opening appointment booking...');
        break;
      case 'help-support':
        alert('Opening help & support...');
        break;
      default:
        alert('Feature coming soon!');
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {actions.map((action) => {
        const IconComponent = action.icon;
        return (
          <Card
            key={action.id}
            className="card-mobile hover:shadow-lg transition-all duration-200 cursor-pointer animate-fade-in"
            isPressable
            onPress={() => handleActionClick(action.id)}
          >
            <CardBody className="text-center space-y-3 py-6">
              {/* Icon */}
              <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center ${
                action.color === 'primary' ? 'bg-primary-100' :
                action.color === 'success' ? 'bg-success-100' :
                action.color === 'danger' ? 'bg-danger-100' :
                action.color === 'warning' ? 'bg-warning-100' :
                action.color === 'secondary' ? 'bg-secondary-100' :
                'bg-gray-100'
              }`}>
                <span className="text-3xl">{action.emoji}</span>
              </div>

              {/* Title */}
              <h3 className="font-semibold text-gray-900 text-base">
                {action.title}
              </h3>

              {/* Description */}
              <p className="text-small text-gray-500 leading-relaxed">
                {action.description}
              </p>

              {/* Action Button */}
              <Button
                size="sm"
                color={action.color}
                variant="flat"
                className="w-full font-medium"
                startContent={<IconComponent className="w-4 h-4" />}
              >
                {action.title}
              </Button>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
}
