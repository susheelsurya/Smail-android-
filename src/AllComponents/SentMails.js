import React , {useEffect , useContext , useState} from 'react' ;
import {store} from "./AllPages.js" ;

import { EllipsisVertical, ArrowLeft, SendHorizontal , Heart , Send  , Bookmark , BookmarkCheck , Book , BookOpen , ChevronLeft } from "lucide-react";


const SentMails = () => {
  
  const [sentEmails, setSentEmails] = useState([]);
  const [openMail , setOpenMail] = useState(true) ;
  const [ openMailed , setOpenMailed ] = useState() ; 
let {
    // States 
    setPage ,
    form ,
    setForm ,
    toggle ,
    setToggle ,
    type ,
    setType ,
    // Refs 
    searchBarRef ,
    // Functions
    changePage 
   // uIAHandleChange ,
   // saveToLocalStorage
    
  } = useContext(store) ;

  
  
  useEffect(() => {
  let unsubscribeSent = () => {};

  if (window.observeAuthState) {
    window.observeAuthState((status) => {
      if (status.loggedIn) {
        // Sent mails తెచ్చుకోవడానికి కాల్
        unsubscribeSent = window.getSentMessages(status.uid, (data) => {
          setSentEmails(data);
          console.log("Sent Mails Count:", data.length);
        });
      }
    });
  }

  return () => unsubscribeSent(); // క్లీనప్
}, []);




  const toggleLike = () => {
    setToggle(!toggle)
  } 
  
  const SentSmallCard = () => {
    return (
      sentEmails.map((mail) => (
      <div 
       // Start function ki id pampali
        name={mail}
        key={mail.id} 
        className="MailItem"
        onClick={()=>goToMail(mail)}
        
      >
        
        <div className="mail-prof" >
          <h2>
          {mail.name.charAt(0)}
          </h2>
        </div> 
      <div className="con-cun" >  
        <h2 className="MailSender">{mail.name}</h2>
        <h3 className="MailSubject">{mail.subject}</h3>
        <p className="dullText" >
          {mail.body}
        </p>
      </div>
      <div className="savedAtime" >
        <div className="saved" >
          {/*
            !mail.isRead ?
            <Book /> : <BookOpen />
            
          */}
        </div> 
        <div className="MailTime">
          {mail.time?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      </div>
    
  )
    )
    )
  }
  
  
  const SMFPage = () => {
    return (
      
          <div className="mail-body-con" >
            <div className="OYMSubject" >
              <div className="" onClick={toggleLike} >
                { toggle ?
                <Bookmark  /> :
                <BookmarkCheck />
                }
                
              </div> 
              <h2>
              {openMailed.subject || "Loading..."}
              </h2>
              <div>
                <h4>
              {openMailed.time?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </h4>
              </div>
            </div> 
            <div className="OYMBody-Up-Con" >
              <div className="OYMBody-Con" >
                <h3 id="body-text">
                {openMailed.body || " Loading... "}
                </h3>
              </div> 
            </div> 
            <div className="OYMReplay" >
            </div> 
          </div> 
    )
  } 
  
  const goToMail = (e) => {
    setOpenMailed(e) ;
    setOpenMail(false)
  } 
  
  
  
  return (
    <>
      <div className="UserInfoA  App" >
        <div className="UIAHeader" >
          <button className="tpbtn" onClick={()=> setPage("MailHomePage")} >
          <ChevronLeft  />
          </button>
          <div className=""  onClick={()=> setOpenMail(true)}>
            <ArrowLeft/>
          </div> 
          <h1>
              {openMail ? "Sent Mails" : (openMailed?.name || "No Name")}
          </h1>
          <div className="profileIcon" >
            <h2>
            {!openMail && openMailed?.name ? openMailed.name.charAt(0) : " 👤 "}
          </h2>
          </div> 
        </div>
        <div className="UIAContent" >
          {/* Sent Mails చూపిస్తున్నప్పుడు sentEmails ని మ్యాప్ చెయ్ *}
{sentEmails.map((mail) => (
  <div key={mail.id} className="SentMailItem">
    <h2>To: {mail.to}</h2> {/* ఇక్కడ 'to' అడ్రస్ చూపిస్తే బాగుంటుంది *}
    <h3>{mail.subject}</h3>
    <p>{mail.body}</p>
  </div>
))*/}

<div className="SMFPage">
   <div className="MCon">
     <div className="con-M" >
  { openMail ?
  
  <SentSmallCard/> :
  <SMFPage/>
  
  }
 </div>       
 </div>    
</div>
        </div>
        <div className="UIAFooter" >
          <h3>
            Footer
          </h3>
        </div> 
      </div> 
    </>
    
    
  );
  
} 

export default SentMails ; 