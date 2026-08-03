import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { toast } from "react-toastify";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const MeetingPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const meetingRef = useRef(null);

  useEffect(() => {
    let zp = null;

    const startMeeting = async () => {
      try {
        const authToken =
          localStorage.getItem("UserToken") ||
          localStorage.getItem("MentorToken") ||
          localStorage.getItem("AdminToken");

        const response = await fetch(`${API_BASE_URL}/api/meeting/${roomId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        const data = await response.json();

        console.log("Meeting Response:", data);

        if (!response.ok || !data.success) {
          toast.error(data.message || "Unable to join meeting.");
          navigate(-1);
          return;
        }

        const {
          appID,
          roomId: meetingRoomId,
          bookingId,
          userID,
          userName,
          token,
        } = data.meeting;

        console.log("Booking ID:", bookingId);

        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
          appID,
          token,
          meetingRoomId,
          userID,
          userName
        );

        zp = ZegoUIKitPrebuilt.create(kitToken);

       zp.joinRoom({
         container: meetingRef.current,

         scenario: {
           mode: ZegoUIKitPrebuilt.OneONoneCall,
         },

         showLeavingView: true,
         showLeaveRoomConfirmDialog: true,

         onLeaveRoom: async () => {
           await fetch(`${API_BASE_URL}/api/meeting/${meetingRoomId}/end`, {
             method: "PUT",
             headers: {
               Authorization: `Bearer ${authToken}`,
               "Content-Type": "application/json",
             },
           });
         },

         onReturnToHomeScreenClicked: () => {
           if (localStorage.getItem("UserToken")) {
             navigate(`/review/${bookingId}`, { replace: true });
           } else {
             navigate("/mentor/CompletedBookings", { replace: true });
           }
         },
       });
      } catch (error) {
        console.error(error);
        toast.error("Unable to join meeting.");
        navigate(-1);
      }
    };

    startMeeting();

    return () => {
      if (zp) {
        zp.destroy();
      }
    };
  }, [roomId, navigate]);

  return (
    <div
      ref={meetingRef}
      style={{
        width: "100%",
        height: "100vh",
      }}
    />
  );
};

export default MeetingPage;
