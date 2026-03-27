import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, Phone, Briefcase, Award, DollarSign, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'PATIENT',
    phone: '',
    specialization: '',
    experience: '',
    fee: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const user = await register(formData);
      toast.success('Welcome to CareConnect!');
      if (user.role === 'PATIENT') navigate('/patient');
      else navigate('/doctor');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-20 flex items-center justify-center px-4 gradient-bg">
      <div className="max-w-3xl w-full glass p-12 rounded-[3.5rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-40 w-40 bg-brand-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative text-center mb-12">
          <div className="mx-auto h-16 w-16 bg-brand-600 rounded-2xl flex items-center justify-center shadow-xl mb-6">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Create Account</h2>
          <p className="mt-2 text-slate-500 font-medium font-medium">Join the CareConnect medical network</p>
        </div>

        <div className="flex justify-center space-x-6 mb-12">
          {['PATIENT', 'DOCTOR'].map((role) => (
            <button
              key={role}
              onClick={() => setFormData({ ...formData, role })}
              className={`px-10 py-3 rounded-2xl text-sm font-black tracking-widest uppercase transition-all ${
                formData.role === role
                  ? 'bg-brand-600 text-white shadow-xl shadow-brand-100'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-8" onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within/input:text-brand-600">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium text-slate-900 placeholder-slate-400"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within/input:text-brand-600">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium text-slate-900 placeholder-slate-400"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within/input:text-brand-600">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium text-slate-900 placeholder-slate-400"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Phone Number</label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within/input:text-brand-600">
                  <Phone className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium text-slate-900 placeholder-slate-400"
                  placeholder="+1 234 567 890"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {formData.role === 'DOCTOR' ? (
              <>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Specialization</label>
                  <div className="relative group/input">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within/input:text-brand-600">
                      <Briefcase className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      name="specialization"
                      required
                      value={formData.specialization}
                      onChange={handleChange}
                      className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium text-slate-900 placeholder-slate-400"
                      placeholder="Cardiology"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Experience (Years)</label>
                  <div className="relative group/input">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within/input:text-brand-600">
                      <Award className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      name="experience"
                      required
                      value={formData.experience}
                      onChange={handleChange}
                      className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium text-slate-900 placeholder-slate-400"
                      placeholder="10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Consultation Fee ($)</label>
                  <div className="relative group/input">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within/input:text-brand-600">
                      <DollarSign className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      name="fee"
                      type="number"
                      required
                      value={formData.fee}
                      onChange={handleChange}
                      className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium text-slate-900 placeholder-slate-400"
                      placeholder="50"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col justify-center items-center p-8 bg-brand-50 rounded-[2.5rem] border-2 border-dashed border-brand-200 relative overflow-hidden group/patient">
                <div className="absolute inset-0 bg-brand-100 opacity-0 group-hover/patient:opacity-20 transition-opacity"></div>
                <User className="h-20 w-20 text-brand-400 mb-6" />
                <p className="text-center text-brand-700 font-black text-lg">Patient Registration</p>
                <p className="text-center text-brand-500 mt-2 text-sm font-medium">Book appointments and access your medical history effortlessly.</p>
              </div>
            )}
          </div>

          <div className="md:col-span-2 pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-5 px-4 bg-brand-600 text-white rounded-[1.5rem] font-black text-xl hover:bg-brand-700 shadow-2xl shadow-brand-100 transition-all disabled:opacity-50 active:scale-95"
            >
              {isLoading ? <Loader2 className="h-8 w-8 animate-spin" /> : 'Create Account'}
            </button>
            <p className="mt-6 text-center text-sm font-bold text-slate-500">
              Already a member?{' '}
              <Link to="/login" className="text-brand-600 hover:text-brand-700 transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
