import { useContext, useEffect, useState } from "react";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { FiArrowUpLeft } from "react-icons/fi";
import SearchUser from "./SearchUser";
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/authSlice";
import EditUserDetails from "./EditUserDetails";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getFriendsAndLatestMessage } from "@/services/UserService";
import { IFriendSide } from "@/types";
import { WebSocketContext } from "@/context/WebSocketContext";

const Sidebar = () => {
  const user = useSelector((state: any) => state?.auth);
  const dispatch = useDispatch();
  const { client: stompClient } = useContext(WebSocketContext);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [friendListData, setFriendListData] = useState<IFriendSide[]>(
    []
  );
  const [openSearchUser, setOpenSearchUser] = useState(false);
  const navigate = useNavigate();

  const getListFriendData = async () => {
    const response = await getFriendsAndLatestMessage(user.id);

    if (response?.data.data) {
      const usersWithoutCurrentUser = response.data.data.filter(
        (u: IFriendSide) => u.id !== user.id
      );

      setFriendListData(usersWithoutCurrentUser);
    }
  };

  useEffect(() => {
    getListFriendData();
  }, [user]);

  useEffect(() => {
    if (stompClient?.connected) {
      stompClient?.subscribe(`/topic/${user.username}`, () => {
        getListFriendData();
      });
      friendListData.forEach((friend) => {
        stompClient?.subscribe(`/topic/${friend.username}`, () => {
          getListFriendData();
        });
      });
    }
  }, [user, stompClient]);

  const handleLogout = () => {
    dispatch(logout({}));
    navigate("/sign-in");
    localStorage.clear();
  };

  return (
    <div className="w-full h-full grid grid-cols-[48px,1fr] bg-white">
      <div className="bg-slate-100 w-12 h-full rounded-tr-lg rounded-br-lg py-5 text-slate-600 flex flex-col justify-between">
        <div>
          <NavLink
            className={({ isActive }) =>
              `w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded ${
                isActive && "bg-slate-200"
              }`
            }
            title="chat"
            to={""}
          >
            <IoChatbubbleEllipses size={20} />
          </NavLink>

          <div
            title="add friend"
            onClick={() => setOpenSearchUser(true)}
            className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded"
          >
            <FaUserPlus size={20} />
          </div>
        </div>

        <div className="flex flex-col items-center">
          <button
            className="mx-auto"
            title={user?.username}
            onClick={() => setEditUserOpen(true)}
          >
            <Avatar>
              <AvatarImage
                className="w-10 h-10"
                src={user?.avatarUrl}
              />
              <AvatarFallback className="w-10 h-10">
                {(user?.username)[0]}
              </AvatarFallback>
            </Avatar>
          </button>
          <button
            title="logout"
            className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded"
            onClick={handleLogout}
          >
            <span className="-ml-2">
              <BiLogOut size={20} />
            </span>
          </button>
        </div>
      </div>

      <div className="w-full">
        <div className="h-16 flex items-center">
          <h2 className="text-xl font-bold p-4 text-slate-800">
            Message
          </h2>
        </div>
        <div className="bg-slate-200 p-[0.5px]"></div>

        <div className=" h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar">
          {friendListData.length === 0 && (
            <div className="mt-12">
              <div className="flex justify-center items-center my-4 text-slate-500">
                <FiArrowUpLeft size={50} />
              </div>
              <p className="text-lg text-center text-slate-400">
                Explore users to start a conversation with.
              </p>
            </div>
          )}

          {friendListData?.map((item, index) => {
            return (
              <NavLink
                to={"/" + item?.id}
                key={index}
                className="flex items-center gap-2 py-3 px-2 border border-transparent hover:border-primary rounded hover:bg-slate-100 cursor-pointer"
              >
                <div>
                  <Avatar>
                    <AvatarImage
                      className="w-12 h-12"
                      src={item?.avatarUrl}
                    />
                    <AvatarFallback className="w-10 h-10">
                      {(item?.username)[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <h3 className="text-ellipsis line-clamp-1 font-semibold text-base">
                    {item?.username}
                  </h3>
                  {/* // TODO: Add last seen message */}
                  {item?.lastMessage !== null && (
                    <div className="text-slate-500 text-xs flex items-center">
                      <div className="flex items-center gap-1">
                        {item?.lastMessage?.mediaType == "image" && (
                          <div className="flex items-center gap-1">
                            <span>
                              <FaImage />
                            </span>
                            {item?.lastMessage &&
                            item?.lastMessage?.senderId == user.id ? (
                              <span>You have sent an image</span>
                            ) : (
                              <span>
                                {item?.username} have sent an image
                              </span>
                            )}
                          </div>
                        )}
                        {item?.lastMessage?.mediaType == "video" && (
                          <div className="flex items-center gap-1">
                            <span>
                              <FaVideo />
                            </span>
                            {item?.lastMessage &&
                            item?.lastMessage?.senderId ==
                              user?.id ? (
                              <span>You have sent an video</span>
                            ) : (
                              <span>
                                {item?.username} have sent an video
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      {item?.lastMessage?.mediaType == "text" && (
                        <p className="text-ellipsis line-clamp-1 font-semibold">
                          {item?.lastMessage &&
                          item?.lastMessage?.senderId == user?.id
                            ? item.lastMessage.content.length > 30
                              ? `You: ${item?.lastMessage?.content.substring(
                                  0,
                                  30
                                )}...`
                              : item.lastMessage.content.length > 30
                              ? `You: ${item?.lastMessage?.content.substring(
                                  0,
                                  30
                                )}...`
                              : `${item?.username}: ${item?.lastMessage?.content}`
                            : `${item?.username}: ${item?.lastMessage?.content}`}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                {/* TODO: Add number off unseen message */}
                {/* {Boolean(user?.unseenMsg) && (
                  <p className="text-xs w-6 h-6 flex justify-center items-center ml-auto p-1 bg-primary text-white font-semibold rounded-full">
                    {user?.unseenMsg}
                  </p>
                )} */}
                <p className="text-xs w-6 h-6 flex justify-center items-center ml-auto p-1 bg-primary text-white font-semibold rounded-full">
                  0
                </p>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/**edit user details*/}
      {editUserOpen && (
        <EditUserDetails
          onClose={() => setEditUserOpen(false)}
          user={user}
        />
      )}

      {/**search user */}
      {openSearchUser && (
        <SearchUser onClose={() => setOpenSearchUser(false)} />
      )}
    </div>
  );
};

export default Sidebar;