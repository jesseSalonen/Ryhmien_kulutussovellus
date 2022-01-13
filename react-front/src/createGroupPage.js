import React, { Component } from 'react';
import { UserContext } from "./userContext";
class createGroupPage extends Component {
    static contextType = UserContext;
    constructor(props) {
        super(props);
        this.state = {
            inputUserName: '',
            inputGroupName: '',
            fetchedGroupKey: '',
        }
    }

    //Method to create a new group and admin user to that group
    //in the database based on user's input
    postToDatabase = (event) => {
        event.preventDefault();
        fetch('https://mokkireissu.herokuapp.com/groups', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                groupName: this.state.inputGroupName,
                memberName: this.state.inputUserName
            })
        })
            .then(result => result.json())
            .then(
                (data) => {
                    //If username or group name isn't suitable, database sends a JSON that
                    //contains an error message, instead of an error response.
                    //(FOR FUTURE: check inputs before POST-call to remove unnecessary calls)
                    if (data.message) {
                        alert("Ryhmän nimi tai nimimerkkisi eivät voi olla tyhjiä. Minimipituus ryhmän nimelle on 2 merkkiä.")
                    }
                    else {
                        this.setState({
                        fetchedGroupKey: data.groupKey
                    })
                    //change globalUserState to match created user and group
                    //Adminstatus-parameter is always true since the group's creator is also the admin
                    this.context.changeGlobalUserState(this.state.inputUserName, this.state.inputGroupName,
                        this.state.fetchedGroupKey, true)
                    
                    }
                },
                (error) => {
                    alert("Kantaan ei saatu yhteyttä.")
                }
            )
    }

    //Handles input data when user inputs text for a group name
    groupNameChangeHandler = (event) => {
        this.setState({ inputGroupName: event.target.value });
    }

    //Handles input data when user inputs text for a username
    userNameChangeHandler = (event) => {
        this.setState({ inputUserName: event.target.value });
    }

    render() {
        //If user doesn't belong to any group, render form to create one
        if (this.context.globalGroupKey === '') {
            return (
                <form autoComplete="off" onSubmit={this.postToDatabase}>
                    <h1>Luo ryhmä</h1>
                    <label htmlFor="groupname">Syötä ryhmän nimi</label><br></br>
                    <input type="text" id="groupname" name="groupname" onChange={this.groupNameChangeHandler}
                        placeholder="Ryhmän nimi..."></input><br></br>

                    <label htmlFor="username">Syötä nimimerkki, jota haluat käyttää ryhmässä</label><br></br>
                    <input type="text" id="username" name="username" onChange={this.userNameChangeHandler}
                        placeholder="Nimimerkki..."></input>
                    <input type='submit' value="Luo ryhmä" />
                </form>)
        }
        //If user already belongs to a group, let them know and 
        //prevent them from creating another one
        else {
            return (
            <div>
                {/*globalAdminStatus is true if the user is the creator of the group and 
                false if the user is just a member and joined a group*/}
                <h1>Ryhmä{this.context.globalAdminStatus ? ' luotu! ' : 'än liitytty! '} Siirry tuotesivulle.</h1>
                <h3>Jos haluat poistua nykyisestä ryhmästäsi, päivitä verkkosivu.</h3>
            </div>
            )
        }

    }
}

export default createGroupPage