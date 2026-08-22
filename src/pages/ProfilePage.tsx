import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Shield,
  FileText,
  Mail,
  Phone,
  Building,
  MapPin,
  Briefcase,
  UserCheck,
  Edit3,
} from 'lucide-react';
import { EmployeeProfile } from '../types/employee';
import { employeeService } from '../services/employeeService';
import { useAuth } from '../contexts/AuthContext';
import { ResumeTab } from '../components/profile/ResumeTab';
import { PrivateInfoTab } from '../components/profile/PrivateInfoTab';
import { SecurityTab } from '../components/profile/SecurityTab';
import { EditProfileModal } from '../components/profile/EditProfileModal';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { Button } from '../components/common/Button';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'resume' | 'private' | 'security'>('resume');
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'security') setActiveTab('security');
    else if (tabParam === 'private') setActiveTab('private');
    else if (tabParam === 'resume') setActiveTab('resume');
  }, [searchParams]);

  const loadProfile = async () => {
    const empId = user?.employeeId || user?.id || 'EMP001';
    setIsLoading(true);
    try {
      const data = await employeeService.getProfile(empId);
      setProfile(data);
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [user]);

  const handleTabChange = (tab: 'resume' | 'private' | 'security') => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  if (isLoading || !profile) {
    return <LoadingSkeleton type="profile" />;
  }

  return (
    <div className="space-y-6">
      {/* Top Profile Summary Card */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-8 shadow-subtle">
        {/* Subtle background header banner */}
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-700" />

        <div className="relative pt-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
          {/* Left Avatar & Name */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
            <div className="relative">
              <img
                src={profile.avatarUrl}
                alt={profile.fullName}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-white shadow-xl bg-white"
              />
              <span className="absolute bottom-1 right-1 h-5 w-5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {profile.fullName}
                </h2>
                <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-200">
                  {profile.id}
                </span>
                <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {profile.status}
                </span>
              </div>
              <p className="text-sm font-semibold text-brand-600">{profile.jobTitle}</p>
              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5" />
                <span>{profile.companyName} • {profile.department}</span>
              </p>
            </div>
          </div>

          {/* Right Action Button */}
          <div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsEditModalOpen(true)}
              leftIcon={<Edit3 className="w-4 h-4" />}
            >
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Metadata Details Grid */}
        <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <Mail className="w-4 h-4 text-brand-600 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-slate-400">Work Email</span>
              <p className="font-semibold text-slate-800 truncate">{profile.workEmail}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <Phone className="w-4 h-4 text-brand-600 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-slate-400">Mobile Phone</span>
              <p className="font-semibold text-slate-800 truncate">{profile.mobile}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-slate-400">Work Location</span>
              <p className="font-semibold text-slate-800 truncate">{profile.officeLocation}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <UserCheck className="w-4 h-4 text-brand-600 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-slate-400">Reporting Manager</span>
              <p className="font-semibold text-slate-800 truncate">{profile.reportingManager.name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => handleTabChange('resume')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'resume'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Resume & Skills</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('private')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'private'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Private & Financial Info</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('security')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'security'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Security & Sessions</span>
        </button>
      </div>

      {/* Tab Content Display */}
      <div>
        {activeTab === 'resume' && (
          <ResumeTab profile={profile} onEditClick={() => setIsEditModalOpen(true)} />
        )}
        {activeTab === 'private' && (
          <PrivateInfoTab profile={profile} onEditClick={() => setIsEditModalOpen(true)} />
        )}
        {activeTab === 'security' && <SecurityTab profile={profile} />}
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          profile={profile}
          onProfileUpdated={(updated) => setProfile(updated)}
        />
      )}
    </div>
  );
};
