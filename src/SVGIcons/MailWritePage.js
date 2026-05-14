import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import debounce from "lodash/debounce";

import { store } from "../AllComponents/AllPages.js";

import {
  EllipsisVertical,
  ArrowLeft,
  SendHorizontal,
  CalendarClock,
} from "lucide-react";

const WriteMailPage = () => {
  const {
    setPage,
    isLoading,
    setIsLoading,
    mailInfo,
    setMailInfo,
    farwordMail,
    setFarwordMail,
    receiver,
    setReceiver,
    message,
    setMessage,
    triggerAlert,
  } = useContext(store);

  const [ifTrue, setIfTrue] = useState(false);

  const [suggestions, setSuggestions] = useState([]);

  const [subject, setSubject] = useState("");

  const [senderEmail, setSenderEmail] = useState("");

  const [senderName, setSenderName] = useState("");

  const [scheduleTime, setScheduleTime] = useState("");

  const [showScheduler, setShowScheduler] = useState(false);

  const [userUid, setUserUId] = useState(null);

  // SEARCH LOADING ONLY
  const [searchLoading, setSearchLoading] = useState(false);

  // =========================
  // AUTH + USER DETAILS
  // =========================
  useEffect(() => {
    if (window.observeAuthState) {
      window.observeAuthState(async (status) => {
        if (status.loggedIn) {
          setUserUId(status.uid);

          const res = await window.getUserDetails(status.uid);

          if (res.success) {
            setSenderEmail(res.data.smail);

            setSenderName(
              res.data.name ||
                res.data.nickName ||
                "Unknown"
            );
          }
        }
      });
    }
  }, []);

  // =========================
  // FORWARD MAIL
  // =========================
  useEffect(() => {
    if (farwordMail && farwordMail.isFarword) {
      setSubject(
        "Fwd: " +
          (farwordMail.farwordMailText || "")
      );

      const forwardHeader = `

-------------${farwordMail.from?.from || ""}-------------

➥

`;

      setMessage(
        forwardHeader +
          (farwordMail.body || "")
      );
    }
  }, [farwordMail]);

  // =========================
  // REPLY MAIL
  // =========================
  useEffect(() => {
    if (mailInfo) {
      setReceiver(mailInfo.from);

      setSubject(
        "Re: " + (mailInfo.subject || "")
      );
    }
  }, [mailInfo]);

  // =========================
  // FAST SEARCH WITH DEBOUNCE
  // =========================
  const searchUsersDebounced = useCallback(
    debounce(async (text) => {
      if (text.length > 2) {
        try {
          setSearchLoading(true);

          const results =
            await window.searchUsers(text);

          const filteredResults =
            results.filter(
              (user) =>
                user.smail !== senderEmail
            );

          setSuggestions(filteredResults);
        } catch (error) {
          console.error(error);
        } finally {
          setSearchLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    }, 500),
    [senderEmail]
  );

  const handleSearch = (e) => {
    const text = e.target.value;

    setReceiver(text);

    searchUsersDebounced(text);
  };

  // =========================
  // SEND MAIL
  // =========================
  const handleSend = async () => {
    const recipientEmail =
      mailInfo && mailInfo.from
        ? mailInfo.from
        : receiver;

    if (
      !recipientEmail ||
      !subject ||
      !message
    ) {
      triggerAlert(
        "Please fill all fields"
      );

      return;
    }

    const finalRecipient =
      recipientEmail.toLowerCase().trim();

    setIsLoading(true);

    try {
      let result;

      if (scheduleTime) {
        const mailData = {
          recipientEmail: finalRecipient,
          senderEmail,
          subject,
          message,
          senderName,
          sendAt: scheduleTime,
        };

        result =
          await window.scheduleSmail(
            userUid,
            mailData,
            scheduleTime
          );
      } else {
        result = await window.sendSmail(
          finalRecipient,
          senderEmail,
          subject,
          message,
          senderName
        );
      }

      setIsLoading(false);

      if (result.success) {
        triggerAlert(
          scheduleTime
            ? "Smail Scheduled Successfully!"
            : "Smail Sent!"
        );

        setReceiver("");
        setSubject("");
        setMessage("");
        setScheduleTime("");
        setShowScheduler(false);

        setMailInfo(null);

        setPage("MailHomePage");
      } else {
        triggerAlert(
          "Error: " + result.error
        );
      }
    } catch (error) {
      setIsLoading(false);

      triggerAlert(
        "Error: " + error.message
      );
    }
  };

  // =========================
  // GO BACK
  // =========================
  const goBack = () => {
    setPage("MailHomePage");

    setMailInfo(null);

    setFarwordMail({
      farwordMailText: "",
      body: "",
      isFarword: false,
      from: "",
      name: "",
    });
  };

  // =========================
  // JSX
  // =========================
  return (
    <>
      <div className="UserInfoA App">
        {/* HEADER */}
        <div className="UIAHeader">
          <button
            className="tpbtn"
            onClick={goBack}
          >
            <ArrowLeft />
          </button>

          <h1>
            &nbsp;&nbsp;
            {farwordMail.name ||
              senderEmail ||
              "Loading..."}
            &nbsp;&nbsp;
          </h1>

          <button
            className="tpbtn"
            onClick={() =>
              setIfTrue(true)
            }
          >
            <EllipsisVertical />
          </button>
        </div>

        {/* MENU */}
        {ifTrue && (
          <div className="WMPDots">
            <p
              className="WMPDotsP"
              onClick={() => {
                setShowScheduler(
                  !showScheduler
                );

                setIfTrue(false);
              }}
            >
              Schedule time
            </p>

            <p className="WMPDotsP">
              Save
            </p>

            <p className="WMPDotsP">
              Settings
            </p>

            <p className="WMPDotsP">
              Help & Feedback
            </p>
          </div>
        )}

        {/* CONTENT */}
        <div
          className="UIAContent mail-con"
          onClick={() =>
            setIfTrue(false)
          }
        >
          <div className="dg">
            {/* SUBJECT */}
            <input
              className="UIAInp"
              type="text"
              id="sub"
              name="Subject"
              placeholder="Subject"
              value={subject}
              onChange={(e) =>
                setSubject(
                  e.target.value
                )
              }
            />

            <div>
              {/* SCHEDULE */}
              <button
                className="tpbtn"
                onClick={() =>
                  setShowScheduler(
                    !showScheduler
                  )
                }
              >
                <CalendarClock
                  color={
                    scheduleTime
                      ? "#4CAF50"
                      : "currentColor"
                  }
                />
              </button>

              {showScheduler && (
                <div className="schedule-box">
                  <input
                    type="datetime-local"
                    value={scheduleTime}
                    onChange={(e) =>
                      setScheduleTime(
                        e.target.value
                      )
                    }
                    className="UIAInp"
                  />
                </div>
              )}

              {/* MESSAGE */}
              <textarea
                id="compose"
                name="compose"
                rows="30"
                placeholder="Compose"
                value={message}
                onChange={(e) =>
                  setMessage(
                    e.target.value
                  )
                }
              ></textarea>
            </div>
          </div>
        </div>

        {/* SEARCH RESULTS */}
        {searchLoading && (
          <div className="suggestions-list">
            <p
              style={{
                padding: "10px",
              }}
            >
              Searching...
            </p>
          </div>
        )}

        {!searchLoading &&
          suggestions.length > 0 && (
            <div className="suggestions-list">
              {suggestions.map(
                (user) => (
                  <div
                    key={user.smail}
                    className="suggestion-item"
                    onClick={() => {
                      setReceiver(
                        user.smail
                      );

                      setSuggestions(
                        []
                      );
                    }}
                  >
                    <span className="suggestion-label">
                      To:
                    </span>{" "}
                    {user.smail}
                  </div>
                )
              )}
            </div>
          )}

        {/* FOOTER */}
        <div className="UIAFooter">
          <label htmlFor="to">
            To
          </label>

          <input
            className="resever-smail"
            type="email"
            id="to"
            name="resever"
            placeholder="Smail"
            value={receiver}
            onChange={handleSearch}
          />

          <button
            className="sentBtn"
            onClick={handleSend}
          >
            <SendHorizontal stroke="white" />
          </button>
        </div>
      </div>
    </>
  );
};

export default WriteMailPage;