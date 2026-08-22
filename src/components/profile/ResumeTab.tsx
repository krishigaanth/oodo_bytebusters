import React from 'react';
import { Award, Briefcase, GraduationCap, Edit3, Sparkles, ExternalLink } from 'lucide-react';
import { EmployeeProfile } from '../../types/employee';
import { Button } from '../common/Button';

interface ResumeTabProps {
  profile: EmployeeProfile;
  onEditClick: () => void;
}

export const ResumeTab: React.FC<ResumeTabProps> = ({ profile, onEditClick }) => {
  return (
    <div className="space-y-6">
      {/* About & Bio Card */}
      <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-subtle">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-brand-50 text-brand-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Professional Summary</h3>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={onEditClick}
            leftIcon={<Edit3 className="w-3.5 h-3.5" />}
          >
            Edit Profile
          </Button>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">{profile.aboutBio}</p>
      </div>

      {/* Skills Tags */}
      <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-subtle">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Briefcase className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Core Competencies & Skills</h3>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {profile.skills.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 transition-colors"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Certifications Grid */}
      <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-subtle">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
            <Award className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Certifications & Licenses</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profile.certifications.map((cert) => (
            <div
              key={cert.id}
              className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:shadow-subtle transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{cert.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{cert.issuer}</p>
                </div>
                {cert.verificationUrl && (
                  <a
                    href={cert.verificationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-brand-600 hover:text-brand-800 p-1"
                    aria-label="Verify certificate"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200/60">
                <span>Credential ID: <strong className="font-mono text-slate-700">{cert.credentialId}</strong></span>
                <span>Issued: {cert.issueDate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Work Experience Timeline */}
      <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-subtle">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
            <Briefcase className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Work Experience</h3>
        </div>
        <div className="relative pl-6 border-l-2 border-slate-100 space-y-6">
          {profile.workHistory.map((work) => (
            <div key={work.id} className="relative">
              <span className="absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-brand-600 ring-4 ring-brand-50" />
              <h4 className="text-sm font-bold text-slate-900">{work.role}</h4>
              <p className="text-xs text-brand-600 font-semibold mt-0.5">{work.company}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {work.startDate} &mdash; {work.endDate}
              </p>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{work.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-subtle">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
            <GraduationCap className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Education Background</h3>
        </div>
        <div className="space-y-4">
          {profile.education.map((edu, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/70">
              <h4 className="text-sm font-bold text-slate-900">{edu.degree}</h4>
              <p className="text-xs text-slate-600 mt-0.5">{edu.institution}</p>
              <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                <span>Academic Years: {edu.year}</span>
                {edu.grade && <span className="font-semibold text-slate-700">{edu.grade}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
