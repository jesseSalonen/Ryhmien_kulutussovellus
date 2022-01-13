import React, { Component } from 'react';
import { UserContext } from './userContext';

class adminPage extends Component {
    static contextType = UserContext;
    constructor(props) {
        super(props);
        this.state = {
            fetchedGroupMembers: [],
            fetchedLockedStatus: false,
            //used to let user know when they have deleted
            //the group successfully
            groupHasBeenDeleted: false
        }
    }

    //Fetch data from the database and set needed data to state
    //when the page loads if the current user has admin rights
    componentDidMount() {
        if (this.context.globalAdminStatus === true) {
            fetch('https://mokkireissu.herokuapp.com/groups/' + this.context.globalGroupKey)
                .then(result => result.json())
                .then(
                    (data) => {
                        data.map(item => this.setState({
                            fetchedGroupMembers: item.members,
                            fetchedLockedStatus: item.locked,
                        }))
                    },
                    (error) => {
                        alert("Kantaan ei saatu yhteyttä.")
                    }
                )
        }
    }

    //Method to swap locked status (locked -> not locked,  and vice versa)
    //and then patch the new locked status to database
    changeAndPatchLockedStatus = () => {
        let lockedStatusToPatch;
        //if group is currently locked, unlock it
        //database takes true as a boolean OR as a string but takes false only as a string 
        //--> change both to strings for consistency
        if (this.state.fetchedLockedStatus === true) {
            lockedStatusToPatch = "false";
        }
        //if group is currently unlocked, lock it
        else {
            lockedStatusToPatch = "true";
        }
        fetch('https://mokkireissu.herokuapp.com/groups/' + this.context.globalGroupKey, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                locked: lockedStatusToPatch
            })
        })
            .then(result => result.json())
            .then(
                (data) => {
                    //if PATCH call was successful, change lockedStatus to state also
                    //(Manually changing booleans since lockedStatusToPatch is a string)
                    if (this.state.fetchedLockedStatus === true) {
                        this.setState({
                            fetchedLockedStatus: false
                        })
                    }
                    else {
                        this.setState({
                            fetchedLockedStatus: true
                        })
                    }
                },
                (error) => {
                    alert("Kantaan ei saatu yhteyttä.")
                }
            )

    }

    //Method to delete the group from the database
    deleteGroupFromDatabase = () => {
        fetch('https://mokkireissu.herokuapp.com/groups/' + this.context.globalGroupKey, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(result => result.json())
            .then(
                (data) => {
                    //if group is deleted, change global states to default 
                    // = user doesn't belong to any group
                    this.context.changeGlobalUserState("", "", "", false)
                    this.setState({
                        groupHasBeenDeleted: true
                    })

                },
                (error) => {
                    alert("Kantaan ei saatu yhteyttä.")
                }
            )
    }




    render() {
        //If user is his current group's admin and hasn't deleted his group
        //show admin tools to the user
        if (this.context.globalAdminStatus && !this.state.groupHasBeenDeleted) {
            return (
                <div>
                    <h1>Ryhmän hallinta</h1>
                    <h3>Ryhmän nimi: {this.context.globalGroupName}</h3>
                    <h3>Nimimerkkisi ryhmässä: {this.context.globalUserName}</h3>
                    <h3>Liittymiskoodi: {this.context.globalGroupKey}</h3>
                    <h3>Ryhmän lukitus: {this.state.fetchedLockedStatus ? 'Päällä' : 'Pois päältä'}</h3>
                    <p>Ryhmän lukituksen ollessa päällä ryhmään ei pysty liittymään.</p>
                    <button type="button" onClick={this.changeAndPatchLockedStatus.bind(this)}>Lukitse ryhmä</button>
                    <br></br>
                    <button type="button" onClick={this.deleteGroupFromDatabase.bind(this)}>Poista ryhmä</button>

                    {/*Create table to display data of group members*/}
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Nimi</th>
                                <th>Ruoka</th>
                                <th>Pieni juoma</th>
                                <th>Iso juoma</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/*Map all the group's users fetched from database 
                               and display their data*/}
                            {this.state.fetchedGroupMembers.map(member => {
                                return (
                                    <tr>
                                        <td>{member.memberName}</td>
                                        <td>{member.burgers}</td>
                                        <td>{member.smallCans}</td>
                                        <td>{member.bigCans}</td>
                                    </tr>
                                )

                            })}
                        </tbody>
                    </table>
                </div>

            )
        }
        //When user deletes his group, let the user know and 
        //don't show any admin tools
        else if (this.state.groupHasBeenDeleted) {
            return (
                <div>
                    <h1>Ryhmä poistettu tietokannasta!</h1>
                    <p>Navigaatiopalkista pääset takaisin luomaan oman ryhmäsi <br></br>
                        tai liittymään jo luotuun ryhmään.</p>
                </div>
            )
        }
        //User doesn't belong to any group
        else {
            return (
                <h1>Et kuulu mihinkään ryhmään.</h1>
            )
        }
    }


}

export default adminPage