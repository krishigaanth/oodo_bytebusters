import { Employee } from '../models/Employee.js';
import { User } from '../models/User.js';

export const employeeService = {
  /**
   * Get employee profile by ID
   */
  async getProfile(employeeId) {
    const profile = await Employee.findOne({ id: employeeId.toUpperCase() });
    if (!profile) {
      throw new Error(`Employee profile for ${employeeId} not found`);
    }
    return profile.toObject();
  },

  /**
   * Update permitted self-service profile fields
   */
  async updateProfile(employeeId, payload) {
    const profile = await Employee.findOne({ id: employeeId.toUpperCase() });
    if (!profile) {
      throw new Error(`Profile ${employeeId} not found`);
    }

    // Apply allowed field updates only
    if (payload.aboutBio !== undefined) profile.aboutBio = payload.aboutBio;
    if (payload.skills !== undefined) profile.skills = payload.skills;
    if (payload.phone !== undefined) profile.mobile = payload.phone;

    if (payload.personalEmail !== undefined) {
      profile.privateInfo.personalEmail = payload.personalEmail;
    }

    if (payload.address !== undefined) {
      profile.privateInfo.residentialAddress.street = payload.address;
    }
    if (payload.city !== undefined) {
      profile.privateInfo.residentialAddress.city = payload.city;
    }
    if (payload.state !== undefined) {
      profile.privateInfo.residentialAddress.state = payload.state;
    }
    if (payload.postalCode !== undefined) {
      profile.privateInfo.residentialAddress.postalCode = payload.postalCode;
    }
    if (payload.country !== undefined) {
      profile.privateInfo.residentialAddress.country = payload.country;
    }

    if (payload.emergencyContactName !== undefined) {
      profile.privateInfo.emergencyContact.name = payload.emergencyContactName;
    }
    if (payload.emergencyContactRelationship !== undefined) {
      profile.privateInfo.emergencyContact.relationship = payload.emergencyContactRelationship;
    }
    if (payload.emergencyContactPhone !== undefined) {
      profile.privateInfo.emergencyContact.phone = payload.emergencyContactPhone;
    }

    profile.markModified('privateInfo');
    await profile.save();

    return profile.toObject();
  },

  /**
   * Update employee avatar picture
   */
  async updateAvatar(employeeId, avatarUrl) {
    const cleanId = employeeId.toUpperCase();
    await Employee.updateOne({ id: cleanId }, { $set: { avatarUrl } });
    await User.updateOne({ employeeId: cleanId }, { $set: { avatarUrl } });

    const updated = await Employee.findOne({ id: cleanId });
    return updated ? updated.toObject() : null;
  },
};
