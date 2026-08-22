import React, { useState } from 'react';
import { EmployeeProfile, EditableProfileFields } from '../../types/employee';
import { employeeService } from '../../services/employeeService';
import { useToast } from '../../contexts/ToastContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { FormInput } from '../common/FormInput';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: EmployeeProfile;
  onProfileUpdated: (updated: EmployeeProfile) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onProfileUpdated,
}) => {
  const { success, error } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<EditableProfileFields>({
    phone: profile.mobile,
    personalEmail: profile.privateInfo.personalEmail,
    aboutBio: profile.aboutBio,
    skills: profile.skills,
    address: profile.privateInfo.residentialAddress.street,
    city: profile.privateInfo.residentialAddress.city,
    state: profile.privateInfo.residentialAddress.state,
    postalCode: profile.privateInfo.residentialAddress.postalCode,
    country: profile.privateInfo.residentialAddress.country,
    emergencyContactName: profile.privateInfo.emergencyContact.name,
    emergencyContactRelationship: profile.privateInfo.emergencyContact.relationship,
    emergencyContactPhone: profile.privateInfo.emergencyContact.phone,
  });

  const [skillsInput, setSkillsInput] = useState(profile.skills.join(', '));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const parsedSkills = skillsInput
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const payload: Partial<EditableProfileFields> = {
        ...formData,
        skills: parsedSkills,
      };

      const updated = await employeeService.updateProfile(profile.id, payload);
      onProfileUpdated(updated);
      success('Employee profile records successfully updated.', 'Profile Updated');
      onClose();
    } catch (err: any) {
      error(err?.message || 'Failed to update profile records.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Profile & Contact Details"
      subtitle="Update your employee self-service contact information"
      maxWidth="xl"
      footer={
        <div className="flex items-center gap-3 w-full justify-end">
          <Button variant="secondary" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button variant="primary" isLoading={isSaving} onClick={handleSubmit}>
            Save Changes
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Contact Info */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Contact Information
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormInput
              label="Mobile Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <FormInput
              label="Personal Email"
              type="email"
              name="personalEmail"
              value={formData.personalEmail}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            About Bio / Summary
          </label>
          <textarea
            name="aboutBio"
            rows={3}
            value={formData.aboutBio}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
            required
          />
        </div>

        {/* Skills Tag input */}
        <FormInput
          label="Skills (comma separated)"
          value={skillsInput}
          onChange={(e) => setSkillsInput(e.target.value)}
          helperText="E.g. React, TypeScript, GraphQL, Next.js"
        />

        {/* Residential Address */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Residential Address
          </h4>
          <FormInput
            label="Street Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <FormInput label="City" name="city" value={formData.city} onChange={handleChange} />
            <FormInput label="State" name="state" value={formData.state} onChange={handleChange} />
            <FormInput label="Postal Code" name="postalCode" value={formData.postalCode} onChange={handleChange} />
            <FormInput label="Country" name="country" value={formData.country} onChange={handleChange} />
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Emergency Contact
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <FormInput
              label="Contact Name"
              name="emergencyContactName"
              value={formData.emergencyContactName}
              onChange={handleChange}
            />
            <FormInput
              label="Relationship"
              name="emergencyContactRelationship"
              value={formData.emergencyContactRelationship}
              onChange={handleChange}
            />
            <FormInput
              label="Emergency Phone"
              name="emergencyContactPhone"
              value={formData.emergencyContactPhone}
              onChange={handleChange}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};
