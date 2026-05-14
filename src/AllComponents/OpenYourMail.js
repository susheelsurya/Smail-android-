import React , {useContext , useState , useEffect}  from 'react' ;
import {store} from "./AllPages.js" ; 
import { EllipsisVertical, ArrowLeft, SendHorizontal , Heart , Send  , Bookmark , BookmarkCheck , Reply , CornerUpRight , CornerUpLeft } from "lucide-react";


const openYourMail = () => {
  
  
  let {
    // States 
    setPage ,
    form ,
    setForm ,
    toggle ,
    setToggle ,
    type ,
    setType ,
    mailInfo ,
    setMailInfo ,
    farwordMail , 
    setFarwordMail,
    receiver, 
    setReceiver ,
    message, 
    setMessage ,
    // Refs 
    searchBarRef ,
    // Functions
    changePage ,
    lSubmit ,
   // uIAHandleChange ,
   // saveToLocalStorage
    
  } = useContext(store) ;
  
  
  

  
    if (!mailInfo) {
    return 
    <div className="UserInfoA App">Loading mail details...</div>;
  }
  
  const toggleLike = () => {
    setToggle(!toggle)
  } 
  
  const opreplyToMail = () => {/*
    setReceiver(null) ;
    //setMailInfo(mailInfo.from);
    setReceiver(mailInfo.from) ;
    // 'from' address ni context lo pettu
  setPage("WriteMailPage");   // Write page ki vellu
    */
  } 
  
  const farwordMails = () => {
    
    setFarwordMail({
      farwordMailText : mailInfo.subject ,
      body : mailInfo.body ,
      isFarword : true ,
      from : mailInfo ,
      name : mailInfo.name ,
      
    })
    
    setPage("WriteMailPage") ;
    setMailInfo(null) ;
 } 
  
  const replyToMail = () => {
  setReceiver(mailInfo.from);
  
  // Previous message ni context kosam formatting chestunnam
  const replyHeader = `\n\n--- On ${new Date().toLocaleDateString()}, ${mailInfo.name} wrote: ---\n> ${mailInfo.body}\n\n`;
  setMessage(replyHeader);
  
  setPage("WriteMailPage");
};

  const goBackPage = () => {
    setReceiver("") ;
    changePage("MailHomePage") ;
  } 
  
  
  
  return (
    <>
      <div className="UserInfoA  App" >
        <div className="UIAHeader" >
          <div className="" onClick={goBackPage} >
            <ArrowLeft />
          </div> 
          <h1>
            &nbsp; &nbsp;{mailInfo.name || "Loading..."} &nbsp; &nbsp;
          </h1>
          <div className="profileIcon" >
            <h2>
          {mailInfo.from.charAt(0)}
          </h2>
          </div> 
        </div>
        <div className="UIAContent mail-content" >
          <div className="mail-body-con" >
            <div className="OYMSubject" >
              <div className="" onClick={toggleLike} >
                { toggle ?
                <Bookmark  /> :
                <BookmarkCheck  />
                }
                
              </div> 
              <h2>
              {mailInfo.subject || "Loading..."}
              </h2>
              <div>
                <h4>
              {mailInfo.time?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </h4>
              </div>
            </div> 
            <div className="OYMBody-Up-Con" >
              {farwordMail.isFarword ? <p>Farword Mail : </p> : null } 
              <div className="OYMBody-Con" >
                <h3 id="body-text">
                  {farwordMail.isFarword && 
                  <span className="FMail" >
                    <CornerUpLeft />
                  </span>
                  }
                {mailInfo.body || " Loading... "}
                </h3>
              </div> 
            </div> 
            <div className="OYMReplay" >
              <h2>
               {mailInfo.from}
              </h2>
            </div> 
          </div> 
        </div>
        <div className="UIAFooter" >
          <button className="replayOrFarword"
            onClick={replyToMail}
          >
                <Reply stroke="white" />&nbsp; Replay
              </button> 
              <button className="replayOrFarword" onClick={farwordMails} >
                <CornerUpRight stroke="white"/>&nbsp; Farword
              </button>
        </div> 
      </div> 
    </>
    
    
  );
  
} 

export default openYourMail ; 
