'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { mockUsers } from '@/data/mockData';
import { Lock, Mail, ShieldAlert, CheckCircle } from 'lucide-react';

export default function SSOLogin() {
  const { setIsLoggedIn, setCurrentUser } = useApp();
  const [username, setUsername] = useState('hai.lp');
  const [password, setPassword] = useState('CJ@2026');
  const [step, setStep] = useState<1 | 2>(1); // 1: Login credentials, 2: MFA Code
  const [mfaCode, setMfaCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Match username or email with mock users
    const matchedUser = mockUsers.find(
      u => u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === username.toLowerCase()
    );
    if (!matchedUser) {
      setError('Username or Email address not registered in CJ Foods AD domain.');
      return;
    }

    if (matchedUser.password && matchedUser.password !== password) {
      setError('Incorrect domain password. Please try again.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(2); // proceed to MFA
    }, 1200);
  };

  const handleMfaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const matchedUser = mockUsers.find(
        u => u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === username.toLowerCase()
      );
      if (matchedUser) {
        setCurrentUser(matchedUser);
        setIsLoggedIn(true);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-radial from-[#ffffff] to-[#f3f4f6] p-4 relative overflow-hidden">
      {/* Decorative background vectors using CJ colors */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-cj-blue/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-cj-red/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-2xl shadow-soft border border-cj-gray-200/60 overflow-hidden relative z-10 transition-all duration-300 animate-scale-in">
        
        {/* Banner with CJ Colors */}
        <div className="h-2 bg-gradient-to-r from-cj-blue via-cj-red to-cj-orange" />
        
        <div className="p-8">
          {/* Logo Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex flex-col items-center mb-2">
              <img src="/CJ_logo.png" alt="CJ Foods Vietnam Logo" className="h-14 w-auto object-contain" />
              <span className="font-bold text-xl tracking-tight text-cj-gray-800 mt-2">
                CJ <span className="text-cj-red">ProjectHub</span>
              </span>
            </div>
            <p className="text-xs text-cj-gray-700 tracking-wider uppercase font-medium">One Platform. One Timeline. One Execution.</p>
          </div>

          {step === 1 ? (
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-cj-gray-800 uppercase tracking-wider">M365 Account / Username</label>
                  <span className="text-[10px] text-cj-blue font-medium bg-cj-blue/5 px-2 py-0.5 rounded-full">Azure Active Directory</span>
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. hai.lp or hai.lp@cj.net"
                    className="w-full pl-10 pr-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-cj-gray-800 focus:ring-2 focus:ring-cj-red/20 focus:border-cj-red outline-none transition-all"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-cj-gray-800 uppercase tracking-wider mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-cj-gray-800 focus:ring-2 focus:ring-cj-red/20 focus:border-cj-red outline-none transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center space-x-2 p-3 bg-red-50 rounded-lg text-xs text-red-600 border border-red-100">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded text-cj-red focus:ring-cj-red/50 border-gray-300 cursor-pointer"
                  />
                  <span className="text-xs text-gray-600">Remember Login</span>
                </label>
                <span className="text-xs text-cj-blue hover:underline cursor-pointer">Reset Password</span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-2.5 text-white font-medium rounded-lg text-sm transition-all shadow-md bg-gradient-to-r from-cj-blue to-cj-blue/90 hover:shadow-lg hover:from-cj-blue/95 hover:to-cj-blue active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <div className="h-5 w-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <span>Sign in with Microsoft 365</span>
                )}
              </button>

              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-cj-gray-200"></div>
                </div>
                <span className="relative bg-white px-3 text-xs text-gray-500 font-medium">Enterprise Security</span>
              </div>

              <div className="text-center">
                <p className="text-[10px] text-gray-400">
                  This system is restricted to authorized CJ Foods Vietnam users. Login activities are audited under cybersecurity policies.
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleMfaSubmit} className="space-y-5 animate-fade-in">
              <div className="text-center mb-4">
                <div className="w-12 h-12 rounded-full bg-cj-blue/5 flex items-center justify-center mx-auto mb-2 text-cj-blue">
                  <Lock className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-cj-gray-800">Multi-Factor Authentication</h3>
                <p className="text-xs text-gray-600 mt-1">
                  We sent a verification prompt to your Microsoft Authenticator App. Or enter your 6-digit backup code below.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-cj-gray-800 uppercase tracking-wider mb-1.5 text-center">
                  Verification Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="123456"
                  className="w-32 mx-auto text-center tracking-widest text-lg font-bold px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-cj-red/20 focus:border-cj-red outline-none transition-all block"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-2.5 text-white font-medium rounded-lg text-sm transition-all shadow-md bg-gradient-to-r from-cj-red to-cj-orange hover:shadow-lg hover:from-cj-red/95 hover:to-cj-orange/95 active:scale-[0.98] cursor-pointer"
              >
                {isLoading ? (
                  <div className="h-5 w-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <span>Verify Identity & Enter</span>
                )}
              </button>

              <button
                type="button"
                className="w-full text-center text-xs text-gray-600 hover:underline cursor-pointer block"
                onClick={() => setStep(1)}
              >
                Back to Sign In
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
