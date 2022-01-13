import React, { Component } from 'react';
import { UserContext } from "./userContext";
class joinGroupPage extends Component {
    static contextType = UserContext;
    constructor(props) {
        super(props);
        this.fetchGroupData = this.fetchGroupData.bind(this);
        this.state = {
            inputUserName: '',
            inputGroupKey: '',
            fetchedGroupName: ''
        }
    }

    //Method to patch new member into group in database
    patchToDatabase = (event) => {
        event.preventDefault();
        fetch('https://mokkireissu.herokuapp.com/groups/' + this.state.inputGroupKey, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                memberName: this.state.inputUserName
            })
        })
            .then(result => result.json())
            .then(
                (data) => {
                    //In case of a fetch error, database sends a JSON that 
                    //contains an error message, instead of an error response.
                    if (data.message) {
                        //Empty name -error
                        if (data.message === "Invalid request") {
                            alert("Nimimerkki ei voi olla tyhjä.")
                        }
                        //No group found with groupKey -error
                        if (data.message === "No valid entry found for given key") {
                            alert ("Annetulla koodilla ei löytynyt ryhmää.")
                        }
                        //Name already in use in the group -error
                        if (data.message === "Member with given name already exists") {
                            alert ("Annettu nimimerkki on jo käytössä ryhmässä.")
                        }
                        //Group is locked
                        if (data.message === "The group is locked") {
                            alert ("Ryhmään liittyminen on lukittu ryhmän perustajan toimesta.")
                        }


                    }
                    //if there is no error message, the POST call was successful
                    //and we can fetch group data from the group we just joined
                    else {
                        this.fetchGroupData()
                    }

                },
                //Some errors do send an error response for some reason
                (error) => {
                    //Empty group key -error
                    if (String(error) === "SyntaxError: Unexpected token < in JSON at position 0") {
                        alert("Ryhmän liittymiskoodi ei voi olla tyhjä.")
                    }
                    else {
                        alert("Tietokantaan ei saatu yhteyttä")
                    }     
                }
            )
    }

    //Method to fetch group data from the database and set needed data to state
    fetchGroupData = () => {
        fetch('https://mokkireissu.herokuapp.com/groups/' + this.state.inputGroupKey)
            .then(result => result.json())
            .then(
                (data) => {
                        //Fetch returns array that contains an object instead 
                        //of just an object
                        data.map(item => this.setState({
                            fetchedGroupName: item.groupName
                        }))
                        //change globalUserState to match created user and joined group
                        //Adminstatus-parameter is always false since admin rights belong to the group's creator
                        this.context.changeGlobalUserState(this.state.inputUserName, this.state.fetchedGroupName,
                            this.state.inputGroupKey, false)
                },
                (error) => {
                    alert("Tietokantaan ei saatu yhteyttä")
                }

            )
    }

    //Handles input data when user inputs text for a group key
    groupKeyChangeHandler = (event) => {
        this.setState({ inputGroupKey: event.target.value });
    }

    //Handles input data when user inputs text for a username
    userNameChangeHandler = (event) => {
        this.setState({ inputUserName: event.target.value });
    }

    render() {
        //If user doesn't belong to any group, render form to join one
        if (this.context.globalGroupKey === '') {
            return (
                <form autoComplete="off" onSubmit={this.patchToDatabase}>
                    <h1>Liity ryhmään</h1>
                    <label htmlFor="groupcode">Liity jo luotuun ryhmään syöttämällä ryhmän liittymiskoodi</label><br></br>
                    <input type="text" id="groupcode" name="groupcode" onChange={this.groupKeyChangeHandler}
                        placeholder="Syötä koodi..."></input><br></br>

                    <label htmlFor="username">Syötä nimimerkkisi, jota haluat käyttää ryhmässä.</label><br></br>
                    <input type="text" id="username" name="username" onChange={this.userNameChangeHandler}
                        placeholder="Nimimerkki..."></input>

                    <input type="submit" value="Liity ryhmään" />
                </form>

            )
        }
        //If user already belongs to a group, let them know and 
        //prevent them from joining another one
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

export default joinGroupPage