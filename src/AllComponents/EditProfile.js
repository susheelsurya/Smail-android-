
import React, { useState, useEffect, useContext } from 'react';
import { store } from "./AllPages.js";
import { ArrowLeft, Save, User, Lock, Calendar, Briefcase, ShieldCheck, AtSign } from "lucide-react";

const EditProfile = () => {
    const { setPage, userUid, triggerAlert, setIsLoading } = useContext(store);
    
    // Identity Verification State
    const [isVerified, setIsVerified] = useState(false);
    const [verifyPass, setVerifyPass] = useState("");
    
    // Form Data State
    const [formData, setFormData] = useState({
        name: '',
        surName: '',
        nickName: '',
        gender: 'Male',
        usage: 'Personal',
        dOB: '',
        password: ''
    });

    // 1. Fetch current user data on load
    useEffect(() => {
        const fetchDetails = async () => {
            if (userUid) {
                const res = await window.getUserDetails(userUid);
                if (res.success) {
                    setFormData({
                        ...res.data,
                        password: '' // Security reason: password initial ga blank unchali
                    });
                }
            }
        };
        fetchDetails();
    }, [userUid]);

    // Input Change Handler
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 2. Verification Logic (Before editing)
    const handleVerify = async () => {
        if (!verifyPass) {
            triggerAlert("Please enter your current password");
            return;
        }
        setIsLoading(true);
        const res = await window.verifyUserPassword(verifyPass);
        setIsLoading(false);

        if (res.success) {
            setIsVerified(true);
            triggerAlert("Access Granted! ✅");
        } else {
            triggerAlert(res.error);
        }
    };

    // 3. Final Master Update Logic
    const handleUpdate = async () => {
        setIsLoading(true);
        // User details update function pilustunnam (index.html nunchi)
        const res = await window.updateUserProfile(userUid, formData);
        setIsLoading(false);

        if (res.success) {
            triggerAlert("Profile Updated Successfully! ✨");
            setPage("ProfilePage");
        } else {
            triggerAlert("Update Failed: " + res.error);
        }
    };

    // --- Verification Screen (Locked State) ---
    if (!isVerified) {
        return (
            <div className="VerifyOverlay">
                <div className="NeoModal">
                    <div className="ModalIcon"><ShieldCheck size={36} color="#4a90e2" /></div>
                    <h2>Verify Identity</h2>
                    <p>For your security, please enter your current password to continue.</p>
                    
                    <div className="neo-input-box">
                        <label><Lock size={12}/> Current Password</label>
                        <input 
                            type="password" 
                            placeholder="Enter password" 
                            value={verifyPass} 
                            onChange={(e) => setVerifyPass(e.target.value)}
                        />
                    </div>

                    <div className="ModalActions">
                        <button className="sec-btn" onClick={() => setPage("ProfilePage")}>Back</button>
                        <button className="pri-btn" onClick={handleVerify}>Unlock</button>
                    </div>
                </div>
            </div>
        );
    }

    // --- Main Edit Profile Screen (Unlocked State) ---
    return (
        <div className="EditProfile App">
            <div className="UIAHeader">
                <button className="tpbtn" onClick={() => setPage("ProfilePage")}>
                    <ArrowLeft />
                </button>
                <h1>Edit Profile</h1>
                <button className="tpbtn" onClick={handleUpdate}>
                    <Save color="#4CAF50" />
                </button>
            </div>

            <div className="UIAContent scrollable">
                <div className="edit-form-container">
                    
                    {/* Name & Surname Row */}
                    <div className="input-group-row">
                        <div className="neo-input-box">
                            <label><User size={14}/> Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="First Name" />
                        </div>
                        <div className="neo-input-box">
                            <label>Surname</label>
                            <input type="text" name="surName" value={formData.surName} onChange={handleChange} placeholder="Last Name" />
                        </div>
                    </div>

                    {/* Nickname & DOB Row */}
                    <div className="neo-input-box full-width">
                        <label><AtSign size={14}/> Nickname</label>
                        <input type="text" name="nickName" value={formData.nickName} onChange={handleChange} placeholder="Public name" />
                    </div>

                    <div className="neo-input-box full-width">
                        <label><Calendar size={14}/> Date of Birth</label>
                        <input type="date" name="dOB" value={formData.dOB} onChange={handleChange} />
                    </div>

                    {/* Gender & Usage Row */}
                    <div className="input-group-row">
                        <div className="neo-input-box">
                            <label>Gender</label>
                            <select name="gender" value={formData.gender} onChange={handleChange}>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="neo-input-box">
                            <label><Briefcase size={14}/> Usage</label>
                            <select name="usage" value={formData.usage} onChange={handleChange}>
                                <option value="Personal">Personal</option>
                                <option value="Business">Business</option>
                            </select>
                        </div>
                    </div>

                    {/* Password Section (Security Highlight) */}
                    <div className="neo-input-box full-width highlight">
                        <label><Lock size={14}/> Change Login Password</label>
                        <input 
                            type="text" 
                            name="password" 
                            value={formData.password} 
                            onChange={handleChange} 
                            placeholder="Enter new password" 
                        />
                        <small>Leave blank if you don't want to change it.</small>
                    </div>

                    {/* Footer Action Button */}
                    <button className="master-update-btn" onClick={handleUpdate}>
                        Save All Changes
                    </button>

                </div>
            </div>
        </div>
    );
};

export default EditProfile;
