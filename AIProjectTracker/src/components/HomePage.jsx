
import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import { createTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import DescriptionIcon from '@mui/icons-material/Description';
import { useEffect, useMemo, useState } from "react";
import { AvatarGenerator } from 'random-avatar-generator';
// import Avatar from 'react-avatar';
// import { useDispatch, useSelector } from "react-redux";
// import { login, logout } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { FaQuestionCircle } from 'react-icons/fa';
import {    Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,Checkbox } from "@mui/material";

import { ToastContainer, toast } from 'react-toastify';
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "../feature/userSlice";
import {
  Account,
  AccountPreview,
  AccountPopoverFooter,
  SignOutButton,
} from "@toolpad/core/Account";


const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function DemoPageContent({ pathname}) {
 
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
   const [openDialog, setOpenDialog] = useState(false);  // State for dialog
  const [selectedDescription, setSelectedDescription] = useState(""); 

  const fetchProjectDetails = async (path) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/ai/get${path}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log("Project Details:", response.data);
      
      // Ensure the response is an array
      if (Array.isArray(response.data)) {
        setTasks(response.data);
      } else {
        setTasks([response.data]); // Convert object to array if needed
      }
    } catch (err) {
      console.error("Error fetching project details:", err);
      setError("Error loading project details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pathname && pathname !== "/dashboard") {
      fetchProjectDetails(pathname);
    }
  }, [pathname]);
  const handleCheckboxChange = async (taskId, completed) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.taskId === taskId ? { ...task, completed } : task
      )
    );
    try {
      await axios.put(`http://localhost:8080/api/ai/update/${taskId}`, { completed }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
    } catch (error) {
      console.error("Error updating task:", error);
      // Revert state on error
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.taskId === taskId ? { ...task, completed: !checked } : task
        )
      );
    }   
  }
  // function giveRespone(description){
    const giveResponse = async (description) => {
    // console.log("Clicked" + description);
    // toast( description);
    // // console.log(e);
    //  setSelectedDescription(description);
    // setOpenDialog(true);
    try {
      const response = await axios.post("http://localhost:8080/api/ai/hint", 
        { prompt: description }, 
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
  
      // Ensure response contains data
      if (response.data) {
        setSelectedDescription(response.data);  // Set the AI-generated hint
      } else {
        setSelectedDescription("No hint available.");
      }
    } catch (error) {
      console.error("Error fetching hint:", error);
      setSelectedDescription("Error fetching hint.");
    }
  
    setOpenDialog(true); // Open the dialog after fetching hint

  }
   const handleDialogClose = () => {
    setOpenDialog(false);  // Close the dialog
  };

  // const [count , setCount] = useState(0);

  return (
    <Box sx={{ py: 4, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", width: "100%" }}>
      <Typography variant="h6">Project Details</Typography>

      {(
        <TableContainer component={Paper} sx={{ maxWidth: 1000, mt: 2,  }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell ><strong >Task ID</strong></TableCell>
                <TableCell><strong>Description</strong></TableCell>
                <TableCell><strong>Completed</strong></TableCell>
                <TableCell><strong>Hint</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((task,count) => (
                // setCount(count + 1),
                // <TableRow key={task.taskId}>
                <TableRow key={count}>
                  <TableCell>{count+1}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell><Checkbox
                    checked={task.completed}
                    onChange={(e) => handleCheckboxChange(task.taskId, e.target.checked)}
                  /></TableCell>
                  {/* <TableCell>{task.completed ? "Yes" : "No"}</TableCell> */}
                  {/* <Tablecell>Hint</Tablecell> */}
                  {/* <TableCell>{task.createdAt}</TableCell> */}
                  <tableCell sx={{ textAlign: "center" }}><button  
                  
                  size="small" onClick={() => giveResponse(task.description)}>
          <FaQuestionCircle />
        
        
      </button></tableCell>
                  
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
       <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Hint</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>
            {selectedDescription}
          </DialogContentText> */}
          <div dangerouslySetInnerHTML={{ __html: selectedDescription }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function AccountSidebarPreview(props) {
  const { handleClick, open, mini } = props;
  return (
    <Stack direction="column" p={0}>
      <Divider />
      <AccountPreview
        variant={mini ? 'condensed' : 'expanded'}
        handleClick={handleClick}
        open={open}
      />
    </Stack>
  );
}
AccountSidebarPreview.propTypes = {
  /**
   * The handler used when the preview is expanded
   */
  handleClick: PropTypes.func,
  mini: PropTypes.bool.isRequired,
  /**
   * The state of the Account popover
   * @default false
   */
  open: PropTypes.bool,
};
// const generator = new AvatarGenerator();
// const image = generator.generateRandomAvatar();
const image = localStorage.getItem("avatar")
const accounts = [
  {
    id: 1,
    name: 'Prehans Gupta',
    email: localStorage.getItem("username"),
    image : image,
    projects: [
      {
        id: 3,
        title: 'Project X',
      },
    ],
  }

];

function SidebarFooterAccountPopover() {
  return (
    <Stack direction="column">
      <Typography variant="body2" mx={2} mt={1}>
        Account
      </Typography>
      <MenuList>
        {accounts.map((account) => (
          <MenuItem
            key={account.id}
            component="button"
            sx={{
              justifyContent: 'flex-start',
              width: '100%',
              columnGap: 2,
            }}
          >
            <ListItemIcon>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  fontSize: '0.95rem',
                  bgcolor: account.color,
                }}
                src={account.image ?? ''}
                alt={account.name ?? ''}
              >
                {account.name[0]}
              </Avatar>
            </ListItemIcon>
            <ListItemText
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                width: '100%',
              }}
              primary={account.name}
              secondary={account.email}
              primaryTypographyProps={{ variant: 'body2' }}
              secondaryTypographyProps={{ variant: 'caption' }}
            />
          </MenuItem>
        ))}
      </MenuList>
      <Divider />
      <AccountPopoverFooter>
        <SignOutButton />
      </AccountPopoverFooter>
    </Stack>
  );
}

const createPreviewComponent = (mini) => {
  function PreviewComponent(props) {
    return <AccountSidebarPreview {...props} mini={mini} />;
  }
  return PreviewComponent;
};
function SidebarFooterAccount({ mini }) {
  const PreviewComponent = React.useMemo(() => createPreviewComponent(mini), [mini]);
  return (
    <Account
      slots={{
        preview: PreviewComponent,
        popoverContent: SidebarFooterAccountPopover,
      }}
      slotProps={{
        popover: {
          transformOrigin: { horizontal: 'left', vertical: 'bottom' },
          anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
          disableAutoFocus: true,
          slotProps: {
            paper: {
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: (theme) =>
                  `drop-shadow(0px 2px 8px ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.32)'})`,
                mt: 1,
                '&::before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  bottom: 10,
                  left: 0,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translate(-50%, -50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            },
          },
        },
      }}
    />
  );
}


SidebarFooterAccount.propTypes = {
  mini: PropTypes.bool.isRequired,
};

const demoSession = {
  user: {
    name: "Prehans Gupta",
    email: localStorage.getItem("username"),
    image : image,
  },
};

function DashboardLayoutAccountSidebar(props) {
  const { window } = props;
  const [pathname, setPathname] = useState("/dashboard");
  // const [navigation, setNavigation] = useState(DEFAULT_NAVIGATION);
  const [navigation, setNavigation] = useState();
  const [projectID, setProjectID] = useState(null);
const [projectDetails, setProjectDetails] = useState(null);
const navigate = useNavigate();
// const didFetchProjects = useRef(false);
  useEffect(() => {
    // if (didFetchProjects.current) return;  // 👈 Prevent multiple calls
  // didFetchProjects.current = true;
    const fetchProjects = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/ai/get/projects", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        console.log("Response Data:", response.data);
        console.log("Pathname:", pathname);

        const projectItems = response.data.map((project) => ({


          //  useEffect(() => {})
           
          segment: `${project.projectId}`,
          title: project.projectName,
          icon: <DescriptionIcon />,
          //  setProjectID(project.projectID);
          // onClick: () => handleProjectClick(project.projectId),
        }));

        // setNavigation([...DEFAULT_NAVIGATION, ...projectItems]);
        setNavigation([ ...projectItems]);

        // Set default selected project to the first item, if none selected yet
        if (response.data && response.data.length > 0 && (pathname === "/dashboard" || !pathname)) {
          const firstProjectId = response.data[0].projectId;
          // Ensure leading slash so DemoPageContent builds correct URL: /get/ID
          setPathname(`/${firstProjectId}`);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);


  const handleProjectClick = async (id) => {
    // setProjectID(id); // Store selected project ID
  
    try {
      const response = await axios.get(`http://localhost:8080/api/ai/get/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      setProjectDetails(response.data); // Store project details
      console.log("Project Details:", response.data);
    } catch (error) {
      console.error("Error fetching project details:", error);
    }
  };

  const router = useMemo(
    () => ({
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname((path)),
    }),
    [pathname]
  );

  const demoWindow = window !== undefined ? window() : undefined;

  const [session, setSession] = useState(demoSession);
  const dispatch = useDispatch();
  
  const authentication = useMemo(
    () => ({
      signIn: () => setSession(demoSession),
      signOut: () => {
        setSession(null);
        dispatch(logout());
        navigate("/");
      },
    }),
    [dispatch]
  );
  

  return (
    <AppProvider
      navigation={navigation}
      router={router}
      theme={demoTheme}
      window={demoWindow}
      authentication={authentication}
      session={session}
    >
      <DashboardLayout
        slots={{ toolbarAccount: () => null, sidebarFooter: SidebarFooterAccount }}
      >
        <DemoPageContent pathname={pathname} handleProjectClick={pathname} />
      </DashboardLayout>
    </AppProvider>
  );
}

DashboardLayoutAccountSidebar.propTypes = {
  window: PropTypes.func,
};

export default DashboardLayoutAccountSidebar;
