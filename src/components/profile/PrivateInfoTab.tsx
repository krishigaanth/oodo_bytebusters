import React, { useState } from 'react';
import { ShieldCheck, Eye, EyeOff, Building, Lock, User, MapPin, Edit3 } from 'lucide-react';
import { EmployeeProfile } from '../../types/employee';
import { Button } from '../common/Button';

interface PrivateInfoTabProps {
  profile: EmployeeProfile;
  onEditClick: () => void;
}

export const PrivateInfoTab: React.FC<PrivateInfoTabProps> = ({ profile, onEditClick }) => {
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [showTaxDetails, setShowTaxDetails] = useState(false);

  const { privateInfo } = profile;

  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-indigo-950">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-600 text-white shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold">Confidential Employee Information</h4>
            <p className="text-xs text-indigo-800/80 mt-0.5">
              Sensitive financial and personal records are encrypted and protected by enterprise access policies.
            </p>
          </div>
        </div>
        <Button size="sm" variant="primary" onClick={onEditClick} leftIcon={<Edit3 className="w-3.5 h-3.5" />}>
          Update Details
        </Button>
      </div>

      {/* Personal Bio Data */}
      <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-subtle space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <User className="w-4 h-4 text-brand-600" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Personal Particulars</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-slate-500 font-medium">Date of Birth</span>
            <p className="text-sm font-bold text-slate-900 mt-1">{privateInfo.dob}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-slate-500 font-medium">Gender</span>
            <p className="text-sm font-bold text-slate-900 mt-1">{privateInfo.gender}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-slate-500 font-medium">Marital Status</span>
            <p className="text-sm font-bold text-slate-900 mt-1">{privateInfo.maritalStatus}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-slate-500 font-medium">Nationality</span>
            <p className="text-sm font-bold text-slate-900 mt-1">{privateInfo.nationality}</p>
          </div>
        </div>
      </div>

      {/* Contact & Residential Address */}
      <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-subtle space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <MapPin className="w-4 h-4 text-brand-600" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Address & Contacts</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
            <span className="text-slate-500 font-medium">Permanent Residential Address</span>
            <p className="text-sm font-bold text-slate-900">{privateInfo.residentialAddress.street}</p>
            <p className="text-slate-600">
              {privateInfo.residentialAddress.city}, {privateInfo.residentialAddress.state} {privateInfo.residentialAddress.postalCode}
            </p>
            <p className="text-slate-500">{privateInfo.residentialAddress.country}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
            <span className="text-slate-500 font-medium">Emergency Contact</span>
            <p className="text-sm font-bold text-slate-900">{privateInfo.emergencyContact.name}</p>
            <p className="text-slate-600 font-medium">Relationship: {privateInfo.emergencyContact.relationship}</p>
            <p className="text-brand-600 font-bold">{privateInfo.emergencyContact.phone}</p>
          </div>
        </div>
      </div>

      {/* Banking Details (Masked) */}
      <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-subtle space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-brand-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Direct Deposit Banking Details</h3>
          </div>
          <button
            type="button"
            onClick={() => setShowBankDetails(!showBankDetails)}
            className="flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors"
          >
            {showBankDetails ? (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                <span>Mask Data</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>Reveal Details</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-slate-500 font-medium">Bank Institution</span>
            <p className="text-sm font-bold text-slate-900 mt-1">{privateInfo.bankAccount.bankName}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-slate-500 font-medium">Account Number</span>
            <p className="text-sm font-bold font-mono text-slate-900 mt-1">
              {showBankDetails ? '9832 4410 4892' : privateInfo.bankAccount.accountNumber}
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-slate-500 font-medium">SWIFT / Routing / IFSC</span>
            <p className="text-sm font-bold font-mono text-slate-900 mt-1">{privateInfo.bankAccount.ifscCode}</p>
          </div>
        </div>
      </div>

      {/* Tax & National Identifiers (Masked) */}
      <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-subtle space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-brand-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Statutory Tax & Identifiers</h3>
          </div>
          <button
            type="button"
            onClick={() => setShowTaxDetails(!showTaxDetails)}
            className="flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors"
          >
            {showTaxDetails ? (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                <span>Mask Identifiers</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>Reveal Identifiers</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-slate-500 font-medium">PAN / Tax ID</span>
            <p className="text-sm font-bold font-mono text-slate-900 mt-1">
              {showTaxDetails ? 'ABCDE4291A' : privateInfo.taxIdentifiers.panNumber}
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-slate-500 font-medium">National Identity / SSN</span>
            <p className="text-sm font-bold font-mono text-slate-900 mt-1">
              {showTaxDetails ? '552-01-8821' : privateInfo.taxIdentifiers.ssnOrNationalId}
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-slate-500 font-medium">PF UAN / Pension Number</span>
            <p className="text-sm font-bold font-mono text-slate-900 mt-1">{privateInfo.taxIdentifiers.pfUanNumber}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
