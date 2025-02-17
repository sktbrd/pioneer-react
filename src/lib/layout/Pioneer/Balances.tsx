import { Search2Icon } from "@chakra-ui/icons";
import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  HStack,
  Stack,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  InputGroup,
  InputLeftElement,
  Input,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";

//@ts-ignore
import KEEPKEY_ICON from "lib/assets/png/keepkey.png";
//@ts-ignore
import METAMASK_ICON from "lib/assets/png/metamask.png";
//@ts-ignore
import PIONEER_ICON from "lib/assets/png/pioneer.png";
import { usePioneer } from "lib/context/Pioneer";

import Receive from "./Receive";
import Send from "./Send";
import View from "./View";

// Import icons
// @ts-ignore
// @ts-ignore
// @ts-ignore

interface Balance {
  image?: string;
  symbol: string;
  name?: string;
  balance?: any;
  size?: string;
  context?: string; // Added context field
}

const getWalletType = (user: { walletDescriptions: any[] }, context: any) => {
  if (user && user.walletDescriptions) {
    const wallet = user.walletDescriptions.find((w) => w.id === context);
    return wallet ? wallet.type : null;
  }
  return null;
};

const getWalletBadgeContent = (walletType: string) => {
  const icons: any = {
    metamask: METAMASK_ICON,
    keepkey: KEEPKEY_ICON,
    native: PIONEER_ICON,
  };

  const icon = icons[walletType];

  if (!icon) {
    return null;
  }

  return (
    <AvatarBadge boxSize="1.25em" bg="green.500">
      <Image rounded="full" src={icon} />
    </AvatarBadge>
  );
};

export default function Balances({ balances }: { balances: Balance[] }) {
  const { state, dispatch } = usePioneer();
  const { user } = state;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBalance, setSelectedBalance] = useState<Balance | null>(null);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchQuery, setSearchQuery] = useState("");
  const balancesPerPage = 3;

  const handlePageChange = (pageNumber: any) => {
    setCurrentPage(pageNumber);
  };

  const handleSendClick = (balance: Balance) => {
    setSelectedBalance(balance);
    setSelectedAction("send");
    onOpen();
  };

  const handleReceiveClick = (balance: Balance) => {
    setSelectedBalance(balance);
    setSelectedAction("receive");
    onOpen();
  };

  const handleViewClick = (balance: Balance) => {
    setSelectedBalance(balance);
    setSelectedAction("view");
    onOpen();
  };

  useEffect(() => {
    const setUser = async () => {
      try {
        if (user && user.wallets) {
          const { walletDescriptions, balances } = user;
          // console.log("walletDescriptions: ", walletDescriptions);
          const updatedBalances = balances.map((balance: Balance) => {
            const walletType = getWalletType(user, balance.context);
            const badgeContent = getWalletBadgeContent(walletType);
            // @ts-ignore
            return {
              ...balance,
              context: {
                // @ts-ignore
                ...balance.context,
                badge: badgeContent,
              },
            };
          });
          dispatch({ type: "SET_BALANCES", payload: updatedBalances });
        }
      } catch (e) {
        console.error("Error: ", e);
      }
    };

    setUser();
  }, [user]);

  // Filter and sort balances based on search query
  const filteredBalances = balances.filter((balance: Balance) => {
    // Convert the search query and balance symbol/name to lowercase for case-insensitive search
    const query = searchQuery.toLowerCase();
    const symbol = balance.symbol.toLowerCase();
    const name = balance.name ? balance.name.toLowerCase() : "";

    // Check if the symbol or name contains the search query
    return symbol.includes(query) || name.includes(query);
  });

  const sortedBalances = filteredBalances.sort(
    (a: Balance, b: Balance) => b.balance - a.balance
  );
  const currentBalances = sortedBalances.slice(
    (currentPage - 1) * balancesPerPage,
    currentPage * balancesPerPage
  );
  const totalPages = Math.ceil(filteredBalances.length / balancesPerPage);

  // Function to generate custom pagination array
  const generatePaginationArray = () => {
    const paginationArray = [];
    const totalPageButtons = 5; // Number of page buttons to display around the current page

    if (totalPages <= totalPageButtons) {
      // If total pages are less than or equal to totalPageButtons, show all page numbers
      for (let i = 1; i <= totalPages; i++) {
        paginationArray.push(i);
      }
    } else {
      // If total pages are more than totalPageButtons, generate custom pagination
      const middleButton = Math.floor(totalPageButtons / 2);
      const startPage = Math.max(currentPage - middleButton, 1);
      const endPage = Math.min(currentPage + middleButton, totalPages);

      if (startPage > 1) {
        // Add the first page and ellipsis if the current page is far enough from the first page
        paginationArray.push(1, "...");
      }

      // Add page numbers between startPage and endPage (inclusive)
      for (let i = startPage; i <= endPage; i++) {
        paginationArray.push(i);
      }

      if (endPage < totalPages) {
        // Add the last page and ellipsis if the current page is far enough from the last page
        paginationArray.push("...", totalPages);
      }
    }

    return paginationArray;
  };

  return (
    <Stack spacing={4}>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <Search2Icon color="gray.300" />
        </InputLeftElement>
        <Input
          placeholder="Bitcoin..."
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </InputGroup>
      {currentBalances.map((balance: Balance, index: number) => (
        <Box key={index}>
          <HStack spacing={4} alignItems="center">
            <Avatar src={balance.image} />
            <Box>
              <small>asset: {balance.symbol}</small>
              <br />
              <small>balance: {balance.balance}</small>
            </Box>
          </HStack>
          <HStack mt={2} spacing={2}>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleSendClick(balance)}
            >
              Send
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleReceiveClick(balance)}
            >
              Receive
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleViewClick(balance)}
            >
              View
            </Button>
          </HStack>
        </Box>
      ))}
      <Box mt={4}>
        {generatePaginationArray().map((page, index) => (
          <Button
            key={index}
            size="sm"
            variant={currentPage === page ? "solid" : "outline"}
            onClick={() => handlePageChange(page)}
          >
            {page === "..." ? "..." : page}
          </Button>
        ))}
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} isCentered blockScrollOnMount>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedAction}</ModalHeader>
          <ModalCloseButton />
          {selectedAction === "send" && (
            <div>
              <h3>Selected Action: Send</h3>
              <p>Selected Asset: {selectedBalance?.symbol}</p>
              <Send asset={selectedBalance} />
            </div>
          )}
          {selectedAction === "receive" && (
            <div>
              <h3>Selected Action: Receive</h3>
              <p>Selected Asset: {selectedBalance?.symbol}</p>
              <Receive />
            </div>
          )}
          {selectedAction === "view" && (
            <div>
              <h3>Selected Action: View</h3>
              <p>Selected Asset: {selectedBalance?.symbol}</p>
              <View />
            </div>
          )}
          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  );
}
