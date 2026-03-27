import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  Calendar, 
  Clock, 
  User, 
  FileText, 
  CheckCircle, 
  XCircle, 
  PlusCircle, 
  Loader2,
  Shield,
  Trash2,
  Bell,
  ListTodo
} from 'lucide-react';
import { toast } from 'react-toastify';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState('queue'); // 'queue', 'reminders', 'bin'
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [selectedApptId, setSelectedApptId] = useState(null);
  const [prescriptionData, setPrescriptionData] = useState({
    medicines: '',
    instructions: '',
    notes: ''
  });

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/doctor/appointments');
      setAppointments(response.data);
    } catch (error) {
      toast.error('Failed to fetch appointments');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    setIsUpdating(true);
    try {
      await api.put(`/doctor/appointments/${id}/status?status=${status}`);
      
      if (status === 'ACCEPTED') {
        toast.success(`Appointment accepted! SMS confirmation sent to your mobile.`);
      } else if (status === 'REJECTED') {
        toast.info(`Appointment moved to Bin.`);
      } else {
        toast.success(`Status updated to ${status.toLowerCase()}`);
      }
      
      fetchAppointments();
    } catch (error) {
      const msg = error.response?.data?.message || error.response?.data || 'Failed to update status';
      toast.error(`Error: ${msg}`);
      console.error('Update status error:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePrescribe = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await api.post(`/doctor/appointments/${selectedApptId}/prescription`, prescriptionData);
      toast.success('Prescription issued successfully');
      setShowPrescriptionModal(false);
      setSelectedApptId(null);
      setPrescriptionData({ medicines: '', instructions: '', notes: '' });
      fetchAppointments();
    } catch (error) {
      const msg = error.response?.data?.message || error.response?.data || 'Failed to add prescription';
      toast.error(`Error: ${msg}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredAppointments = appointments.filter(appt => {
    if (activeTab === 'queue') return ['PENDING', 'ACCEPTED', 'COMPLETED'].includes(appt.status);
    if (activeTab === 'reminders') return appt.status === 'ACCEPTED';
    if (activeTab === 'bin') return ['REJECTED', 'CANCELLED'].includes(appt.status);
    return true;
  });

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin h-10 w-10 text-brand-600" /></div>;

  return (
    <div className="space-y-12 px-4 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Physician Panel</h1>
          <p className="text-slate-500 font-medium mt-1">Real-time patient management and reminders</p>
        </div>
        <div className="flex items-center space-x-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
           <div className="h-10 w-10 bg-indigo-50 rounded-xl flex items-center justify-center">
              <Shield className="h-5 w-5 text-indigo-600" />
           </div>
           <div className="pr-4">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Authenticated</p>
              <p className="text-sm font-bold text-slate-700">Dr. {user.name}</p>
           </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="flex p-1.5 bg-slate-100/50 rounded-[2rem] w-fit mx-auto md:mx-0 border border-slate-100">
         <button 
           onClick={() => setActiveTab('queue')}
           className={`flex items-center space-x-3 px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'queue' ? 'bg-white text-brand-600 shadow-xl shadow-brand-100/50 scale-105' : 'text-slate-400 hover:text-slate-600'}`}
         >
           <ListTodo className="h-4 w-4" />
           <span>Active Queue</span>
         </button>
         <button 
           onClick={() => setActiveTab('reminders')}
           className={`flex items-center space-x-3 px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'reminders' ? 'bg-white text-amber-600 shadow-xl shadow-amber-100/50 scale-105' : 'text-slate-400 hover:text-slate-600'}`}
         >
           <Bell className="h-4 w-4" />
           <span>Reminders</span>
         </button>
         <button 
           onClick={() => setActiveTab('bin')}
           className={`flex items-center space-x-3 px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'bin' ? 'bg-white text-rose-600 shadow-xl shadow-rose-100/50 scale-105' : 'text-slate-400 hover:text-slate-600'}`}
         >
           <Trash2 className="h-4 w-4" />
           <span>Bin</span>
         </button>
      </div>

      <div className="glass p-10 rounded-[2.8rem]">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-black text-slate-900 flex items-center">
            {activeTab === 'queue' && <div className="h-10 w-10 bg-indigo-100 rounded-xl flex items-center justify-center mr-4"><ListTodo className="h-5 w-5 text-indigo-600" /></div>}
            {activeTab === 'reminders' && <div className="h-10 w-10 bg-amber-100 rounded-xl flex items-center justify-center mr-4"><Bell className="h-5 w-5 text-amber-600" /></div>}
            {activeTab === 'bin' && <div className="h-10 w-10 bg-rose-100 rounded-xl flex items-center justify-center mr-4"><Trash2 className="h-5 w-5 text-rose-600" /></div>}
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} View
          </h2>
          <span className="px-4 py-2 bg-slate-50 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-100">
            {filteredAppointments.length} ENTRIES
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-24 bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
              <div className="h-20 w-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Clock className="h-10 w-10 text-slate-200" />
              </div>
              <p className="text-slate-400 font-black text-lg uppercase tracking-widest">Nothing here yet</p>
              <p className="text-slate-300 text-sm mt-1">This section will update as appointments change status.</p>
            </div>
          ) : (
            filteredAppointments.map(appt => (
              <div key={appt.id} className="p-8 bg-white/60 border border-slate-100 rounded-[2.2rem] flex flex-col md:flex-row justify-between items-start md:items-center group hover:bg-white hover:shadow-premium transition-all">
                <div className="flex items-center space-x-8">
                  <div className="h-20 w-20 bg-slate-50 rounded-[1.5rem] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform relative overflow-hidden">
                    <User className="h-10 w-10 text-slate-300" />
                    <div className="absolute top-0 right-0 h-4 w-4 bg-emerald-400 border-4 border-slate-100 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-slate-900 tracking-tight">{appt.patient.name}</h4>
                    <div className="flex space-x-6 mt-2">
                       <span className="flex items-center text-xs font-black text-slate-400 uppercase tracking-widest">
                          <Calendar className="h-3.5 w-3.5 mr-2 text-brand-500" />
                          {appt.appointmentDate}
                       </span>
                       <span className="flex items-center text-xs font-black text-slate-400 uppercase tracking-widest">
                          <Clock className="h-3.5 w-3.5 mr-2 text-brand-500" />
                          {appt.appointmentTime}
                       </span>
                    </div>
                    {appt.notes && (
                      <div className="mt-4 flex items-start space-x-3 p-4 bg-slate-50/80 rounded-2xl border border-slate-100 italic">
                        <div className="h-2 w-2 bg-brand-400 rounded-full mt-1.5 shrink-0"></div>
                        <p className="text-sm text-slate-500 line-clamp-2">"{appt.notes}"</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 md:mt-0 flex flex-wrap gap-4 items-center">
                  <span className={`px-5 py-2 rounded-full text-[10px] font-black tracking-widest uppercase border ${
                    appt.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                    appt.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                    appt.status === 'ACCEPTED' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                    'bg-rose-50 text-rose-600 border-rose-100'
                  }`}>
                    {appt.status}
                  </span>
                  
                  {appt.status === 'PENDING' && activeTab === 'queue' && (
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleUpdateStatus(appt.id, 'ACCEPTED')}
                        className="px-6 py-3 bg-brand-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-brand-700 shadow-xl shadow-brand-100 transition-all active:scale-95"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(appt.id, 'REJECTED')}
                        className="px-6 py-3 bg-white text-rose-600 border border-rose-100 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-rose-50 transition-all active:scale-95"
                      >
                        Decline
                      </button>
                    </div>
                  )}

                  {appt.status === 'ACCEPTED' && (
                    <button
                      onClick={() => { setSelectedApptId(appt.id); setShowPrescriptionModal(true); }}
                      className="px-8 py-4 bg-brand-600 text-white rounded-[1.25rem] text-xs font-black uppercase tracking-widest hover:bg-brand-700 shadow-xl shadow-brand-100 flex items-center transition-all active:scale-95"
                    >
                      <FileText className="h-4 w-4 mr-3" />
                      Add Prescription
                    </button>
                  )}
                  
                  {activeTab === 'bin' && (
                    <button
                      onClick={() => handleUpdateStatus(appt.id, 'PENDING')}
                      className="px-6 py-3 bg-white text-slate-600 border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95"
                    >
                      Restore to Queue
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Prescription Modal */}
      {showPrescriptionModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowPrescriptionModal(false)}></div>
          <div className="relative glass p-10 rounded-[3rem] max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200">
             <h3 className="text-3xl font-black text-slate-900 mb-8 tracking-tighter uppercase italic">Issue Prescription</h3>
             <form onSubmit={handlePrescribe} className="space-y-6">
                <div>
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Medications</label>
                   <textarea
                     required
                     value={prescriptionData.medicines}
                     onChange={(e) => setPrescriptionData({...prescriptionData, medicines: e.target.value})}
                     className="block w-full px-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-bold text-slate-700"
                     placeholder="e.g. Paracetamol 500mg"
                     rows="3"
                   ></textarea>
                </div>
                <div>
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Regimen/Instructions</label>
                   <textarea
                     required
                     value={prescriptionData.instructions}
                     onChange={(e) => setPrescriptionData({...prescriptionData, instructions: e.target.value})}
                     className="block w-full px-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-bold text-slate-700"
                     placeholder="e.g. Twice daily after food"
                     rows="3"
                   ></textarea>
                </div>
                <div className="flex space-x-4 pt-4">
                   <button
                     type="button"
                     onClick={() => setShowPrescriptionModal(false)}
                     className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                   >
                     Discard
                   </button>
                   <button
                     type="submit"
                     disabled={isUpdating}
                     className="flex-1 py-4 bg-brand-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-700 shadow-xl shadow-brand-100 transition-all disabled:opacity-50"
                   >
                     {isUpdating ? <Loader2 className="animate-spin mx-auto h-5 w-5" /> : 'Sign & Issue'}
                   </button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
