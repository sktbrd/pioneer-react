import { CloseIcon, ArrowUpDownIcon } from "@chakra-ui/icons";
import {
  chakra,
  Stack,
  CircularProgress,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Avatar,
  AvatarBadge,
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Link,
  Menu,
  Image,
  MenuButton,
  MenuDivider,
  Icon,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  useDisclosure,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  SimpleGrid,
  Card,
  CardHeader,
  Heading,
  CardBody,
  CardFooter,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import type { SetStateAction } from "react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// pubkeys

import { KeepKeyIcon } from "lib/assets/Icons/KeepKeyIcon";
import { KeplrIcon } from "lib/assets/Icons/KeplrIcon";
import { MetaMaskIcon } from "lib/assets/Icons/MetaMaskIcon";
import { TallyHoIcon } from "lib/assets/Icons/TallyHoIcon";
import { XDEFIIcon } from "lib/assets/Icons/XDEFIIcon";

// import type { ReactNode } from "react";
// import { KeepKeySdk } from "@keepkey/keepkey-sdk";
// @ts-ignore
import KEEPKEY_ICON from "lib/assets/png/keepkey.png";
// @ts-ignore
import METAMASK_ICON from "lib/assets/png/metamask.png";
// @ts-ignore
import PIONEER_ICON from "lib/assets/png/pioneer.png";
// import Context from "lib/context";
import { usePioneer } from "lib/context/Pioneer";

import Balances from "./Pioneer/Balances";
import MiddleEllipsis from "./Pioneer/MiddleEllipsis";
import Pubkey from "./Pioneer/Pubkey";
import Wallets from "./Pioneer/Wallets";

const PROJECT_NAME = "*Your Project Name HERE*";

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
    return <div />;
  }

  return (
    <AvatarBadge boxSize="1.25em" bg="green.500">
      <Image rounded="full" src={icon} />
    </AvatarBadge>
  );
};

const getWalletSettingsContent = (walletType: string) => {
  const icons: any = {
    metamask: METAMASK_ICON,
    keepkey: KEEPKEY_ICON,
    native: PIONEER_ICON,
  };

  const icon = icons[walletType];

  if (!icon) {
    return <div />;
  }

  return icon;
};

