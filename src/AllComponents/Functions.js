import React, { useState, useEffect, useContext } from 'react';
import { store } from "./AllPages.js";
import { ArrowLeft, Users, Plus, UserPlus, Trash2, Shield, AtSign } from "lucide-react";

const SmailGroups = () => {
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
    
    // 1. Component లోపల ఈ ఫంక్షన్ యాడ్ చెయ్
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

// 2. JSX లో మెంబర్స్ లిస్ట్ చూపే చోట (render section)
<div className="members-mini-list" style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem'}}>
    {group.membersData?.map(m => (
        <div key={m.uid} className="member-row" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--Surface-Active)', padding: '1rem', borderRadius: '1rem'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '.8rem', fontSize: '1.2rem'}}>
                <AtSign size={14} /> {m.smail}
                {group.adminUid === m.uid && <Shield size={14} color="var(--Primary-Accent)" />}
            </div>

            {/* అడ్మిన్ అయితే మరియు వేరే మెంబర్స్ ని తీసేయాలనుకుంటేనే ఈ బటన్ కనిపిస్తుంది */}
            {group.adminUid === userUid && m.uid !== userUid && (
                <button 
                    onClick={() => handleRemoveMember(group.id, m.uid)}
                    style={{background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', padding: '.5rem'}}
                >
                    <Trash2 size={16} />
                </button>
            )}
        </div>
    ))}
</div>

    
    

    return (
        <div className="GroupsPage App">
            <div className="UIAHeader">
                <button className="tpbtn" onClick={() => setPage("ProfilePage")}><ArrowLeft /></button>
                <h1>Smail Groups</h1>
                <button className="tpbtn" onClick={() => setShowCreate(true)}><Plus color="var(--Primary-Accent)" /></button>
            </div>

            <div className="UIAContent scrollable">
                {showCreate && (
                    <div className="neo-card create-box" style={{margin: '2rem'}}>
                        <h3 style={{fontSize: '1.6rem', marginBottom: '1.5rem'}}>New Group</h3>
                        <div className="group-input-wrapper">
                            <input 
                                type="text" 
                                placeholder="Group name" 
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                            />
                            <span style={{fontSize: '1.1rem', opacity: 0.6}}>-group@smails.in</span>
                        </div>
                        <div style={{display: 'flex', gap: '1rem', marginTop: '2rem'}}>
                            <button className="sec-btn" style={{flex: 1}} onClick={() => setShowCreate(false)}>Cancel</button>
                            <button className="pri-btn" style={{flex: 1}} onClick={handleCreateGroup}>Create</button>
                        </div>
                    </div>
                )}

                <div className="groups-list" style={{padding: '2rem'}}>
                    {groups.length === 0 && <p style={{textAlign: 'center', opacity: 0.5, marginTop: '4rem'}}>No groups found</p>}
                    
                    {groups.map(group => (
                        <div key={group.id} className="neo-card group-item" style={{marginBottom: '1.5rem', padding: '2rem'}}>
                            <div className="group-info" onClick={() => setSelectedGroup(selectedGroup === group.id ? null : group.id)} style={{display: 'flex', alignItems: 'center', gap: '1.5rem', cursor: 'pointer'}}>
                                <div className="group-icon" style={{width: '4.5rem', height: '4.5rem', background: 'var(--Surface-Active)', borderRadius: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--Primary-Accent)'}}>
                                    <Users size={22} />
                                </div>
                                <div className="group-details" style={{flex: 1}}>
                                    <h4 style={{fontSize: '1.4rem', fontWeight: '600'}}>{group.id}</h4>
                                    <p style={{fontSize: '1.1rem', opacity: 0.6}}>{group.members.length} Members • {group.adminUid === userUid ? "Admin" : "Member"}</p>
                                </div>
                            </div>

                            {selectedGroup === group.id && (
                                <div className="group-manage" style={{marginTop: '2rem', borderTop: '.1rem solid var(--Surface-Active)', paddingTop: '1.5rem'}}>
                                    {group.adminUid === userUid && (
                                        <div className="neo-input-box" style={{display: 'flex', background: 'var(--Surface-Active)', borderRadius: '1rem', padding: '.5rem 1rem', marginBottom: '1.5rem'}}>
                                            <input 
                                                style={{flex: 1, background: 'transparent', border: 'none', padding: '.8rem', outline: 'none', fontSize: '1.3rem'}}
                                                type="text" 
                                                placeholder="Enter smail to add" 
                                                value={newMemberEmail}
                                                onChange={(e) => setNewMemberEmail(e.target.value)}
                                            />
                                            <button onClick={() => handleAddMember(group.id)} style={{background: 'none', border: 'none', color: 'var(--Primary-Accent)'}}><UserPlus size={20}/></button>
                                        </div>
                                    )}

                                    <div className="members-mini-list" style={{display: 'flex', flexWrap: 'wrap', gap: '.8rem'}}>
                                        {group.membersData?.map(m => (
                                            <div key={m.uid} className="member-tag"
                        
                onDoubleClick={()=>handleRemoveMember(group.id , m.id)}                            style={{background: 'var(--Surface-Active)', padding: '.5rem 1.2rem', borderRadius: '2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '.5rem'}}>
                                                <AtSign size={10} /> {m.smail}
                                                {group.adminUid === m.uid && <Shield size={10} color="var(--Primary-Accent)" />}
                                            </div>
                                        ))}
                                    </div>

                                    {group.adminUid === userUid && (
                                        <button className="del-btn" style={{width: '100%', marginTop: '2rem', padding: '1.2rem', borderRadius: '1rem', border: 'none', color: '#ff4d4d', background: '#fff5f5', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.8rem'}} onClick={() => window.deleteGroup(group.id, userUid)}>
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
    );
};

export default SmailGroups;
