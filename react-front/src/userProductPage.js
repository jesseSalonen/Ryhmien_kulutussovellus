import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import burgerImage from "./images/Exports-02.png";
import smalldrinkImage from "./images/Exports-03.png";
import bigdrinkImage from "./images/Exports-04.png";
import { UserContext } from "./userContext";

class userProductPage extends Component {
    static contextType = UserContext;
    constructor(props) {
        super(props);
        this.state = {
            //Base URL that contains all groups
            allGroupsURL: "https://mokkireissu.herokuapp.com/groups/",
            
            foodAmount: 0,
            smalldrinksAmount: 0,
            bigdrinksAmount: 0,
            fetchedGroupMembers: [],
            currentUserData: {},
        };
    }
    
    //If current user belongs to a group, fetch that group's 
    //data from the database when page loads.
    componentDidMount() {
        if (this.context.globalUserName !== '') {
            //Fetch all data from a group
            fetch(this.state.allGroupsURL + "/" + this.context.globalGroupKey)
                .then(result => {
                    //404-response doesn't go straight to error block so we
                    //need to throw an error if we get 404 as a response
                    if (result.status === 404) {
                        //change global states to default = user doesn't belong to any group
                        this.context.changeGlobalUserState("", "", "", false)
                        throw new Error('404')
                    }
                    else {
                        return result.json()
                    }
                })
                
                    
                .then(
                    (data) => {
                        data.map(item => this.setState({
                            fetchedGroupMembers: item.members,  
                        }))
                        //Find current user's data from members and save it to state
                        this.setState({
                            currentUserData: this.state.fetchedGroupMembers.find(
                                ({ memberName }) => memberName === this.context.globalUserName),
                        })

                        //Set product amounts in state equal to user's fetched product amounts
                        this.setState((state) => ({
                            foodAmount: state.currentUserData.burgers,
                            smalldrinksAmount: state.currentUserData.smallCans,
                            bigdrinksAmount: state.currentUserData.bigCans
                        }))
                    },
                    (error) => {
                        //catching our own error thrown when we get a 404 response
                        if (error.message === '404') {
                            alert("Ryhmän luoja on poistanut ryhmän.")
                        }
                        //if cannot reach database
                        else {
                            alert("Kantaan ei saatu yhteyttä.")
                        }
                    }
                )
                
        }
    }

