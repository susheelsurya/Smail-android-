import React, { useState, useEffect, useContext } from 'react';
import { store } from "./AllPages.js";
import { ArrowLeft, Users, Plus, UserPlus, Trash2, Shield, AtSign } from "lucide-react";

// ... imports same untayi

const SmailGroups = () => {
    // ... states and handlers same
    
    const { setPage, userUid, triggerAlert, setIsLoading } = useContext(store);
    const [groups, setGroups] = useState([]);
    const [showCreate, setShowCreate] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [newMemberEmail, setNewMemberEmail] = useState("");
    const [selectedGroup, setSelectedGroup] = useState(null);

useEffect(() => {
        if (userUid) {
            const unsubscribe = window.listenToMyGroups(userUid, setGroups);
            return () => unsubscribe && unsubscribe();
        }
    }, [userUid]);

    
    const handleCreateGroup = async () => {
    if (!groupName) return triggerAlert("Group name is required");
    
    // గ్రూప్ పేరుని చిన్న అక్షరాల్లోకి మార్చి, చివర -group@smails.in యాడ్ చేస్తున్నాం
    const cleanGroupName = groupName.trim().toLowerCase();
    const fullGroupId = `${cleanGroupName}-group@smails.in`;
    
    setIsLoading(true);
    const res = await window.createNewGroup(fullGroupId, userUid);
    setIsLoading(false);

    if (res.success) {
        triggerAlert("Group Created: " + fullGroupId); // ఐడి ఏంటో ఇక్కడ చూపిస్తుంది
        setGroupName("");
        setShowCreate(false);
    } else {
        triggerAlert(res.error);
    }
};



    const handleAddMember = async (groupId) => {
        if (!newMemberEmail) return triggerAlert("Enter member smail");
        setIsLoading(true);
        const res = await window.addMemberToGroup(groupId, newMemberEmail, userUid);
        setIsLoading(false);
        
        if (res.success) {
            triggerAlert("Member Added! ✅");
            setNewMemberEmail("");
        } else {
            triggerAlert(res.error);
        }
    };
        



    const handleRemoveMember = async (groupId, memberUid) => {
        if (!window.confirm("Are you sure you want to remove this member?")) return;
        setIsLoading(true);
        const res = await window.removeMemberFromGroup(groupId, memberUid, userUid);
        setIsLoading(false);

        if (res.success) {
            triggerAlert("Member removed successfully! ❌");
        } else {
            triggerAlert(res.error);
        }
    };

    // Ee kindha unna return block lone JSX motham undali
    return (
        <div className="GroupsPage App">
            <div className="UIAHeader">
                <button className="tpbtn" onClick={() => setPage("ProfilePage")}><ArrowLeft /></button>
                <h1>Smail Groups</h1>
                <button className="tpbtn" onClick={() => setShowCreate(true)}><Plus color="var(--Primary-Accent)" /></button>
            </div>

            <div className="UIAContent scrollable">
                <div className="con-G" >
                {/* Create Group Box */}
                
                {showCreate && (
                    <div className="neo-card create-box">
                        <h3>New Group</h3>
                        <div className="group-input-wrapper">
                            <input 
                                type="text" 
                                placeholder="Group name" 
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                            />
                            <span className="domain-hint">-group@smails.in</span>
                        </div>
                        <div className="btn-row">
                            <button className="sec-btn" onClick={() => setShowCreate(false)}>Cancel</button>
                            <button className="pri-btn" onClick={handleCreateGroup}>Create</button>
                        </div>
                    </div>
                )}

                {/* Groups List */}
                <div className="groups-list">
                    {groups.length === 0 && <p className="empty-state">No groups found</p>}
                    
                    {groups.map(group => (
                        <div key={group.id} className="neo-card group-item">
                            <div className="group-info" onClick={() => setSelectedGroup(selectedGroup === group.id ? null : group.id)}>
                                <div className="group-icon">
                                    <Users size={22} />
                                </div>
                                <div className="group-details">
                                    <h4>{group.id}</h4>
                                    <p>{group.members.length} Members • {group.adminUid === userUid ? "Admin" : "Member"}</p>
                                </div>
                            </div>

                            {/* Group Management Section (Visible on Click) */}
                            {selectedGroup === group.id && (
                                <div className="group-manage">
                                    {group.adminUid === userUid && (
                                        <div className="member-add-box">
                                            <input 
                                                type="text" 
                                                placeholder="Enter smail to add" 
                                                value={newMemberEmail}
                                                onChange={(e) => setNewMemberEmail(e.target.value)}
                                            />
                                            <button onClick={() => handleAddMember(group.id)}><UserPlus size={20}/></button>
                                        </div>
                                    )}

                                    <div className="members-mini-list">
                                        {group.membersData?.map(m => (
                                            <div key={m.uid} className="member-row">
                                                <div className="member-meta">
                                                    <AtSign size={14} /> {m.smail}
                                                    {group.adminUid === m.uid && <Shield size={14} color="var(--Primary-Accent)" />}
                                                </div>
                                                
                                                {group.adminUid === userUid && m.uid !== userUid && (
                                                    <button 
                                                        className="remove-btn"
                                                        onClick={() => handleRemoveMember(group.id, m.uid)}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {group.adminUid === userUid && (
                                        <button className="delete-group-btn" onClick={() => window.deleteGroup(group.id, userUid)}>
                                            <Trash2 size={16} /> Delete Group
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                </div>
            </div>
        </div>
    );
};

export default SmailGroups;
