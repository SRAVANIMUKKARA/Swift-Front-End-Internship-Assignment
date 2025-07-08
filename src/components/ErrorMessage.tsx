import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-center space-x-3">
        <AlertCircle className="h-6 w-6 text-red-600" />
        <p className="text-red-800">{message}</p>
      </div>
    </div>
  );
}