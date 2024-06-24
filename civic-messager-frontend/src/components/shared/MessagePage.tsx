import { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { HiDotsVertical } from "react-icons/hi";
import { FaAngleLeft } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import Loading from "./Loading";
import { IoMdSend } from "react-icons/io";
import moment from "moment";
import uploadFile from "../utils/uploadFile";
import { Avatar, AvatarImage } from "../ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import {
  getMessagesBetweenTwoUsers,
  saveMessage,
} from "@/services/MessageService";
import { getCurrentUser } from "@/services/UserService";
import { setUser } from "@/redux/authSlice";
import { Client } from "@stomp/stompjs";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { WebSocketContext } from "@/context/WebSocketContext";

const youtubeRegex =
  /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/;

const MessagePage = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state?.auth);
  const { client: stompClient } = useContext(WebSocketContext);

  const [loading, setLoading] = useState(false);

  const [client, setClient] = useState<Client | null>(null);
  const [dataPartner, setDataPartner] = useState({
    id: 0,
    username: "",
    email: "",
    avatarUrl: "",
    isActive: false,
  });
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: "",
  });
  const [allMessage, setAllMessage] = useState<
    {
      senderId: number;
      receiverId: number;
      mediaType: string;
      content: string;
      mediaUrl: string;
      timestamp: string;
    }[]
  >([]);
  const currentMessage = useRef<HTMLDivElement>(null);

  const getAllMessages = async () => {
    const currentUserResponse = await getCurrentUser(
      JSON.parse(localStorage.getItem("info") || "0")
    );
    const currentUserData = currentUserResponse?.data.data;
    dispatch(setUser(currentUserData));

    const response = await getMessagesBetweenTwoUsers(
      currentUserData.id,
      parseInt(params.userId || "0")
    );

    if (response && response.data.data) {
      setAllMessage(response.data.data);
    }
  };

  const getPartnerData = async () => {
    const response = await getCurrentUser(
      parseInt(params.userId || "0")
    );

    if (response && response.data.data) {
      setDataPartner(response.data.data);
    }
  };

  const handleUploadImage = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      setLoading(true);
      const uploadPhoto = await uploadFile(file);
      setLoading(false);

      setMessage((preve) => {
        return {
          ...preve,
          imageUrl: uploadPhoto.url,
        };
      });
    }
  };

  const handleClearUploadImage = () => {
    setMessage((preve) => {
      return {
        ...preve,
        imageUrl: "",
      };
    });
  };

  const handleUploadVideo = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      setLoading(true);
      const uploadPhoto = await uploadFile(file);
      setLoading(false);
      setMessage((preve) => {
        return {
          ...preve,
          videoUrl: uploadPhoto.url,
        };
      });
    }
  };

  const handleClearUploadVideo = () => {
    setMessage((preve) => {
      return {
        ...preve,
        videoUrl: "",
      };
    });
  };

  const handleOnChange = (e: {
    target: { name: any; value: any };
  }) => {
    const { name, value } = e.target;

    setMessage((preve) => {
      return {
        ...preve,
        text: value,
      };
    });
  };

  const handleSendMessage = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (message.text !== "" && message.text.trim() !== "") {
      if (stompClient && stompClient.connected) {
        let newMessage = {
          senderId: user.id,
          receiverId: dataPartner.id,
          content: message.text,
          status: "",
          mediaType: "text",
          mediaUrl: "",
          timestamp: new Date(),
        };
        stompClient.publish({
          destination: `/topic/${dataPartner.username}`,
          body: JSON.stringify({
            ...newMessage,
            username: dataPartner.username,
          }),
        });
        setAllMessage((prev) => [
          ...prev,
          {
            ...newMessage,
            timestamp: newMessage.timestamp.toISOString(),
          },
        ]);
        const saveMessageResponse = await saveMessage(newMessage);
        console.log(saveMessageResponse);
        setMessage({
          text: "",
          imageUrl: "",
          videoUrl: "",
        });
      } else {
        console.error("STOMP client is not connected");
      }
    }
  };

  const handleSendImageMessage = async () => {
    if (message.imageUrl !== "") {
      if (client && client.connected) {
        let newMessage = {
          senderId: user.id,
          receiverId: dataPartner.id,
          content: "",
          status: "",
          mediaType: "image",
          mediaUrl: message.imageUrl,
          timestamp: new Date(),
        };
        client.publish({
          destination: `/topic/${dataPartner.username}`,
          body: JSON.stringify({
            ...newMessage,
            username: dataPartner.username,
          }),
        });
        setAllMessage((prev) => [
          ...prev,
          {
            ...newMessage,
            timestamp: newMessage.timestamp.toISOString(),
          },
        ]);
        const saveMessageResponse = await saveMessage(newMessage);
        console.log(saveMessageResponse);
        setMessage({
          text: "",
          imageUrl: "",
          videoUrl: "",
        });
      } else {
        console.error("STOMP client is not connected");
      }
    }
  };

  const handleSendVideoMessage = async () => {
    if (message.videoUrl !== "") {
      if (client && client.connected) {
        let newMessage = {
          senderId: user.id,
          receiverId: dataPartner.id,
          content: "",
          status: "",
          mediaType: "video",
          mediaUrl: message.videoUrl,
          timestamp: new Date(),
        };
        client.publish({
          destination: `/topic/${dataPartner.username}`,
          body: JSON.stringify({
            ...newMessage,
            username: dataPartner.username,
          }),
        });
        setAllMessage((prev) => [
          ...prev,
          {
            ...newMessage,
            timestamp: newMessage.timestamp.toISOString(),
          },
        ]);
        const saveMessageResponse = await saveMessage(newMessage);
        console.log(saveMessageResponse);
        setMessage({
          text: "",
          imageUrl: "",
          videoUrl: "",
        });
      } else {
        console.error("STOMP client is not connected");
      }
    }
  };

  useEffect(() => {
    getPartnerData();
    getAllMessages();
  }, [params]);

  // useEffect(() => {
  //   const stompClient = new Client({
  //     webSocketFactory: () =>
  //       new WebSocket("ws://localhost:15674/ws"),
  //     debug: (msg: string) => {
  //       console.log(msg);
  //     },
  //     onConnect: () => {
  //       stompClient.subscribe(
  //         `/topic/${user.username}`,
  //         (message) => {
  //           console.log(message);

  //           if (message.body) {
  //             const newMessage = JSON.parse(message.body);

  //             setAllMessage((prev) => [
  //               ...prev,
  //               {
  //                 ...newMessage,
  //                 timestamp: new Date(
  //                   newMessage.timestamp
  //                 ).toISOString(),
  //               },
  //             ]);
  //           } else {
  //             console.log("got empty message");
  //           }
  //         }
  //       );
  //     },
  //     connectionTimeout: 10000,
  //   });

  //   stompClient.activate();
  //   setClient(stompClient);

  //   return () => {
  //     stompClient.deactivate();
  //   };
  // }, [user]);

  useEffect(() => {
    if (stompClient?.connected) {
      console.log("stomp client is connected");
      stompClient.subscribe(`/topic/${user.username}`, (message) => {
        console.log(message);

        if (message.body) {
          const newMessage = JSON.parse(message.body);

          setAllMessage((prev) => [
            ...prev,
            {
              ...newMessage,
              timestamp: new Date(newMessage.timestamp).toISOString(),
            },
          ]);
        } else {
          console.log("got empty message");
        }
      });
    }
  }, [stompClient?.connected, user]);

  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [allMessage]);

  return (
    <div className="bg-no-repeat bg-cover">
      <header className="sticky top-0 h-16 bg-white flex justify-between items-center px-4">
        <div className="flex items-center gap-4">
          <Link to={"/"} className="lg:hidden">
            <FaAngleLeft size={25} />
          </Link>
          <div>
            <Avatar>
              <AvatarImage
                className="w-12 h-12"
                src={dataPartner?.avatarUrl}
              />
              <AvatarFallback className="w-28 h-28">
                {(dataPartner?.username)[0]}
              </AvatarFallback>
            </Avatar>
          </div>
          <div>
            <h3 className="font-semibold text-lg my-0 text-ellipsis line-clamp-1">
              {dataPartner?.username}
            </h3>
            <p className="-my-2 text-sm">
              {dataPartner.isActive ? (
                <span className="text-primary">online</span>
              ) : (
                <span className="text-slate-400">offline</span>
              )}
            </p>
          </div>
        </div>

        <div>
          <button className="cursor-pointer hover:text-primary">
            <HiDotsVertical />
          </button>
        </div>
      </header>

      {/***show all message */}
      <section className="h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-50">
        {/**all message show here */}
        <div
          className="flex flex-col gap-2 py-2 mx-2"
          ref={currentMessage}
        >
          {allMessage?.map((msg, index) => {
            const generateClassName = () => {
              let classes =
                "p-1 py-1 rounded w-fit max-w-[280px] md:max-w-sm lg:max-w-md break-words";
              if (
                msg.mediaType !== "text" ||
                youtubeRegex.test(msg.content)
              )
                classes += " bg-transparent";
              if (
                user.id === msg?.receiverId &&
                msg.mediaType === "text"
              )
                classes += " bg-white";
              if (user.id === msg.senderId) {
                if (msg.mediaType === "text")
                  classes += " bg-blue-300";
                classes += " ml-auto";
              }
              return classes;
            };

            return (
              <div className={generateClassName()} key={index}>
                <div className="w-full relative">
                  {msg?.mediaUrl && msg?.mediaType == "image" && (
                    <img
                      src={msg?.mediaUrl}
                      className="w-full h-full object-scale-down rounded-lg shadow-md"
                    />
                  )}
                  {msg?.mediaUrl && msg?.mediaType == "video" && (
                    <video
                      src={msg.mediaUrl}
                      className="w-full h-full object-scale-down rounded-lg shadow-md"
                      controls
                    />
                  )}
                </div>
                {msg?.mediaType == "text" ? (
                  youtubeRegex.test(msg.content) ? (
                    <iframe
                      className="object-scale-down rounded-lg shadow-md lg:w-[440px] lg:h-[245px]"
                      src={`https://www.youtube.com/embed/${
                        msg.content.split("v=")[1].split("&")[0]
                      }`}
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <p className="px-2">{msg.content}</p>
                  )
                ) : (
                  <p className="px-2">{msg.content}</p>
                )}

                <p className="text-xs px-2 py-2 w-fit">
                  {moment(msg.timestamp).format("hh:mm")}
                </p>
              </div>
            );
          })}
        </div>

        {/**upload Image display */}
        {message.imageUrl && (
          <div className="w-full h-full sticky bottom-0 bg-gray-600 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
            <div
              className="w-fit p-2 absolute top-0 right-0 cursor-pointer text-white hover:text-red-600"
              onClick={handleClearUploadImage}
            >
              <IoClose size={30} />
            </div>
            <div className="bg-transparent flex flex-col">
              <img
                src={message.imageUrl}
                alt="uploadImage"
                className="w-full h-full max-w-xl object-scale-down rounded-lg shadow-lg"
              />
              <div className="flex justify-end mt-3">
                <Button onClick={handleSendImageMessage}>Send</Button>
              </div>
            </div>
          </div>
        )}

        {/**upload video display */}
        {message.videoUrl && (
          <div className="w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
            <div
              className="w-fit p-2 absolute top-0 right-0 cursor-pointer text-white hover:text-red-600"
              onClick={handleClearUploadVideo}
            >
              <IoClose size={30} />
            </div>
            <div className="bg-transparent flex flex-col">
              <video
                src={message.videoUrl}
                className="w-full h-full max-w-xl object-scale-down rounded-lg shadow-lg"
                controls
                muted
                autoPlay
              />
              <div className="flex justify-end mt-3">
                <Button onClick={handleSendVideoMessage}>Send</Button>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="w-full h-full flex sticky bottom-0 justify-center items-center">
            <Loading />
          </div>
        )}
      </section>

      {/**send message */}
      {message.imageUrl == "" && message.videoUrl == "" ? (
        <section className="h-16 bg-white flex items-center px-4">
          {/**video and image */}
          <Popover>
            <PopoverTrigger className="flex justify-center items-center w-10 h-10 rounded-full hover:bg-primary hover:text-white">
              <FaPlus size={16} />
            </PopoverTrigger>
            <PopoverContent className="bg-white shadow rounded bottom-14 w-36 p-2 ml-24">
              <form>
                <label
                  htmlFor="uploadImage"
                  className="flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer"
                >
                  <div className="text-primary">
                    <FaImage size={18} />
                  </div>
                  <p>Image</p>
                </label>
                <label
                  htmlFor="uploadVideo"
                  className="flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer"
                >
                  <div className="text-purple-500">
                    <FaVideo size={18} />
                  </div>
                  <p>Video</p>
                </label>

                <input
                  type="file"
                  id="uploadImage"
                  onChange={handleUploadImage}
                  className="hidden"
                />

                <input
                  type="file"
                  id="uploadVideo"
                  onChange={handleUploadVideo}
                  className="hidden"
                />
              </form>
            </PopoverContent>
          </Popover>

          {/**input box */}
          <form
            className="h-full w-full flex gap-2"
            onSubmit={handleSendMessage}
          >
            <input
              type="text"
              placeholder="Type here message..."
              className="py-1 px-4 outline-none w-full h-full"
              value={message.text}
              onChange={handleOnChange}
            />
            <button className="text-primary hover:text-secondary">
              <IoMdSend size={28} />
            </button>
          </form>
        </section>
      ) : (
        <></>
      )}
    </div>
  );
};

export default MessagePage;
