import { createContext } from "react";

//UserContext is used to offer global variables to all the pages
//so that every page has information on who the current user is
//and what group they belong to (if any). 
export const UserContext = createContext({
    globalUserName:'',
    globalGroupName:'',
    globalGroupKey:'',
    
    //False if user is not an admin in their current group
    //True if they are an admin
    globalAdminStatus:false,
    changeGlobalUserState: () => {}});
