import React, { useEffect, useState, useContext } from 'react';
import { store } from "../AllPages.js";
import { Trash2, Clock, ArrowLeft } from "lucide-react";

const ScheduledMails = () => {
    const { changePage, triggerAlert } = useContext(store);
    const [schedule, setSchedule] = useState([]);
    const [userUid, setUserUid] = useState(null);

    useEffect(() => {
        const unsubscribeAuth = window.observeAuthState((status) => {
            if (status.loggedIn) {
                setUserUid(status.uid);
                // మెయిల్స్ ని తీసుకురావడం
                const unsubscribeMails = window.getscheduledmails(status.uid, (data) => {
                    setSchedule(data);
                });
                return () => unsubscribeMails && unsubscribeMails();
            }
        });
        return () => unsubscribeAuth();
    }, []);

    const handleDelete = async (id) => {
        const res = await window.deleteScheduledMail(userUid, id);
        if (res.success) {
            triggerAlert("Scheduled mail cancelled.");
        }
    };

    return (
        <div className="ScheduledMails App">
            <div className="UIAHeader">
                <button className="tpbtn" onClick={() => changePage("MailHomePage")}>
                    <ArrowLeft />
                </button>
                <h1>Scheduled Smails</h1>
                <div className="profileIcon" >
                    
                </div> 
            </div>

            <div className="UIAContent">
                {schedule.length > 0 ? (
                    <div className="mail-list">
                        {schedule.map((mail) => (
                            <div key={mail.id} className="mail-item scheduled-card">
                                <div className="mail-info">
                                    <div className="mail-top">
                                        <span className="recipient-tag">To: {mail.recipientEmail}</span>
                                        <span className="time-tag">
                                            <Clock size={12} /> {new Date(mail.sendAt).toLocaleString()}
                                        </span>
                                    </div>
                                    <h3 className="mail-sub">{mail.subject}</h3>
                                    <p className="mail-body-preview">{mail.message || mail.body}</p>
                                </div>
                                <button className="delete-schedule-btn" onClick={() => handleDelete(mail.id)}>
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <p>No mails scheduled at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ScheduledMails;