    //Handles PATCH requests to database, changes product amounts in the database
    //Product parameter options are "food", "smalldrink" and "bigdrink" passed as a string
    patchProductsToDatabase = (product) => {
        let amountToPatch;
        //only patch products if user belongs to a group
        if (this.context.globalUserName !== '') {
            
            const productPostURL = this.state.allGroupsURL + "/" +
                this.context.globalGroupKey + "/" + this.context.globalUserName

            //Change food amounts in database
            if (product === "food") {
                //databases only takes 0 as a string, other amounts work as numbers
                if (this.state.foodAmount === 0) {
                    amountToPatch = "0"
                }
                else {
                    amountToPatch = this.state.foodAmount
                }
                fetch(productPostURL, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        burgers: amountToPatch
                    })
                })
                    .then(result => result.json())
                    .then(
                        (data) => {
                            //If database can be reached but the amount of products
                            //cannot be changed, that means the group has been deleted
                            if (data.modifiedCount === 0) {
                                alert("Ryhmän luoja on poistanut ryhmän.")
                                //change global states to default = user doesn't belong to any group
                                this.context.changeGlobalUserState("", "", "", false)
                            }
                        },
                        (error) => {
                            console.log(error);
                        }
                    )
            }

            //Change small drink amounts in database
            if (product === "smalldrink") {
                //databases only takes 0 as a string, other amounts work as numbers
                if (this.state.smalldrinksAmount === 0) {
                    amountToPatch = "0"
                }
                else {
                    amountToPatch = this.state.smalldrinksAmount
                }
                fetch(productPostURL, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        smallCans: amountToPatch
                    })
                })
                    .then(result => result.json())
                    .then(
                        (data) => {
                            //If database can be reached but the amount of products
                            //cannot be changed, that means the group has been deleted
                            if (data.modifiedCount === 0) {
                                alert("Ryhmän luoja on poistanut ryhmän.")
                                //change global states to default = user doesn't belong to any group
                                this.context.changeGlobalUserState("", "", "", false)
                            }
                        },
                        (error) => {
                            console.log(error);
                        }
                    )
            }

            //Change big drink amounts in database
            if (product === "bigdrink") {
                //databases only takes 0 as a string, other amounts work as numbers
                if (this.state.bigdrinksAmount === 0) {
                    amountToPatch = "0"
                }
                else {
                    amountToPatch = this.state.bigdrinksAmount
                }
                fetch(productPostURL, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        bigCans: amountToPatch
                    })
                })
                    .then(result => result.json())
                    .then(
                        (data) => {
                            //If database can be reached but the amount of products
                            //cannot be changed, that means the group has been deleted
                            if (data.modifiedCount === 0) {
                                alert("Ryhmän luoja on poistanut ryhmän.")
                                //change global states to default = user doesn't belong to any group
                                this.context.changeGlobalUserState("", "", "", false)
                            }
                        },
                        (error) => {
                            console.log(error);
                        }
                    )
            }
        }
    }

    //Method to increase or decrease the amount of food 
    //and then update new amount into database.
    changeFoodAmount = (type) => {
        if (type === '+') {
            //setState is async so have to use callback to get updated state value
            this.setState({ foodAmount: this.state.foodAmount + 1 }, () => {
                this.patchProductsToDatabase("food")
            })

        }
        else if (type === '-' && this.state.foodAmount > 0) {
            //setState is async so have to use callback to get updated state value
            this.setState({ foodAmount: this.state.foodAmount - 1 }, () => {
                this.patchProductsToDatabase("food")
            })

        }
    }

    //Method to increase or decrease the amount of small drinks
    //and then update new amount into database.
    changeSmalldrinkAmount = (type) => {
        if (type === '+') {
            //setState is async so have to use callback to get updated state value
            this.setState({ smalldrinksAmount: this.state.smalldrinksAmount + 1 }, () => {
                this.patchProductsToDatabase("smalldrink")
            })

        }
        else if (type === '-' && this.state.smalldrinksAmount > 0) {
            //setState is async so have to use callback to get updated state value
            this.setState({ smalldrinksAmount: this.state.smalldrinksAmount - 1 }, () => {
                this.patchProductsToDatabase("smalldrink")
            })
        }
    }

    //Method to increase or decrease the amount of big drinks
    //and then update new amount into database.
    changeBigdrinkAmount = (type) => {
        if (type === '+') {
            //setState is async so have to use callback to get updated state value
            this.setState({ bigdrinksAmount: this.state.bigdrinksAmount + 1 }, () => {
                this.patchProductsToDatabase("bigdrink")
            })

        }
        else if (type === '-' && this.state.bigdrinksAmount > 0) {
            //setState is async so have to use callback to get updated state value
            this.setState({ bigdrinksAmount: this.state.bigdrinksAmount - 1 }, () => {
                this.patchProductsToDatabase("bigdrink")
            })
        }
    }

    render() {
        //Render product page if user belongs to a group.
        if (this.context.globalGroupKey !== '') {
            return (
            <div>
                <h1>Ryhmän nimi: {this.context.globalGroupName}</h1>
                <h2>Nimimerkkisi ryhmässä: {this.context.globalUserName}</h2>
                <h2>Liittymiskoodi: {this.context.globalGroupKey}</h2>
                
                {/*only show navigation to admin page if user is the admin*/}
                {this.context.globalAdminStatus &&
                    <Link to="/hallintasivu">
                    <button type="button">Hallintasivu</button>
                    </Link>
                }
                
                
                <br></br>
                <div className="grid-container">
                    <img src={burgerImage} alt="Burger" id="kuva" width="250" height="250" />
                    <p id="gridtext">Burger</p>
                    <p id="gridtext">{this.state.foodAmount} kpl</p>
                    <button type="button" id="gridbutton" onClick={this.changeFoodAmount.bind(this, '+')}>+</button>
                    <button type="button" id="gridbutton" onClick={this.changeFoodAmount.bind(this, '-')}>-</button>

                    <img src={smalldrinkImage} alt="Small drink can" id="kuva" width="250" height="250" />
                    <p id="gridtext">Juoma, pieni</p>
                    <p id="gridtext">{this.state.smalldrinksAmount} kpl</p>
                    <button type="button" id="gridbutton" onClick={this.changeSmalldrinkAmount.bind(this, '+')}>+</button>
                    <button type="button" id="gridbutton" onClick={this.changeSmalldrinkAmount.bind(this, '-')}>-</button>

                    <img src={bigdrinkImage} alt="Big drink can" id="kuva" width="250" height="250" />
                    <p id="gridtext">Juoma, iso</p>
                    <p id="gridtext">{this.state.bigdrinksAmount} kpl</p>
                    <button type="button" id="gridbutton" onClick={this.changeBigdrinkAmount.bind(this, '+')}>+</button>
                    <button type="button" id="gridbutton" onClick={this.changeBigdrinkAmount.bind(this, '-')}>-</button>
                </div>
            </div>


        )
        }
        //If user doesnt belong to a group, let them know
        //and don't show the product UI
        else {
            return (
                <div>
                    <h1>Et kuulu tällä hetkellä mihinkään ryhmään.</h1>
                    <h3>Löydät ryhmän luomisen tai ryhmään liittymisen navigaatiopalkista.</h3>
                </div>
            )
        }
        
    }


}

export default userProductPage