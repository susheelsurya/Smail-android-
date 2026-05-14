import React, { useContext, useState, useEffect } from 'react';

import { store } from "../AllPages.js";
import { ArrowLeft, Trash2, RotateCcw } from "lucide-react"; // కొత్త ఐకాన్స్

const BinPage = () => {
  let { changePage , triggerConfirm , handleConfirmAction } = useContext(store);
  const [binMails, setBinMails] = useState([]);
  const [userUid, setUserUid] = useState(null);

  useEffect(() => {
    let unsubscribeBin = () => {};
    if (window.observeAuthState) {
      window.observeAuthState((status) => {
        if (status.loggedIn) {
          setUserUid(status.uid);
          unsubscribeBin = window.getBinMessages(status.uid, (data) => {
            setBinMails(data);
          });
        }
      });
    }
    return () => unsubscribeBin();
  }, []);

const handleRestore = async (mail) => {
    if (!userUid) return;
    const res = await window.restoreFromBin(userUid, mail.id, mail);
    if (res.success) {
        // అలెర్ట్ బదులు కన్సోల్ లో చెక్ చెయ్
        console.log("Restored successfully");
    } else {
       triggerAlert("Restore failed: " + res.error);
    }
};

  const handleDeleteForever = async (mailId) => {
    if (!userUid) return;
    
    triggerConfirm("This will delete the mail permanently! Proceed?", async () => {
    const res = await window.deletePermanently(userUid, mailId);
    if (res.success) triggerAlert("Deleted permanently");
  });
    
    
    /*
    if (triggerConfirm("This will delete the mail permanently! Proceed?" , handleConfirmAction )) {
      const res = await window.deletePermanently(userUid, mailId);
      if (res.success) {
       triggerAlert("Deleted permanently");
      }
    }
    */
  };

  return (
    <div className="UserInfoA App">
      <div className="UIAHeader">
        <button className="tpbtn" onClick={() => changePage("MailHomePage")}>
          <ArrowLeft />
        </button> 
        <h1>Bin</h1>
        <div className="profileIcon" >
        </div> 
      </div>

      <div className="UIAContent">
        <div className="binMails">
        {binMails.length === 0 ? (
          <p style={{ textAlign: 'center', marginTop: '20px' }}>Bin is empty</p>
        ) : (
          binMails.map((mail) => (
            <div key={mail.id} className="MailItem">
              <button onClick={() => handleDeleteForever(mail.id)} title="Delete Forever" className="tpbtn" >
                  <Trash2 size={26} color="red" />
                </button>
              <div className="con-cun">
                
                <h2 className="MailSender">{mail.name}</h2>
                <h3 className="MailSubject">{mail.subject}</h3>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                {/* Restore Button */}
               
                {/* Permanent Delete Button */}
                
                 <button onClick={() => handleRestore(mail)} title="Restore" className="tpbtn rotateBtn">
                  <RotateCcw size={26} color="green" />
                </button>
                
              </div>
            </div>
          ))
        )}
      </div>
      </div>
    </div>
  );
}

export default BinPage;
