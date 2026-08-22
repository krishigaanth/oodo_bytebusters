import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileQuestion, ArrowLeft, LayoutDashboard } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="p-4 rounded-3xl bg-brand-50 text-brand-600 mb-4 border border-brand-100 shadow-subtle">
        <FileQuestion className="w-12 h-12" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">404</h1>
      <h2 className="text-lg font-bold text-slate-800 mt-1">Page Not Found</h2>
      <p className="text-xs sm:text-sm text-slate-500 max-w-sm mt-2 leading-relaxed">
        The employee portal page you requested does not exist or you don't have access permissions.
      </p>
      <div className="flex items-center gap-3 mt-6">
        <Button
          variant="outline"
          size="md"
          onClick={() => navigate(-1)}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Go Back
        </Button>
        <Button
          variant="primary"
          size="md"
          onClick={() => navigate('/dashboard')}
          leftIcon={<LayoutDashboard className="w-4 h-4" />}
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};
