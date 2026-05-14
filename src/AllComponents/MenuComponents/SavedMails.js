import React, { useState, useEffect , useContext , useRef } from 'react';
import { store } from "../AllPages.js";

import { Search, Pencil, Inbox, Menu, Book, BookOpen, ChevronUp, ChevronDown, Moon, Sun, CalendarClock, Plus, BookmarkCheck, SendHorizontal  , ArrowLeft , EllipsisVertical} from "lucide-react";

const MyLabel = () => {
  
  const {changePage , openYourMails , triggerAlert , 
    triggerConfirm ,
  } = useContext(store);
  
  let labelRefs = useRef([]) ;
  
  const [userLabels, setUserLabels] = useState([]); 
  const [ifTrue , setIfTrue] = useState(false) ;
  const [mails, setMails] = useState([]);
  const [userUid, setUserUid] = useState(null);
  const [activeLabel, setActiveLabel] = useState(null);
      const [newLabel, setNewLabel] = useState("");



  // 1. Auth & Labels Loading
  useEffect(() => {
    const unsubscribeAuth = window.observeAuthState((status) => {
      if (status.loggedIn) {
        setUserUid(status.uid);
        window.getCustomLabels(status.uid, (labelsData) => {
          setUserLabels(labelsData);
          // Initial load lo first label select cheyyadam
          if (labelsData.length > 0 && !activeLabel) {
            setActiveLabel(labelsData[0].id);
          }
        });
      }
    });
    return () => unsubscribeAuth();
  }, [activeLabel]);

  // 2. Load Mails based on activeLabel
  useEffect(() => {
    if (userUid && activeLabel) {
      // Label marinappudu patha mails kanipinchakunda clear cheyyadam
      setMails([]); 
      
      const unsubscribeMails = window.getLabelMessages(userUid, activeLabel, (mailsData) => {
        // Ikkada database nundi vacche data activeLabel dhi ayithe ne update chestunnam
        setMails(mailsData);
      });
      return () => unsubscribeMails();
    }
  }, [userUid, activeLabel]);
  
  const handleRestore = async (mail) => {
    if (!userUid || !activeLabel) return;
    
    // ఇక్కడ restoreFromBin బదులు restoreFromLabel వాడాలి
    const res = await window.restoreFromLabel(userUid, mail.id, mail, activeLabel);
    
    if (res.success) {
        console.log("Restored successfully from label");
        // Mails list update avvadaniki state filter cheyochu (optional since onSnapshot is there)
        setMails(prev => prev.filter(m => m.id !== mail.id));
    } else {
       triggerAlert("Restore failed: " + res.error);
    }
};

  
  const handleDeleteLabel = async (passedId) => {
    // 1. passedId ఉంటే అది, లేదంటే activeLabel (స్టేట్) వాడు
    // ఆ Ref లాజిక్ ఇక్కడ అవసరం లేదు బ్రో
    let LID =  activeLabel;

    console.log("Attempting to delete Label ID:", LID);

    if (!LID) {
       triggerAlert("Select a label first!");
        return;
    }



    if ( triggerConfirm("This will delete the Label permanently! Proceed?", async () => {
      const res = await window.deleteCustomLabel(userUid, LID);
        
        if (res.success) {
           triggerAlert("Label Deleted!");
            setActiveLabel(null); // స్టేట్ క్లియర్ చెయ్
           // changePage("MailHomePage"); 
        } else {
            console.error("Delete failed:", res.error);
        }
    }) ) {
        
    }
};

  
  const handleCreateLabel = async () => {
        if (newLabel && userUid) {
            const res = await window.createCustomLabel(userUid, newLabel);
            if (res.success) {
               triggerAlert("Label created!");
                setNewLabel(""); // Reset input
            }
        }
    };

  
  

  return (
    <div className="UserInfoA App savedMails">
      <div className="UIAHeader">
        <button className="tpbtn" onClick={()=>changePage("MailHomePage")} >
          <ArrowLeft />
        </button>
        <div className="label-create-box">
                                <input 
                          className="labelInp"          type="text" 
                                    placeholder="New Label" 
                                    value={newLabel}
                                    onChange={(e) => setNewLabel(e.target.value)} 
                                />
                                <Plus onClick={handleCreateLabel} size={20} />
                            </div>
        <button className="tpbtn" onClick={()=> setIfTrue(!ifTrue)} >
          <EllipsisVertical />
        </button>
      </div>
        {ifTrue && (
          <div className="WMPDots">
            <p className="WMPDotsP" onClick={()=> changePage("ScheduledMails")}  >Schedule time</p>
            <p className="WMPDotsP" onClick={()=> handleDeleteLabel() } >Delete</p>
            <p className="WMPDotsP" onClick={()=>  changePage("NotAvailable")} >Settings</p>
            <p className="WMPDotsP" onClick={()=> changePage("HelpAndFeedback")} >Help & Feedback</p>
          </div>
        )}
      <div className="UIAContent" onClick={()=> setIfTrue(false)} >
        
        <div className="MCon" >
          <div className="con-M">
        <div className="EmailListContainer">
          {mails.length === 0 ? (
            <div className="EmptyState">
              <p>No messages found in this category</p>
            </div>
          ) : (
            mails.map((mail) => (
              <div key={mail.id} className="MailItem">
                <div className="mail-prof">
                <div>                        <h2>{mail.name?.charAt(0) || "U"}</h2>
                                    </div>
                  
                   <div className="con-cun" > 
                    <h2 onClick={() => openYourMails(mail , userUid)} className="MailSender">{mail.name || "Unknown"}</h2>
                  
                  <h3 className="MailSubject">{mail.subject}</h3>
                  <p className="dullText">{mail.body}</p>
                  </div>
                </div>
                
                <button className="tpbtn" onClick={()=> handleRestore(mail) }>
                  <Inbox/>
                </button> 
              </div>
            ))
          )}
        </div>
        </div>
        </div>
      </div>
      <div className="UIAFooter" >
        <div className="label-con" >
        <div className="LabelTabsContainer">
          {/*userLabels.map((label, ind) => (
          <button 
              key={label.id}
              labelRefs={(el) => (labelRefs.current[ind] = el)}
              onClick={() => setActiveLabel(label.id)}
              name={label}
              
              className="tpbtn  labelBtns"
              onDoubleClick={()=> handleDeleteLabel(label.id)}
            >
              {label.name}
          </button>
          ))*/}
          
          {userLabels.map((label, ind) => (
 <button 
    key={label.id}
    onClick={() => setActiveLabel(label.id)}
    className={`tpbtn labelBtns ${activeLabel === label.id ? 'active' : ''}`}
>
    {label.name}
</button>

))}

          
        </div>
        </div>
      </div> 
    </div>
  );
};

export default MyLabel;
