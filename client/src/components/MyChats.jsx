import React, { useState, useEffect } from "react";
import { ChatState } from "../context/ChatProvider";
import { toast } from "react-toastify";
import axios from "axios";
import { Box, Text, Button, Stack, Avatar, Divider } from "@chakra-ui/react";
import { IoMdAdd, IoMdPeople } from "react-icons/io";
import Loader from "./Loader";
import { getSender } from "../config/ChatLogics";
import GroupChatModal from "./GroupChatModal";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats ,score,setScore,URL} = ChatState();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`${URL}/api/chats`, config);
      setChats(data);

      const { data: data2 } = await axios.get(`${URL}/api/analyze`, config)
      console.log(data2)  
      setScore(data2)
    } catch (err) {
      toast.error(err);
    }
  };
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("sebUser")));
    fetchChats();
  }, [fetchAgain]);

  if (!loggedUser) {
    return <Loader />;
  }
  return (
    <Box
      d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p="3"
      h="90vh"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      bg={"rgba(255, 255, 255, 0.885)"}
    >
      <Box
        pb="3"
        px="3"
        fontSize={{ base: "1.25rem", md: "1.4rem" }}
        d="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text>My Chats  {<Text color={score >=50 ?"red":"green"} >{score}</Text>}</Text>
        {/* <Text color={score.mental_activity >=8 ?"red":"green"} >{score.mental_activity}</Text> */}
        {/* <GroupChatModal> */}
          {/* <Button
            d="flex"
            fontSize={{ base: "1rem", md: "0.9rem", lg: "1rem" }}
            color="#fff"
            rightIcon={
              <div style={{ color: "#fff" }}>
                <IoMdAdd />
              </div>
            }
            zIndex="0"
            colorScheme={"blackAlpha"}
            bg={"#352E7B"}
          >
            Create Group
          </Button> */}
        {/* </GroupChatModal> */}
                  <a href="http://localhost:8000/">Tranquil Talk</a>

      </Box>
      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#f8f8f8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat, index) => (
              <div key={index}>
                <Box
                  onClick={() => setSelectedChat(chat)}
                  cursor="pointer"
                  bg={selectedChat === chat ? "#352E7B" : "e8e8e8"}
                  color={selectedChat === chat ? "#fff" : "#000"}
                  px="3"
                  py="2"
                  borderRadius="lg"
                  transition="200ms ease-in-out"
                  d="flex"
                >
                  <Avatar
                    size="sm"
                    cursor="pointer"
                    bg={chat.isGroupChat ? "#1d1931" : null}
                    icon={
                      chat.isGroupChat && (
                        <IoMdPeople fontSize="1.5rem" color="#fff" />
                      )
                    }
                    src={
                      !chat.isGroupChat &&
                      getSender(loggedUser.user, chat.users)?.image
                    }
                    name={
                      !chat.isGroupChat &&
                      getSender(loggedUser.user, chat.users).name
                    }
                    mr="4"
                  />
                  <Text fontSize="1.25rem">
                    {!chat.isGroupChat
                      ? getSender(loggedUser?.user, chat?.users)?.name
                      : chat.chatName}
                  </Text>
                </Box>
                <Divider />
              </div>
            ))}
            
          </Stack>
        ) : (
          <Loader />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