const HeaderOld = () => {
  const { state, dispatch } = usePioneer();
  const { api, app, user, context, wallets } = state;
  const [placement, setPlacement] = useState("left");
  // let api = {}
  // const { isOpen, onOpen, onClose } = useDisclosure();
  const navigationDisclosure = useDisclosure();
  const walletDisclosure = useDisclosure();
  // const [pioneerConnected, setPioneerConnected] = useState(false);

  // const [user, setUser] = useState({
  //   username: undefined,
  //   context: undefined,
  //   totalValueUsd: undefined,
  // });
  const [copySuccess, setCopySuccess] = useState(false);
  const [walletType, setWalletType] = useState("");
  const [walletDescriptions, setWalletDescriptions] = useState([]);
  const [walletsAvailable, setWalletsAvailable] = useState([]);
  const [metamaskPaired, setMetamaskPaired] = useState(false);
  const [keepkeyPaired, setKeepkeyPaired] = useState(false);
  const [nativePaired, setNativePaired] = useState(false);
  const [pioneerImage, setPioneerImage] = useState("");
  const [walletSettingsContext, setWalletSettingsContext] = useState("");
  const [assetContext, setAssetContext] = useState("");
  const [assetContextImage, setAssetContextImage] = useState("");
  const [blockchainContext, setBlockchainContext] = useState("");
  const [blockchainContextImage, setBlockchainContextImage] = useState("");
  const [isSynced, setIsSynced] = useState(false);
  const [isPioneer, setIsPioneer] = useState(false);
  const [isFox, setIsFox] = useState(false);
  const [pubkeys, setPubkeys] = useState([]);
  const [balances, setBalances] = useState([]);
  // const [features, setKeepKeyFeatures] = useState({});
  // pubkeys
  const [pubkeysCurrentPage, setPubkeysCurrentPage] = useState(1);
  const [pubkeysItemsPerPage] = useState(2); // Number of pubkeys items to display per page
  const indexOfLastPubkey = pubkeysCurrentPage * pubkeysItemsPerPage;
  const indexOfFirstPubkey = indexOfLastPubkey - pubkeysItemsPerPage;
  const currentPubkeys = pubkeys.slice(indexOfFirstPubkey, indexOfLastPubkey);

  const navigate = useNavigate();
  const handleToHome = () => navigate("/");

  const pubkeysTotalPages = Math.ceil(pubkeys.length / pubkeysItemsPerPage);
  const pubkeysPageNumbers = [];
  for (let i = 1; i <= pubkeysTotalPages; i++) {
    pubkeysPageNumbers.push(i);
  }

  const handlePubkeysPageClick = (pageNumber: SetStateAction<number>) => {
    setPubkeysCurrentPage(pageNumber);
  };

  const setContextWallet = async function (wallet: string) {
    try {
      // eslint-disable-next-line no-console
      // console.log("wallets: ", wallets);
      const matchedWallet = wallets.find(
        (w: { type: string }) => w.type === wallet
      );

      if (matchedWallet) {
        dispatch({ type: "SET_WALLET", payload: matchedWallet });
        dispatch({ type: "SET_CONTEXT", payload: wallet });
      } else {
        // console.log("No wallet matched the type of the context");
        // launch modal
        walletDisclosure.onOpen();
        setWalletSettingsContext(wallet);
      }
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line no-console
      console.error("header e: ", e);
      // setKeepKeyError("Bridge is offline!");
    }
  };

  const setContextBlockchain = async function (blockchain: string) {
    try {
      // eslint-disable-next-line no-console
      // console.log("setContextBlockchain: ", blockchain);
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line no-console
      console.error("header e: ", e);
      // setKeepKeyError("Bridge is offline!");
    }
  };

  const setContextAsset = async function (asset: string) {
    try {
      // eslint-disable-next-line no-console
      // console.log("setContextAsset: ", asset);
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line no-console
      console.error("header e: ", e);
      // setKeepKeyError("Bridge is offline!");
    }
  };

  const onStart = async function () {
    try {
      // if(!wallet)
      //   await connect();
      // set color mode dark
      localStorage.setItem("chakra-ui-color-mode", "dark");
      // eslint-disable-next-line no-console
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line no-console
      console.error("header e: ", e);
      // setKeepKeyError("Bridge is offline!");
    }
  };

  useEffect(() => {
    onStart();
  }, [state, state.api]); // once on startup

  const setUser = async function () {
    try {
      if (user && user.wallets) {
        const { wallets, walletDescriptions, balances, pubkeys } = user;
        // eslint-disable-next-line no-console
        // console.log("wallets: ", wallets);

        if (user.isPioneer) {
          setIsPioneer(true);
          setPioneerImage(user.pioneerImage);
        }

        for (let i = 0; i < walletDescriptions.length; i++) {
          const wallet = walletDescriptions[i];
          if (wallet.type === "keepkey") {
            wallet.icon = KeepKeyIcon;
          }
          if (wallet.type === "metamask") {
            setMetamaskPaired(true);
          }
          if (wallet.type === "keepkey") {
            setKeepkeyPaired(true);
          }
          if (wallet.type === "native") {
            setNativePaired(true);
          }
          wallet.paired = true;
          walletDescriptions[i] = wallet;
        }
        // eslint-disable-next-line no-console
        // console.log("walletDescriptions: ", walletDescriptions);
        // setWalletsAvailable(walletsAvailable);
        setWalletDescriptions(walletDescriptions);
        // setBalances(balances);
        // eslint-disable-next-line no-console
        // console.log("walletsAvailable: ", walletsAvailable);

        // eslint-disable-next-line no-console
        // console.log('balances: ', balances);
        if (balances) {
          setBalances(balances);
        }

        // eslint-disable-next-line no-console
        // console.log("pubkeys: ", pubkeys);
        const newPubkeys: any = [];
        console.log("walletDescriptions: ", user.walletDescriptions);
        for (let i = 0; i < pubkeys.length; i++) {
          const pubkey = pubkeys[i];
          const { context } = pubkey;
          // console.log("context: ", context);
          const walletType = walletDescriptions.filter(
            (wallet: { context: any }) => wallet.context === context
          )[0]?.type;
          // console.log("walletType: ", walletType);
          const icons: any = {
            metamask: METAMASK_ICON,
            keepkey: KEEPKEY_ICON,
            native: PIONEER_ICON,
          };
          // @ts-ignore
          const walletImage = icons[walletType];
          // console.log("walletImage: ", walletImage);
          pubkey.walletImage = walletImage;
          newPubkeys.push(pubkey);
        }
        // const updatedPubkeys = user.pubkeys.map((pubkey: { context: any; }) => ({
        //   ...pubkey,
        //   walletImage: getWalletBadgeContent(getWalletType(user, pubkey.context)),
        // }));

        setPubkeys(newPubkeys);

        // @ts-ignore
        window.ethereum.on("accountsChanged", async function (accounts: any) {
          // Time to reload your interface with accounts[0]!
          // console.log('accountsChanged: ', accounts);
          // TODO register new pubkeys
          const walletsPaired = app.wallets;
          console.log("walletsPaired: ", walletsPaired);
          for (let i = 0; i < accounts.length; i++) {
            const account = accounts[i];
            console.log("account: ", account);
            // TODO check if account is already registered
            const wallet = {
              _isMetaMask: true,
              ethAddress: account,
            };
            app.pairWallet(wallet);
            const context = await app.setContext(wallet);
            if (i !== 0) {
              await app.disconnectWallet(context);
            }
          }
        });
      }
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line no-console
      console.error("header e: ", e);
      // setKeepKeyError("Bridge is offline!");
    }
  };

  useEffect(() => {
    setUser();
  }, [user]); // once on startup

  const handleNavigate = (route: string) => {
    navigate(route);
    navigationDisclosure.onClose();
  };

  useEffect(() => {
    if (context) {
      // console.log("header context: ", context);
      setWalletType(context);
    }
  }, [context]);

  useEffect(() => {
    if (wallets) {
      setMetamaskPaired(
        !!wallets.find((w: { type: string }) => w.type === "metamask")
      );
      setKeepkeyPaired(
        !!wallets.find((w: { type: string }) => w.type === "keepkey")
      );
      setNativePaired(
        !!wallets.find((w: { type: string }) => w.type === "native")
      );
    }
  }, [wallets]);

  const avatarContent = api ? (
    getWalletBadgeContent(walletType)
  ) : (
    <AvatarBadge boxSize="1em" bg="red.500">
      <CircularProgress isIndeterminate size="1em" color="white" />
    </AvatarBadge>
  );

  const toggleDrawer = () => {
    if (navigationDisclosure.isOpen) {
      navigationDisclosure.onClose();
    } else {
      navigationDisclosure.onOpen();
    }
  };

  const handleCardClick = async function (pubkey: string) {
    try {
      // console.log(pubkey);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyClick = async (event: any, address: string) => {
    event.stopPropagation(); // Prevent the card from being clicked

    try {
      await navigator.clipboard.writeText(address);
      setCopySuccess(true);
    } catch (error) {
      console.error("Failed to copy:", error);
      setCopySuccess(false);
    }
  };

  useEffect(() => {
    let timeout: string | number | NodeJS.Timeout | undefined;
    if (copySuccess) {
      timeout = setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
    }
    return () => clearTimeout(timeout);
  }, [copySuccess]);

  const renderPubkeysPagination = pubkeysPageNumbers.map((pageNumber) => (
    <Button
      key={pageNumber}
      onClick={() => handlePubkeysPageClick(pageNumber)}
      colorScheme={pageNumber === pubkeysCurrentPage ? "teal" : "gray"}
      variant="outline"
      size="sm"
      mx="1"
    >
      {pageNumber}
    </Button>
  ));

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return (
    <Flex
      as="header"
      width="full"
      alignSelf="flex-start"
      gridGap={2}
      alignItems="center"
    >
      <Modal
        isOpen={walletDisclosure.isOpen}
        onClose={walletDisclosure.onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Wallet Settings</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            {walletSettingsContext && (
              <>
                <Avatar
                  size="xl"
                  src={getWalletSettingsContent(walletSettingsContext)}
                />
                <Box mt={4}>
                  {walletSettingsContext === "keepkey" && (
                    <>
                      <Text>Status: Offline</Text>
                      <Button
                        colorScheme="green"
                        size="lg"
                        mb={2}
                        onClick={() =>
                          window.location.assign("keepkey://launch")
                        }
                      >
                        Launch App
                      </Button>
                      <br />
                      <Button
                        as={Link}
                        href="https://keepkey.com/get-started"
                        colorScheme="blue"
                        size="lg"
                        mt={2}
                      >
                        Go Get Started
                      </Button>
                    </>
                  )}
                </Box>
              </>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={walletDisclosure.onClose}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Drawer
        placement="left"
        onClose={navigationDisclosure.onClose}
        isOpen={navigationDisclosure.isOpen}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">
            Navigation Options
          </DrawerHeader>
          <DrawerBody>
            <Button w="full" mb={2} onClick={() => handleNavigate("/dapps")}>
              Explore Dapps
            </Button>
            <Button
              w="full"
              mb={2}
              onClick={() => handleNavigate("/blockchains")}
            >
              Explore Blockchains
            </Button>
            <Button w="full" mb={2} onClick={() => handleNavigate("/assets")}>
              Explore Assets
            </Button>
            <Button w="full" mb={2} onClick={() => handleNavigate("/nodes")}>
              Explore Nodes
            </Button>
            <Button w="full" mb={2} onClick={() => handleNavigate("/pioneers")}>
              Pioneer Leaderboard
            </Button>
            <Button w="full" mb={2} onClick={() => handleNavigate("/chart")}>
              Chart Discovery
            </Button>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <IconButton
        size="md"
        icon={navigationDisclosure.isOpen ? <CloseIcon /> : <ArrowUpDownIcon />}
        aria-label={navigationDisclosure.isOpen ? "Close Menu" : "Open Menu"}
        onClick={toggleDrawer}
      />
      <HStack spacing={8}>
        <Link onClick={handleToHome}>
          <Box>{PROJECT_NAME}</Box>
        </Link>
      </HStack>
      <Spacer />
      <Menu>
        <MenuButton
          as={Button}
          rounded="full"
          variant="link"
          cursor="pointer"
          minW={200}
        >
          {isPioneer ? (
            <Avatar size="lg" src={pioneerImage}>
              {avatarContent}
            </Avatar>
          ) : (
            <Avatar size="lg" src={PIONEER_ICON}>
              {avatarContent}
            </Avatar>
          )}
        </MenuButton>
        <MenuList>
          <MenuItem>
            <SimpleGrid columns={3} row={1}>
              <Card align="center" onClick={() => setContextWallet("native")}>
                <CardBody>
                  <Avatar src={PIONEER_ICON}>
                    {nativePaired ? (
                      <div>
                        <AvatarBadge boxSize="1.25em" bg="green.500" />
                      </div>
                    ) : (
                      <div>
                        <AvatarBadge boxSize="1.25em" bg="red.500" />
                      </div>
                    )}
                  </Avatar>
                </CardBody>
                <small>Pioneer</small>
              </Card>
              <Card align="center" onClick={() => setContextWallet("metamask")}>
                <CardBody>
                  <Avatar src={METAMASK_ICON}>
                    {metamaskPaired ? (
                      <div>
                        <AvatarBadge boxSize="1.25em" bg="green.500" />
                      </div>
                    ) : (
                      <div>
                        <AvatarBadge boxSize="1.25em" bg="red.500" />
                      </div>
                    )}
                  </Avatar>
                </CardBody>
                <small>MetaMask</small>
              </Card>
              <Card align="center" onClick={() => setContextWallet("keepkey")}>
                <CardBody>
                  <Avatar src={KEEPKEY_ICON}>
                    {keepkeyPaired ? (
                      <div>
                        <AvatarBadge boxSize="1.25em" bg="green.500" />
                      </div>
                    ) : (
                      <div>
                        <AvatarBadge boxSize="1.25em" bg="red.500" />
                      </div>
                    )}
                  </Avatar>
                </CardBody>
                <small>KeepKey</small>
              </Card>
            </SimpleGrid>
          </MenuItem>
          <Tabs>
            <TabList>
              <Tab>Dashboard</Tab>
              <Tab>Balances</Tab>
              <Tab>Pubkeys</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <Card>
                  <CardBody>
                    {/* <p>context: <MiddleEllipsis text={app?.context} /></p> */}
                    {/* <p>wallets: {walletDescriptions.length}</p> */}
                    {/* <p>isSynced: {isSynced}</p> */}
                    {/* <p>isPioneer: {isPioneer}</p> */}
                    {/* <p>isFox: {isFox}</p> */}
                    {/* <p>totalVaule: {isFox}</p> */}
                    <Wallets wallets={walletDescriptions} />
                  </CardBody>
                </Card>
              </TabPanel>
              <TabPanel>
                <Accordion defaultIndex={[0]} allowMultiple>
                  <AccordionItem>
                    <h2>
                      <AccordionButton>
                        <Box as="span" flex="1" textAlign="left">
                          Balances {balances.length}
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <Balances balances={balances} />
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </TabPanel>
              <TabPanel>
                <h2>
                  <Box as="span" flex="1" textAlign="left">
                    Pubkeys {pubkeys.length}
                  </Box>
                </h2>
                <Stack spacing="2">
                  {currentPubkeys.map((pubkey: any, index: number) => (
                    <Card
                      key={pubkey.pubkey}
                      onClick={() => handleCardClick(pubkey.pubkey)}
                      // variant="elevated"
                      // maxW="sm"
                      // borderWidth="1px"
                      // borderRadius="md"
                      // boxShadow="md"
                      // _hover={{ boxShadow: "lg" }}
                    >
                      <CardBody>
                        <Flex align="center">
                          <Avatar
                            size="sm"
                            src={pubkey.walletImage}
                            marginRight="2"
                          />
                          <Box display="block" overflowY="scroll">
                            <Box>
                              <Text>
                                {pubkey.symbol}: <br />
                                <MiddleEllipsis text={pubkey?.master} />
                              </Text>
                            </Box>
                            <Button
                              size="xs"
                              onClick={(event) =>
                                handleCopyClick(event, pubkey.master)
                              }
                              marginTop="1"
                            >
                              {copySuccess ? "Copied!" : "Copy to Clipboard"}
                            </Button>
                          </Box>
                        </Flex>
                      </CardBody>
                    </Card>
                  ))}
                </Stack>
                {renderPubkeysPagination}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </MenuList>
      </Menu>
    </Flex>
  );
};

export default HeaderOld;
