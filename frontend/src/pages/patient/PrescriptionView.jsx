import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { 
  FileText, 
  ArrowLeft, 
  Loader2, 
  Pill, 
  ClipboardList, 
  User, 
  Calendar, 
  Clock,
  Download,
  Shield
} from 'lucide-react';
import { toast } from 'react-toastify';

const PrescriptionView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prescription, setPrescription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        const resp = await api.get(`/patient/appointments/${id}/prescription`);
        setPrescription(resp.data);
      } catch (error) {
        toast.error('Prescription not found');
        navigate('/patient');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPrescription();
  }, [id, navigate]);

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin h-10 w-10 text-brand-600" /></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 pb-24">
      <Link
        to="/patient"
        className="inline-flex items-center text-slate-400 hover:text-brand-600 font-black text-xs uppercase tracking-widest transition-colors mb-10 group"
      >
        <ArrowLeft className="mr-3 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </Link>

      <div className="glass rounded-[3.5rem] overflow-hidden shadow-2xl relative border-none">
        {/* Certificate-style border decoration */}
        <div className="absolute inset-0 border-[1.5rem] border-slate-50/50 pointer-events-none rounded-[3.5rem]"></div>
        
        <div className="p-12 md:p-20 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-16 px-4">
            <div className="flex items-center space-x-6">
              <div className="h-20 w-20 bg-brand-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-brand-200">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Medical Record</h1>
                <p className="text-brand-600 font-black tracking-widest text-xs uppercase mt-1">CareConnect Digital Certified</p>
              </div>
            </div>
            <div className="bg-slate-50 px-8 py-5 rounded-[2rem] border border-slate-100 flex flex-col items-end">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Issue Date</p>
              <p className="text-lg font-black text-slate-900">{prescription.appointment.appointmentDate}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16 py-10 border-y border-slate-100/80 mx-4">
            <div className="flex items-center space-x-5">
                <div className="p-4 bg-slate-100 rounded-2xl"><User className="h-6 w-6 text-slate-400" /></div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Patient Name</p>
                  <p className="text-xl font-black text-slate-900 tracking-tight">{prescription.appointment.patient.name}</p>
                </div>
            </div>
            <div className="flex items-center space-x-5 md:pl-10 md:border-l border-slate-100/80">
                <div className="p-4 bg-brand-50 rounded-2xl"><Shield className="h-6 w-6 text-brand-600" /></div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Practitioner</p>
                  <p className="text-xl font-black text-slate-900 tracking-tight underline decoration-brand-200 decoration-4">Dr. {prescription.appointment.doctor.name}</p>
                  <p className="text-xs font-black text-brand-600 uppercase tracking-widest mt-1">{prescription.appointment.doctor.specialization}</p>
                </div>
            </div>
          </div>

          <div className="space-y-12 px-4">
            <section className="group">
              <div className="flex items-center space-x-4 mb-6">
                <div className="h-10 w-10 bg-rose-50 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                  <Pill className="h-5 w-5 text-rose-500" />
                </div>
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest italic">Prescribed Medications</h2>
              </div>
              <div className="p-10 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 min-h-[120px] whitespace-pre-wrap leading-relaxed text-slate-700 font-bold text-lg shadow-inner">
                {prescription.medicines}
              </div>
            </section>

            <section className="group">
              <div className="flex items-center space-x-4 mb-6">
                <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                  <ClipboardList className="h-5 w-5 text-emerald-500" />
                </div>
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest italic">Administration Regimen</h2>
              </div>
              <div className="p-10 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 min-h-[120px] whitespace-pre-wrap leading-relaxed text-slate-700 font-bold text-lg shadow-inner">
                {prescription.instructions}
              </div>
            </section>
          </div>

          <div className="mt-24 pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 px-4">
            <div className="flex items-center text-slate-300 space-x-3">
               <Shield className="h-5 w-5" />
               <p className="text-[10px] font-black uppercase tracking-[0.2em]">CareConnect Verified Digital Signature</p>
            </div>
            <button 
              onClick={() => window.print()}
              className="flex items-center px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl active:scale-95 no-print"
            >
              <Download className="h-4 w-4 mr-3" />
              Download Document
            </button>
          </div>
        </div>
      </div>
      
      <p className="mt-12 text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
        Verified Secure Medical Document • ID: {prescription.id}
      </p>
    </div>
  );
};

export default PrescriptionView;
