
import React, { useContext, useState, useEffect, useRef } from 'react';
import { store } from "./AllPages.js";

import {
  Search,
  Pencil,
  Inbox,
  Menu,
  Book,
  BookOpen,
  UserRound
} from "lucide-react";

import Loading from "./Loading.js";

const MailHomePage = () => {

  // Context
  const {
    setPage,
    toggle,
    setToggle,
    searchBarRef,
    changePage,
    triggerAlert,
    openYourMails
  } = useContext(store);

  // States
  const [emails, setEmails] = useState([]);
  const [userUid, setUserUid] = useState(null);
  const [check, setCheck] = useState(false);
  const [userLabels, setUserLabels] = useState([]);
  const [activeMenuId, setActiveMenuId] = useState(null);

  // ---------------------------
  // LONG PRESS
  // ---------------------------

  const useLongPress = (callback, ms = 800) => {
    const timerRef = useRef();

    const start = (data) => {
      timerRef.current = setTimeout(() => callback(data), ms);
    };

    const stop = () => {
      clearTimeout(timerRef.current);
    };

    return { start, stop };
  };

  // ---------------------------
  // DELETE
  // ---------------------------

  const handleDelete = async (mail) => {

    if (!userUid) return;

    const res = await window.moveToBin(
      userUid,
      mail.id,
      mail
    );

    if (res.success) {
      triggerAlert("Moved to Bin");
    }
  };

  const events = useLongPress(
    (mail) => handleDelete(mail)
  );

  // ---------------------------
  // MOVE LABEL
  // ---------------------------

  const handleMoveToLabel = async (
    mail,
    labelId
  ) => {

    if (!mail?.id || !userUid) return;

    const res = await window.moveToLabel(
      userUid,
      mail.id,
      mail,
      labelId
    );

    if (res.success) {

      triggerAlert("Moved to label!");

      setActiveMenuId(null);

      changePage("MailHomePage");
    }
  };

  // ---------------------------
  // AUTH + MAIL FETCH
  // ---------------------------

  useEffect(() => {

    let unsubscribeMessages;

    if (!window.observeAuthState) return;

    const unsubscribeAuth =
      window.observeAuthState(
        async (status) => {

          console.log("AUTH:", status);

          if (status.loggedIn) {

            setUserUid(status.uid);

            // sync mails
            try {

              const userDetails =
                await window.getUserDetails(
                  status.uid
                );

              if (userDetails?.success) {

                window.listenForRealtimeEmails(

                        userDetails.data.smail,

                        status.uid,

                        (mail) => {

                            console.log(
                                "NEW MAIL:",
                                mail.subject
                            );

                        }

                    );
              }

            } catch (err) {
              console.log(err);
            }

            // labels
            window.getCustomLabels(
              status.uid,
              (labels) => {
                setUserLabels(labels || []);
              }
            );

            // messages
            unsubscribeMessages =
              window.getMessages(
                status.uid,
                (data) => {

                  console.log("MAILS:", data);

                  setEmails(data || []);

                  setCheck(
                    data && data.length > 0
                  );
                }
              );

          } else {

            setUserUid(null);

            setEmails([]);

            if (unsubscribeMessages) {
              unsubscribeMessages();
            }

            setPage("LoginPage");
          }
        }
      );

    return () => {

      if (unsubscribeAuth) {
        unsubscribeAuth();
      }

      if (unsubscribeMessages) {
        unsubscribeMessages();
      }
    };

  }, []);

  // ---------------------------
  // UI
  // ---------------------------

  return (

    <div className="MailHomePage App">

      {/* HEADER */}

      <div className="UIAHeader">

        <button
          className="tpbtn"
          onClick={() => setToggle(false)}
        >
          <Menu />
        </button>

        <div className="MHPRMailCon">

          <div className="MHPRMail">

            <div className="content">

              <Search className="searchicon" />

              <input
                ref={searchBarRef}
                className="in"
                type="text"
                placeholder="Search"
              />

            </div>

          </div>

        </div>

        <div>
          &nbsp;&nbsp;
        </div>

      </div>

      {/* SIDE MENU */}

      <div className={`MHPMenu ${!toggle ? "active" : "hidden"}`}>

        <div className="MHedding">
          <h1 className="WMPDotsP">
            Smail
          </h1>
        </div>

        <div className="MOptions">

          <div className="MBOne">

            <h3
              onClick={() =>
                changePage("SavedMails")
              }
            >
              My Labels
            </h3>

            <h3
              onClick={() =>
                setPage("SentMails")
              }
            >
              Sent
            </h3>

            <h3
              onClick={() =>
                changePage("ScheduledMails")
              }
            >
              Schedule Mail
            </h3>

            <h3
              onClick={() =>
                setPage("BinPage")
              }
            >
              Bin
            </h3>

          </div>

        </div>

      </div>

      {/* MAILS */}

      <div
        className="MCon"
        onClick={() => setToggle(true)}
      >

        <div className="con-M">

          <div className="EmailListContainer">

            {
              !check ? (

                <div className="EmptyState">
                  Empty inbox
                </div>

              ) : emails.length === 0 ? (

                <Loading />

              ) : (

                emails.map((mail) => (

                  <div
                    key={mail.id}
                    className="MailItem"
                    onTouchStart={() =>
                      events.start(mail)
                    }
                    onTouchEnd={events.stop}
                  >

                    {/* PROFILE */}

                    <div className="mail-prof">

                      <h2>
                        {
                          mail.name?.charAt(0) || "U"
                        }
                      </h2>

                    </div>

                    {/* CONTENT */}

                    <div
                      className="con-cun"
                      onClick={() =>
                        openYourMails(
                          mail,
                          userUid
                        )
                      }
                    >

                      <h2 className="MailSender">
                        {mail.name}
                      </h2>

                      <h3 className="MailSubject">
                        {mail.subject}
                      </h3>

                      <p className="dullText">
                        {mail.body}
                      </p>

                    </div>

                    {/* RIGHT */}

                    <div className="savedAtime">

                      <div className="bookmark-con">

                        <div
                          className="saved"
                          onClick={() =>
                            setActiveMenuId(
                              activeMenuId === mail.id
                                ? null
                                : mail.id
                            )
                          }
                        >

                          {
                            mail.isRead
                              ? <BookOpen size={20} />
                              : <Book size={20} />
                          }

                        </div>

                        {
                          activeMenuId === mail.id && (

                            <div className="label-dropdown">

                              <p>Move to:</p>

                              {
                                userLabels.map((label) => (

                                  <div
                                    key={label.id}
                                    className="label-item"
                                    onClick={() =>
                                      handleMoveToLabel(
                                        mail,
                                        label.id
                                      )
                                    }
                                  >

                                    {label.name}

                                  </div>

                                ))
                              }

                            </div>

                          )
                        }

                      </div>

                      <div className="MailTime">

                        {
                          mail.time?.toDate?.()
                            ?.toLocaleTimeString(
                              [],
                              {
                                hour: '2-digit',
                                minute: '2-digit'
                              }
                            )
                        }

                      </div>

                    </div>

                  </div>

                ))

              )
            }

          </div>

        </div>

      </div>

      {/* FOOTER */}

      <div
        className="UIAFooter"
        onClick={() => setToggle(true)}
      >

        {/* WRITE */}

        <div
          className="writeMail"
          onClick={() =>
            setPage("WriteMailPage")
          }
        >

          <Pencil className="mailWriteBtn" />

        </div>

        {/* HOME */}

        <div className="unreadMsgsPage writeMail">

          <Inbox />

        </div>

        {/* PROFILE */}

        <div
          className="profileIcon animated-border"
          onClick={() =>
            setPage("ProfilePage")
          }
        >

          <div className="inner">

            
            <div className="writeMail" >
              <UserRound />
            </div> 
          </div>

        </div>

      </div>

    </div>
  );
};

export default MailHomePage;
