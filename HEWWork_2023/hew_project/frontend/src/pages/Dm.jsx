import React, { useEffect, useLayoutEffect, useState } from "react";
import logo1 from "../assets/logo1.png";

import { LeftIconBar } from "../components/LeftIconBar";
import { PostCard } from "../components/PostCard.jsx";
import { PostModal } from "../components/PostModal.jsx";
import { RightUserList } from "../components/RightUserList";
import Header from "../components/Header";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  Center,
  Flex,
  Show,
  Spacer,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import {
  DmChat,
  DmChatMessage,
  DmChatFooter,
  DmChatHeader,
  DmChatBody,
  DmChatHeaderAddUserModal,
} from "../components/dm/DmChat.jsx";
import {
  DmGroup,
  DmGroupHeader,
  DmGroupBody,
  DmGroupBox,
  DmGroupCreate,
} from "../components/dm/DmGroup.jsx";
import { useCookies } from "react-cookie";
import { config } from "../config.js";
import { Brand } from "../util/Theme";
import { useNavigate, useParams } from "react-router-dom";

function Dm() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const addUserModalState = useDisclosure();
  const [dmDetail, setDmDetail] = useState(null);
  const [selectDmGroup, setSelectDmGroup] = useState("");
  const [message, setMessage] = useState("");
  const [dmMessage, setDmMessage] = useState([]);
  const [cookies, setCookie, removeCookie] = useCookies(["csrftoken"]);
  const {dmGroupID} = useParams()
  const navigate = useNavigate();

  const messageHandle = (value) => {
    setMessage(value);
  };

  const getDmMessage = async () => {
    await fetch(
      `${config.apiUrl}/api/v1/dm/getDMMessage?group_id=${selectDmGroup}`,
      {
        method: "GET",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setDmMessage(data.dm_detail);
      });
  };

  const postDmMassege = async () => {
    await fetch(`${config.apiUrl}/api/v1/dm/createDM`, {
      method: "POST",
      mode: "cors",
      credentials: "include",
      body: JSON.stringify({
        content: message,
        groupID: selectDmGroup,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status == "ng") {
          return;
        }
        getDmMessage();
      });
  };

  const getDmGroup = async () => {
    await fetch(`${config.apiUrl}/api/v1/dm/getGroupDetail`, {
      method: "GET",
      mode: "cors",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setDmDetail(data.dm_detail);
      });
  };
  useEffect(() => {
    getDmGroup();
  }, []);
  useEffect(() => {
    getDmMessage();
  }, [selectDmGroup]);

  // 定期更新
  useEffect(() => {
    if (!selectDmGroup) {
      return;
    }
    const interval = setInterval(() => {
      getDmMessage();
    }, 2000);
    return () => clearInterval(interval);
  }, [selectDmGroup]);

  useEffect(() => {
    if (!isOpen) {
      getDmGroup();
    }
  }, [isOpen,addUserModalState.isOpen]);

  const dmUserFromat = (userList) => {
    const list = userList.filter((n) => n != cookies.user_id);
    let user = "";
    // ユーザーを4人まで表示

    for (let i = 0; i < list.length; i++) {
      if (i == 3) {
        user += "他";
        break;
      }
      user += list[i] + ",";
    }
    return user;
  };
  const detachDMGroup = () => {
    fetch(`${config.apiUrl}/api/v1/dm/removeDMUser`, {
      method: "POST",
      mode: "cors",
      credentials: "include",
      body: JSON.stringify({
        groupID: selectDmGroup,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status == "ng") {
          return;
        }
        getDmGroup();
        setSelectDmGroup("");
      });
  };

  // const pathSelectDmGroup = () => {
  //   dmDetail.forEach((dm) => {
  //     if (dm.group_id == dmGroupID) {
  //       setSelectDmGroup(dmGroupID);
  //     }
  //   });
  // };


  useEffect(() => {
    // dmDetailの中にdmGroupIDがあればそれを選択する

    if (!dmDetail) {
      return;
    }
    dmDetail.forEach((dm) => {
      if (dm.group_id == dmGroupID) {
        setSelectDmGroup(dmGroupID);
      }
    });
  }, [dmDetail, dmGroupID]);


  const resetDmSelect = () => {
    navigate("/dm");
    setSelectDmGroup("");
    
  }

  return (
    <>
      <Header />
      <Flex
        
        maxW={"1300px"}
        margin={"auto"}
        borderWidth={"1px"}
        borderTopRadius={"10px"}
        backgroundColor={Brand["50"]}   
      >
        {/* 左側 */}
        <LeftIconBar />
        {/* 中央 */}

        <DmChat>
          <Show above="1051px" componentType="show">
            <DmChatHeader
              dmName={
                dmDetail && selectDmGroup
                  ? dmUserFromat(
                      dmDetail?.filter((dm) => dm.group_id == selectDmGroup)[0]
                        .user_list
                    )
                  : ""
              }
              backSubmit={resetDmSelect}
              addUserClick={addUserModalState.onOpen}
              detachDMGroup={detachDMGroup}
              isDisabled={selectDmGroup == ""}
            >
              <DmChatHeaderAddUserModal
                isOpen={addUserModalState.isOpen}
                onClose={addUserModalState.onClose}
                groupId={selectDmGroup}
              />
            </DmChatHeader>
          </Show>
          <Show below="1050px">
            {selectDmGroup != "" ? (
              <DmChatHeader
                dmName={
                  dmDetail && selectDmGroup
                    ? dmUserFromat(
                        dmDetail?.filter(
                          (dm) => dm.group_id == selectDmGroup
                        )[0]?.user_list
                      )
                    : "aa"
                }
                backSubmit={resetDmSelect}
                addUserClick={addUserModalState.onOpen}
                detachDMGroup={detachDMGroup}
                isDisabled={selectDmGroup == ""}
              >
                <DmChatHeaderAddUserModal
                  isOpen={addUserModalState.isOpen}
                  onClose={addUserModalState.onClose}
                  groupId={selectDmGroup}
                />
              </DmChatHeader>
            ) : (
              <DmGroupHeader onOpen={onOpen}>
                <DmGroupCreate isOpen={isOpen} onClose={onClose} />
              </DmGroupHeader>
            )}
          </Show>
          <DmChatBody>
            {selectDmGroup == "" && (
              <>
                <Show below="1051px">
                  {dmDetail?.map((dm_detail) => {
                    return (
                      <DmGroupBox
                        key={dm_detail.group_id}
                        groupName={dmUserFromat(dm_detail.user_list)}
                        message={
                          dm_detail.last_user_id + " " + dm_detail.last_message
                        }
                        date={dm_detail.created_at}
                        onClick={(e) => {
                          navigate(`/dm/${e}`);
                        }}
                        groupId={dm_detail.group_id}
                      />
                    );
                  })}
                </Show>
                <Show above="1051px">
                  <Spacer />
                  <Center w={"100%"}>
                    <Text opacity={0.5}>DMが選択されていません</Text>
                  </Center>
                  <Spacer />
                </Show>
              </>
            )}
            {dmMessage?.length == 0 && selectDmGroup != "" && (
              <>
                <Spacer />
                <Center w={"100%"}>
                  <Text opacity={0.5}>ここにはまだ何もないようです</Text>
                </Center>
                <Spacer />
              </>
            )}

            {dmMessage?.map((message) => {
              return (
                <DmChatMessage
                  key={message.massage_id}
                  message={message.message}
                  userName={message.user_name}
                  type={message.type}
                  iconURL={`${config.blobUrl}/main/${message.user_id}/icon`}
                />
              );
            })}
          </DmChatBody>
          <DmChatFooter
            message={(value) => messageHandle(value)}
            sendMessage={postDmMassege}
            isDisabled={selectDmGroup == ""}
          />
        </DmChat>
        <Show above="1051px">
          <DmGroup>
            <DmGroupHeader onOpen={onOpen}>
              <DmGroupCreate isOpen={isOpen} onClose={onClose} />
            </DmGroupHeader>
            <DmGroupBody>
              {dmDetail?.map((dm_detail) => {
                return (
                  <DmGroupBox
                    key={dm_detail.group_id}
                    groupName={dmUserFromat(dm_detail.user_list)}
                    message={
                      dm_detail.last_user_id + " " + dm_detail.last_message
                    }
                    date={dm_detail.created_at}
                    onClick={(e) => {
                      navigate(`/dm/${e}`);
                    }}
                    groupId={dm_detail.group_id}
                  />
                );
              })}
            </DmGroupBody>
          </DmGroup>
        </Show>
      </Flex>
    </>
  );
}

export default Dm;
