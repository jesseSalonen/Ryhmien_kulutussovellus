import React from "react";
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Nav from './Nav';
import createGroupPage from "./createGroupPage";
import joinGroupPage from "./joinGroupPage";
import userProductPage from "./userProductPage";
import adminPage from "./adminPage";
import { UserContext } from "./userContext";
class App extends React.Component {
  constructor(props) {
    super(props);

    //Method to change global context variables 
    this.changeGlobalUserState = (username, groupname, groupkey, adminstatus) => {
      this.setState({
          globalUserName:username,
          globalGroupName:groupname,
          globalGroupKey:groupkey,
          globalAdminStatus:adminstatus
      })
    }
    this.state = {
      globalUserName: '',
      globalGroupName: '',
      globalGroupKey: '',
      globalAdminStatus: false,
      changeGlobalUserState: this.changeGlobalUserState,
    };
  }
  render() {
    return (
      //Context provider offers global context variables to everything
      //that's wrapped inside it (all the pages in this case).
      //Value that is passed is state of App class which contains 
      //all the global variables and the method to change them
      <UserContext.Provider value={this.state}>
        {/*We use router to tie UI navigation and URLs together*/}
        <BrowserRouter>
          <div>
            {/*Navigation bar*/}
            <Nav />
            
            <Switch>
              {/* Main Page*/}
              <Route path="/" exact>
                <div><br></br><h1>Reissusovellus etusivu</h1>
                  <p>Valitsemalla yläreunan valikosta voit luoda tai liittyä ryhmään.</p>
                </div>
              </Route>
              {/* Page to create groups */}
              <Route path="/luoryhma" component={createGroupPage} />
              {/* Page to join groups */}
              <Route path="/liityryhmaan" component={joinGroupPage} />
              {/* Product tracking page */}
              <Route path="/tuotteet" component={userProductPage} />
              {/* Admin page, navigation from userProductPage */}
              <Route path="/hallintasivu" component={adminPage} />
              {/* Any other than one of specified URLs gives error page */}

              <Route path="/">
                <h1>Sivua ei löytynyt.</h1>
                <p>Palaa käyttämällä navigointivalikkoa tai painamalla selaimen takaisin-nappia.</p>
              </Route>



            </Switch>
          </div>
        </BrowserRouter>
      </UserContext.Provider>
    )
  }
}

export default App;
